-- Run after the-cave-menu.sql in Supabase SQL Editor.
-- One Supabase project can host multiple restaurants; all records are scoped by restaurant_id.

create extension if not exists pgcrypto;

create table if not exists public.restaurant_admins (
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (restaurant_id, user_id)
);

create or replace function public.is_restaurant_admin(target_restaurant uuid)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $function$
  select exists (
    select 1 from public.restaurant_admins a
    where a.restaurant_id = target_restaurant and a.user_id = (select auth.uid())
  )
$function$;
revoke all on function public.is_restaurant_admin(uuid) from public, anon, authenticated;
grant execute on function public.is_restaurant_admin(uuid) to authenticated;

create table if not exists public.restaurant_tables (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  table_number integer not null check (table_number > 0),
  label text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (restaurant_id, table_number)
);

create table if not exists public.guest_requests (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  table_id uuid references public.restaurant_tables(id) on delete set null,
  table_number integer not null,
  request_type text not null,
  status text not null default 'New' check (status in ('New', 'In progress', 'Done')),
  created_at timestamptz not null default now()
);

create table if not exists public.guest_feedback (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  table_id uuid references public.restaurant_tables(id) on delete set null,
  table_number integer,
  overall text,
  food_rating smallint check (food_rating between 1 and 5),
  ambience_rating smallint check (ambience_rating between 1 and 5),
  service_rating smallint check (service_rating between 1 and 5),
  visit_again text,
  message text,
  status text not null default 'New' check (status in ('New', 'Reviewed')),
  created_at timestamptz not null default now()
);

create table if not exists public.restaurant_drafts (
  restaurant_id uuid primary key references public.restaurants(id) on delete cascade,
  draft jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.menu_items add column if not exists image_url text;
alter table public.menu_items add column if not exists is_popular boolean not null default false;
alter table public.menu_items add column if not exists is_todays_special boolean not null default false;
alter table public.restaurants add column if not exists logo_url text;
alter table public.restaurants add column if not exists cover_image_url text;
alter table public.restaurants add column if not exists instagram_profile_url text;
alter table public.restaurants add column if not exists wifi_network text;
alter table public.restaurants add column if not exists wifi_password text;
alter table public.restaurants add column if not exists opening_hours jsonb not null default '{}'::jsonb;
alter table public.restaurants add column if not exists services jsonb not null default '[]'::jsonb;

alter table public.restaurant_admins enable row level security;
alter table public.restaurant_tables enable row level security;
alter table public.guest_requests enable row level security;
alter table public.guest_feedback enable row level security;
alter table public.restaurant_drafts enable row level security;

revoke all privileges on public.restaurant_admins from anon, authenticated;
grant select on public.restaurant_admins to authenticated;

revoke all privileges on public.restaurants, public.menu_categories, public.menu_items,
  public.restaurant_tables, public.guest_requests, public.guest_feedback, public.restaurant_drafts
  from anon, authenticated;
grant select on public.restaurants, public.menu_categories, public.menu_items, public.restaurant_tables
  to anon, authenticated;

grant update (name, tagline, descriptor, menu_title, menu_subtitle, menu_footer_note, description,
  phone, whatsapp, address, city, google_review_url, instagram_url, instagram_profile_url,
  maps_url, logo_url, cover_image_url, wifi_network, wifi_password, opening_hours,
  services, is_published) on public.restaurants to authenticated;
grant insert, delete on public.menu_categories to authenticated;
grant update (name, subtitle, image_url, sort_order, is_active) on public.menu_categories to authenticated;
grant insert, delete on public.menu_items to authenticated;
grant update (category_id, name, description, price, is_vegetarian, is_maharaja_special,
  is_todays_special, is_popular, image_url, portion_label, taste_note, spiciness_level,
  tags, is_available, sort_order) on public.menu_items to authenticated;
grant update (label, is_active) on public.restaurant_tables to authenticated;
grant insert (restaurant_id, table_number, label, is_active) on public.restaurant_tables to authenticated;
grant delete on public.restaurant_tables to authenticated;

grant select, delete on public.guest_requests to authenticated;
grant insert (restaurant_id, table_number, request_type) on public.guest_requests to anon, authenticated;
grant select on public.guest_feedback to authenticated;
grant insert (restaurant_id, table_number, overall, food_rating, ambience_rating, service_rating, visit_again, message)
  on public.guest_feedback to anon, authenticated;
grant update (status) on public.guest_feedback to authenticated;
grant select, insert, update on public.restaurant_drafts to authenticated;

drop policy if exists "Admins can read own memberships" on public.restaurant_admins;
create policy "Admins can read own memberships" on public.restaurant_admins
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "Admins read restaurant profile" on public.restaurants;
create policy "Admins read restaurant profile" on public.restaurants
  for select to authenticated using (public.is_restaurant_admin(id));

drop policy if exists "Admins manage restaurant tables" on public.restaurant_tables;
create policy "Admins manage restaurant tables" on public.restaurant_tables
  for all to authenticated using (public.is_restaurant_admin(restaurant_id))
  with check (public.is_restaurant_admin(restaurant_id));

drop policy if exists "Guests can request service for active tables" on public.guest_requests;
create policy "Guests can request service for active tables" on public.guest_requests
  for insert to anon, authenticated with check (
    exists (select 1 from public.restaurants r where r.id = restaurant_id and r.is_published)
    and exists (select 1 from public.restaurant_tables t where t.restaurant_id = guest_requests.restaurant_id
      and t.table_number = guest_requests.table_number and t.is_active)
  );
drop policy if exists "Admins read and update guest requests" on public.guest_requests;
drop policy if exists "Admins update guest requests" on public.guest_requests;
create policy "Admins read and update guest requests" on public.guest_requests
  for select to authenticated using (public.is_restaurant_admin(restaurant_id));
create policy "Admins update guest requests" on public.guest_requests
  for update to authenticated using (public.is_restaurant_admin(restaurant_id))
  with check (public.is_restaurant_admin(restaurant_id));

drop policy if exists "Guests can submit feedback" on public.guest_feedback;
create policy "Guests can submit feedback" on public.guest_feedback
  for insert to anon, authenticated with check (
    exists (select 1 from public.restaurants r where r.id = restaurant_id and r.is_published)
    and (table_number is null or exists (
      select 1 from public.restaurant_tables t where t.restaurant_id = guest_feedback.restaurant_id
        and t.table_number = guest_feedback.table_number and t.is_active
    ))
  );
drop policy if exists "Admins read and update guest feedback" on public.guest_feedback;
drop policy if exists "Admins update guest feedback" on public.guest_feedback;
create policy "Admins read and update guest feedback" on public.guest_feedback
  for select to authenticated using (public.is_restaurant_admin(restaurant_id));
create policy "Admins update guest feedback" on public.guest_feedback
  for update to authenticated using (public.is_restaurant_admin(restaurant_id))
  with check (public.is_restaurant_admin(restaurant_id));

drop policy if exists "Admins manage restaurant drafts" on public.restaurant_drafts;
create policy "Admins manage restaurant drafts" on public.restaurant_drafts
  for all to authenticated using (public.is_restaurant_admin(restaurant_id))
  with check (public.is_restaurant_admin(restaurant_id));

drop policy if exists "Admins update restaurant profile" on public.restaurants;
create policy "Admins update restaurant profile" on public.restaurants
  for update to authenticated using (public.is_restaurant_admin(id))
  with check (public.is_restaurant_admin(id));

drop policy if exists "Admins manage categories" on public.menu_categories;
create policy "Admins manage categories" on public.menu_categories
  for all to authenticated using (public.is_restaurant_admin(restaurant_id))
  with check (public.is_restaurant_admin(restaurant_id));
drop policy if exists "Admins manage menu items" on public.menu_items;
create policy "Admins manage menu items" on public.menu_items
  for all to authenticated using (public.is_restaurant_admin(restaurant_id))
  with check (public.is_restaurant_admin(restaurant_id));

-- Public table IDs are not secret; guests need only insert their own request/feedback.
grant select on public.restaurant_tables to anon;
drop policy if exists "Guests read active published table links" on public.restaurant_tables;
create policy "Guests read active published table links" on public.restaurant_tables
  for select to anon, authenticated using (is_active and exists (
    select 1 from public.restaurants r where r.id = restaurant_id and r.is_published
  ));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('restaurant-assets', 'restaurant-assets', true, 5242880,
  array['image/jpeg','image/png','image/webp']::text[])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp']::text[];
drop policy if exists "Public view restaurant assets" on storage.objects;
drop policy if exists "Restaurant admins list own assets" on storage.objects;
create policy "Restaurant admins list own assets" on storage.objects
  for select to authenticated using (
    bucket_id = 'restaurant-assets'
    and (storage.foldername(name))[1] is not null
    and public.is_restaurant_admin(((storage.foldername(name))[1])::uuid)
  );
drop policy if exists "Restaurant admins upload assets" on storage.objects;
create policy "Restaurant admins upload assets" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'restaurant-assets'
    and public.is_restaurant_admin(((storage.foldername(name))[1])::uuid)
  );
drop policy if exists "Restaurant admins update assets" on storage.objects;
create policy "Restaurant admins update assets" on storage.objects
  for update to authenticated using (
    bucket_id = 'restaurant-assets'
    and public.is_restaurant_admin(((storage.foldername(name))[1])::uuid)
  ) with check (
    bucket_id = 'restaurant-assets'
    and public.is_restaurant_admin(((storage.foldername(name))[1])::uuid)
  );
drop policy if exists "Restaurant admins delete assets" on storage.objects;
create policy "Restaurant admins delete assets" on storage.objects
  for delete to authenticated using (
    bucket_id = 'restaurant-assets'
    and public.is_restaurant_admin(((storage.foldername(name))[1])::uuid)
  );

create index if not exists guest_requests_restaurant_created_idx
  on public.guest_requests (restaurant_id, created_at desc);
create index if not exists guest_feedback_restaurant_created_idx
  on public.guest_feedback (restaurant_id, created_at desc);
create index if not exists restaurant_tables_restaurant_number_idx
  on public.restaurant_tables (restaurant_id, table_number);

-- Add initial tables 1–3 for The Cave (safe to run repeatedly).
insert into public.restaurant_tables (restaurant_id, table_number, label)
select r.id, numbers.table_number, 'Table ' || numbers.table_number from public.restaurants r cross join generate_series(1,3) as numbers(table_number)
where r.slug = 'the-cave'
on conflict (restaurant_id, table_number) do nothing;

-- New restaurant records get their first three table links automatically.
create or replace function public.seed_restaurant_tables()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  insert into public.restaurant_tables (restaurant_id, table_number, label)
  select new.id, numbers.table_number, 'Table ' || numbers.table_number from generate_series(1,3) as numbers(table_number)
  on conflict (restaurant_id, table_number) do nothing;
  return new;
end;
$function$;
revoke all on function public.seed_restaurant_tables() from public, anon, authenticated;
drop trigger if exists seed_tables_after_restaurant_insert on public.restaurants;
create trigger seed_tables_after_restaurant_insert
  after insert on public.restaurants
  for each row execute function public.seed_restaurant_tables();

