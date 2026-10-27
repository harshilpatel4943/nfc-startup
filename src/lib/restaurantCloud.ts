import { createDefaultSetup, type DemoSetup, type GuestFeedback, type GuestRequest } from '../data/demoStore';
import type { RestaurantConfig } from '../config/restaurantConfig';
import { supabase } from './supabase';

export const restaurantSlug = import.meta.env.VITE_RESTAURANT_SLUG || 'the-cave';

export function createClientId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') crypto.getRandomValues(bytes);
  else for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function normalizeServices(value: unknown, fallback: DemoSetup['services']): DemoSetup['services'] {
  if (Array.isArray(value)) {
    const byId = new Map(value.filter((item): item is { id: string; isEnabled?: boolean } => Boolean(item) && typeof item === 'object' && typeof (item as { id?: unknown }).id === 'string').map((item) => [item.id, item]));
    return fallback.map((service) => ({ ...service, ...(byId.get(service.id) ?? {}), isEnabled: typeof byId.get(service.id)?.isEnabled === 'boolean' ? byId.get(service.id)!.isEnabled! : service.isEnabled }));
  }
  if (value && typeof value === 'object') {
    const flags = value as Record<string, unknown>;
    return fallback.map((service) => {
      const stored = flags[service.id];
      const enabled = typeof stored === 'boolean' ? stored : stored && typeof stored === 'object' && typeof (stored as { isEnabled?: unknown }).isEnabled === 'boolean' ? (stored as { isEnabled: boolean }).isEnabled : service.isEnabled;
      return { ...service, isEnabled: enabled };
    });
  }
  return fallback;
}

export function getPageRestaurantSlug(): string {
  if (typeof window === 'undefined') return restaurantSlug;
  return new URLSearchParams(window.location.search).get('restaurant') || restaurantSlug;
}

export async function getRestaurantId(slug = restaurantSlug): Promise<string> {
  if (!supabase) throw new Error('The restaurant service is not configured. Contact your site administrator.');
  const { data, error } = await supabase.from('restaurants').select('id').eq('slug', slug).maybeSingle();
  if (error) throw new Error('Could not load this restaurant. Check the link and try again.');
  if (!data) throw new Error(`Restaurant “${slug}” was not found.`);
  return data.id;
}

export async function uploadRestaurantImage(file: File): Promise<string> {
  if (!supabase) throw new Error('The restaurant service is not configured.');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPEG, PNG, or WebP image.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image must be 5 MB or smaller.');
  const id = await getRestaurantId(getPageRestaurantSlug());
  const form = new FormData();
  form.set('restaurantId', id);
  form.set('file', file, file.name);
  const { data, error } = await supabase.functions.invoke('upload-restaurant-image', { body: form });
  if (error || typeof data?.publicUrl !== 'string') throw new Error('Image upload failed. Choose a JPEG, PNG, or WebP image under 5 MB, then try again.');
  return data.publicUrl;
}

export async function submitCloudRequest(tableNumber: number, type: string): Promise<void> {
  if (!supabase) throw new Error('The restaurant service is not configured.');
  const restaurantId = await getRestaurantId(getPageRestaurantSlug());
  const { error } = await supabase.from('guest_requests').insert({ restaurant_id: restaurantId, table_number: tableNumber, request_type: type });
  if (error) throw new Error('The request could not be sent. Please try again in a moment.');
}

export async function submitCloudFeedback(tableNumber: number, entry: Omit<GuestFeedback, 'id' | 'createdAt' | 'status'>): Promise<void> {
  if (!supabase) throw new Error('The restaurant service is not configured.');
  const restaurantId = await getRestaurantId(getPageRestaurantSlug());
  const { error } = await supabase.from('guest_feedback').insert({
    restaurant_id: restaurantId,
    table_number: tableNumber,
    overall: entry.overall,
    food_rating: entry.foodRating,
    ambience_rating: entry.ambienceRating,
    service_rating: entry.serviceRating,
    visit_again: entry.visitAgain,
    message: entry.message,
  });
  if (error) throw new Error('Feedback could not be sent. Please try again in a moment.');
}

export async function loadCloudInbox(): Promise<{ requests: GuestRequest[]; feedback: GuestFeedback[] }> {
  if (!supabase) throw new Error('The restaurant service is not configured.');
  const restaurantId = await getRestaurantId(getPageRestaurantSlug());
  const requestExpiryCutoff = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const [requestsResult, feedbackResult] = await Promise.all([
    supabase.from('guest_requests').select('*').eq('restaurant_id', restaurantId).gte('created_at', requestExpiryCutoff).order('created_at', { ascending: false }),
    supabase.from('guest_feedback').select('*').eq('restaurant_id', restaurantId).order('created_at', { ascending: false }),
  ]);
  if (requestsResult.error || feedbackResult.error) throw new Error('Could not load the guest inbox. Please refresh and try again.');
  return {
    requests: (requestsResult.data ?? []).map((row) => ({ id: row.id, tableNumber: row.table_number, type: row.request_type, createdAt: new Date(row.created_at).toLocaleString() })),
    feedback: (feedbackResult.data ?? []).map((row) => ({ id: row.id, tableNumber: row.table_number, overall: row.overall ?? '', foodRating: row.food_rating ?? 0, ambienceRating: row.ambience_rating ?? 0, serviceRating: row.service_rating ?? 0, visitAgain: row.visit_again ?? '', message: row.message ?? '', createdAt: new Date(row.created_at).toLocaleString(), status: row.status })),
  };
}

export async function deleteCloudRequest(id: string): Promise<void> {
  if (!supabase) throw new Error('The restaurant service is not configured.');
  const { error } = await supabase.from('guest_requests').delete().eq('id', id);
  if (error) throw new Error('Could not remove this request. Check your connection and try again.');
}

export async function loadPublicServices(slug = getPageRestaurantSlug()): Promise<DemoSetup['services'] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('restaurants').select('services').eq('slug', slug).eq('is_published', true).maybeSingle();
  if (error) throw new Error('Could not load guest services. Please refresh and try again.');
  return data?.services == null ? null : normalizeServices(data.services, createDefaultSetup().services);
}

export async function isPublicTableActive(tableNumber: number, slug = getPageRestaurantSlug()): Promise<boolean> {
  if (!supabase) return true;
  const restaurantId = await getRestaurantId(slug);
  const { data, error } = await supabase.from('restaurant_tables').select('is_active')
    .eq('restaurant_id', restaurantId).eq('table_number', tableNumber).maybeSingle();
  if (error) throw new Error('Could not check table availability. Please refresh and try again.');
  // The public RLS policy only exposes active rows, so an absent row is offline.
  return data?.is_active === true;
}

export async function loadPublicPopularItems(slug = getPageRestaurantSlug()): Promise<DemoSetup['menuItems']> {
  if (!supabase) return [];
  const { data: restaurant, error: restaurantError } = await supabase.from('restaurants').select('id').eq('slug', slug).eq('is_published', true).maybeSingle();
  if (restaurantError) throw new Error('The customer page could not load. Please try again.');
  if (!restaurant) return [];
  const [{ data: categories, error: categoriesError }, { data: items, error: itemsError }] = await Promise.all([
    supabase.from('menu_categories').select('id,category_key,name').eq('restaurant_id', restaurant.id),
    supabase.from('menu_items').select('*').eq('restaurant_id', restaurant.id).eq('is_available', true)
      .or('is_popular.eq.true,is_todays_special.eq.true')
      .order('is_todays_special', { ascending: false }).order('sort_order').limit(8),
  ]);
  if (categoriesError || itemsError) throw new Error('Featured dishes could not load. Please refresh and try again.');
  const categoryNames = new Map((categories ?? []).map((category) => [category.id, category.name]));
  return (items ?? []).map((item) => ({ id: item.source_id, name: item.name, description: item.description ?? '', price: Number(item.price), category: categoryNames.get(item.category_id) ?? '', imageUrl: item.image_url ?? '', portionLabel: item.portion_label ?? undefined, tasteNote: item.taste_note ?? undefined, tags: item.tags ?? [], spicinessLevel: item.spiciness_level ?? undefined, isPopular: true, isAvailable: true, isMaharajaSpecial: item.is_maharaja_special, isTodaysSpecial: item.is_todays_special, isVegetarian: item.is_vegetarian }));
}

export async function updateCloudFeedback(id: string, status: GuestFeedback['status']): Promise<void> {
  if (!supabase) throw new Error('The restaurant service is not configured.');
  const { error } = await supabase.from('guest_feedback').update({ status }).eq('id', id);
  if (error) throw new Error('Could not update feedback. Please try again.');
}

export async function loadPublicRestaurantConfig(slug = getPageRestaurantSlug()): Promise<RestaurantConfig | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('restaurants').select('*').eq('slug', slug).eq('is_published', true).maybeSingle();
  if (error) throw new Error('The customer page could not load. Please try again.');
  if (!data) return null;
  return restaurantToConfig(data);
}

function restaurantToConfig(data: Record<string, any>): RestaurantConfig {
  return {
    name: data.name,
    tagline: data.tagline ?? '',
    descriptor: data.descriptor ?? '',
    menuTitle: data.menu_title ?? `${data.name} MENU`,
    menuSubtitle: data.menu_subtitle ?? data.descriptor ?? '',
    menuFooterNote: data.menu_footer_note ?? '',
    heroDescription: data.description ?? '',
    phone: data.phone ?? '',
    whatsapp: data.whatsapp ?? '',
    address: data.address ?? '',
    city: data.city ?? '',
    googleReviewUrl: data.google_review_url ?? '',
    instagramUrl: data.instagram_url ?? '',
    instagramProfileUrl: data.instagram_profile_url ?? '',
    mapsUrl: data.maps_url ?? '',
    wifiNetwork: data.wifi_network ?? '',
    wifiPassword: data.wifi_password ?? '',
    openingHours: data.opening_hours ?? { days: '', lunch: '', dinner: '' },
    logoUrl: data.logo_url ?? '',
    coverImageUrl: data.cover_image_url ?? '',
  };
}

export async function loadCloudAdminSetup(base: DemoSetup): Promise<{ setup: DemoSetup; publishedSetup: DemoSetup }> {
  if (!supabase) throw new Error('The restaurant service is not configured.');
  const [restaurantResult] = await Promise.all([supabase.from('restaurants').select('*').eq('slug', getPageRestaurantSlug()).single()]);
  if (restaurantResult.error) throw new Error('Could not load this restaurant workspace. Check the restaurant link and try again.');
  const restaurant = restaurantResult.data;
  const { data: membership, error: membershipError } = await supabase.from('restaurant_admins').select('restaurant_id').eq('restaurant_id', restaurant.id).maybeSingle();
  if (membershipError) throw new Error('Could not verify restaurant access. Please sign in again.');
  if (!membership) throw new Error(`Your account does not have admin access to ${restaurant.name}. Ask the site administrator to grant access.`);
  const [draftResult, tablesResult, categoriesResult, itemsResult] = await Promise.all([
    supabase.from('restaurant_drafts').select('draft').eq('restaurant_id', restaurant.id).maybeSingle(),
    supabase.from('restaurant_tables').select('*').eq('restaurant_id', restaurant.id).order('table_number'),
    supabase.from('menu_categories').select('*').eq('restaurant_id', restaurant.id).order('sort_order'),
    supabase.from('menu_items').select('*').eq('restaurant_id', restaurant.id).order('sort_order'),
  ]);
  if (draftResult.error && draftResult.error.code !== 'PGRST116') throw new Error('Could not load the restaurant draft. Please try again.');
  if (tablesResult.error || categoriesResult.error || itemsResult.error) throw new Error('Could not load restaurant content. Please refresh and try again.');
  const categoriesById = new Map((categoriesResult.data ?? []).map((category) => [category.id, category]));
  const config = restaurantToConfig(restaurant);
  const publishedSetup: DemoSetup = {
    ...base,
    restaurant: { ...base.restaurant, ...(config ?? {}), wifiNetwork: restaurant.wifi_network ?? '', wifiPassword: restaurant.wifi_password ?? '', openingHours: restaurant.opening_hours ?? base.restaurant.openingHours },
    tables: (tablesResult.data ?? []).map((table) => ({ id: table.id, number: table.table_number, isActive: table.is_active })),
    menuCategories: (categoriesResult.data ?? []).filter((category) => category.is_active).map((category) => ({ id: category.category_key, name: category.name, subtitle: category.subtitle ?? '', imageUrl: category.image_url ?? '' })),
    menuItems: (itemsResult.data ?? []).map((item) => {
      const category = categoriesById.get(item.category_id);
      return { id: item.source_id, name: item.name, description: item.description ?? '', price: Number(item.price), category: category?.category_key ?? '', isVegetarian: item.is_vegetarian, isMaharajaSpecial: item.is_maharaja_special, isTodaysSpecial: item.is_todays_special, isPopular: item.is_popular, imageUrl: item.image_url ?? '', portionLabel: item.portion_label ?? undefined, tasteNote: item.taste_note ?? undefined, isAvailable: item.is_available, spicinessLevel: item.spiciness_level ?? undefined, tags: item.tags ?? [] };
    }),
    services: normalizeServices(restaurant.services, base.services),
  };
  const draft = draftResult.data?.draft as Partial<DemoSetup> | null;
  const setup = draft ? {
    ...publishedSetup,
    ...draft,
    menuCategories: Array.isArray(draft.menuCategories) ? draft.menuCategories : publishedSetup.menuCategories,
    menuItems: Array.isArray(draft.menuItems) ? draft.menuItems.map((item) => {
      const publishedItem = publishedSetup.menuItems.find((entry) => entry.id === item.id);
      return { ...item, portionLabel: item.portionLabel ?? publishedItem?.portionLabel, tasteNote: item.tasteNote ?? publishedItem?.tasteNote };
    }) : publishedSetup.menuItems,
    services: normalizeServices(draft.services, publishedSetup.services),
    restaurant: { ...publishedSetup.restaurant, ...(draft.restaurant ?? {}) },
  } : publishedSetup;
  return { setup, publishedSetup };
}

export async function saveCloudDraft(setup: DemoSetup): Promise<void> {
  if (!supabase) throw new Error('The restaurant service is not configured.');
  const id = await getRestaurantId(getPageRestaurantSlug());
  const { error } = await supabase.from('restaurant_drafts').upsert({ restaurant_id: id, draft: setup, updated_at: new Date().toISOString() });
  if (error) throw new Error('Could not save this draft. Please try again.');
}

export async function publishCloudSetup(setup: DemoSetup): Promise<string> {
  if (!supabase) throw new Error('The restaurant service is not configured.');
  const id = await getRestaurantId(getPageRestaurantSlug());
  const { data, error } = await supabase.rpc('publish_restaurant_setup', { p_slug: getPageRestaurantSlug(), p_setup: setup });
  if (error) {
    console.error('Publishing restaurant changes failed:', error.code);
    throw new Error('Could not publish these changes. Check the form and your access, then try again.');
  }
  const keepPaths = new Set([
    setup.restaurant.logoUrl, setup.restaurant.coverImageUrl,
    ...setup.menuCategories.map((category) => category.imageUrl),
    ...setup.menuItems.map((item) => item.imageUrl),
  ].filter((url): url is string => !!url).flatMap((url) => {
    try {
      const pathname = new URL(url).pathname;
      const marker = pathname.indexOf('/storage/v1/object/public/restaurant-assets/');
      const path = marker >= 0 ? decodeURIComponent(pathname.slice(marker + '/storage/v1/object/public/restaurant-assets/'.length)) : '';
      return path.startsWith(`${id}/`) ? [path] : [];
    } catch { return []; }
  }));
  const { data: assets, error: listError } = await supabase.storage.from('restaurant-assets').list(id, { limit: 1000 });
  const obsoletePaths = listError ? [] : (assets ?? [])
    .filter((asset) => asset.id && !keepPaths.has(`${id}/${asset.name}`))
    .map((asset) => `${id}/${asset.name}`);
  if (listError) console.warn('Published successfully; unused restaurant images could not be checked:', listError.message);
  if (obsoletePaths.length) {
    const { error: cleanupError } = await supabase.storage.from('restaurant-assets').remove(obsoletePaths);
    if (cleanupError) console.warn('Published successfully; some replaced images could not be cleaned up:', cleanupError.message);
  }
  return typeof data === 'string' ? data : new Date().toISOString();
}
