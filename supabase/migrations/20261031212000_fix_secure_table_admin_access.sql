-- Keep table tokens private from guests while allowing restaurant admins to
-- retrieve them for QR/NFC link management. New tables get a token automatically.

alter table public.restaurant_tables
  alter column access_token set default encode(gen_random_bytes(18), 'hex');

grant select (access_token) on public.restaurant_tables to authenticated;
