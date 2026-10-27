import { createClient } from 'npm:@supabase/supabase-js@2.117.3';

const maxBytes = 5 * 1024 * 1024;
const localOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://192.168.1.7:5173',
]);
const configuredOrigins = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',').map((origin) => origin.trim()).filter(Boolean);
const allowedOrigins = new Set([...localOrigins, ...configuredOrigins]);

function corsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

function detectImageType(bytes: Uint8Array): { mime: string; extension: string } | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mime: 'image/jpeg', extension: 'jpg' };
  }
  if (bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte)) {
    return { mime: 'image/png', extension: 'png' };
  }
  if (bytes.length >= 12
    && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF'
    && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP') {
    return { mime: 'image/webp', extension: 'webp' };
  }
  return null;
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin') ?? '';
  if (!allowedOrigins.has(origin)) return new Response('Origin not allowed.', { status: 403 });
  const headers = corsHeaders(origin);
  if (request.method === 'OPTIONS') return new Response('ok', { headers });
  if (request.method !== 'POST') return new Response('Method not allowed.', { status: 405, headers });

  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (contentLength > maxBytes + 64 * 1024) return new Response('Image must be 5 MB or smaller.', { status: 413, headers });

  const authorization = request.headers.get('authorization');
  const projectUrl = Deno.env.get('SUPABASE_URL');
  const publishableKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEY');
  if (!authorization || !projectUrl || !publishableKey) {
    return new Response('Sign in and try again.', { status: 401, headers });
  }

  try {
    const client = createClient(projectUrl, publishableKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: authorization } },
    });
    const { data: authData, error: authError } = await client.auth.getUser();
    if (authError || !authData.user) return new Response('Sign in and try again.', { status: 401, headers });

    const form = await request.formData();
    const restaurantId = form.get('restaurantId');
    const file = form.get('file');
    if (typeof restaurantId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(restaurantId)
      || !(file instanceof File)) {
      return new Response('Choose a valid restaurant and image.', { status: 400, headers });
    }
    if (file.size === 0 || file.size > maxBytes) return new Response('Image must be 5 MB or smaller.', { status: 413, headers });

    const imageType = detectImageType(new Uint8Array(await file.arrayBuffer()));
    if (!imageType || file.type !== imageType.mime) {
      return new Response('Choose a valid JPEG, PNG, or WebP image.', { status: 415, headers });
    }

    const path = `${restaurantId}/${crypto.randomUUID()}.${imageType.extension}`;
    const { error: uploadError } = await client.storage.from('restaurant-assets').upload(path, file, {
      contentType: imageType.mime,
      upsert: false,
    });
    if (uploadError) return new Response('Image upload failed. Check your restaurant access and try again.', { status: 403, headers });

    const publicUrl = client.storage.from('restaurant-assets').getPublicUrl(path).data.publicUrl;
    return Response.json({ publicUrl }, { headers });
  } catch {
    return new Response('Image upload failed. Please try again.', { status: 400, headers });
  }
});
