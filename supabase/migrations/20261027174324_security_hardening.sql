-- Tighten tenant writes, validate public submissions at the database boundary,
-- and limit repeated guest events per physical table.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.guest_event_rate_limits (
  scope_key text primary key,
  window_number bigint not null,
  hit_count integer not null check (hit_count > 0)
);
alter table private.guest_event_rate_limits enable row level security;
revoke all on private.guest_event_rate_limits from public, anon, authenticated;

create or replace function private.enforce_guest_event_limits()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  window_seconds integer;
  max_hits integer;
  window_number bigint;
  scope_key text;
  current_hits integer;
begin
  if tg_table_name = 'guest_requests' then
    window_seconds := 300;
    max_hits := 15;
  else
    window_seconds := 3600;
    max_hits := 5;
  end if;

  window_number := floor(extract(epoch from clock_timestamp()) / window_seconds)::bigint;
  scope_key := tg_table_name || ':' || new.restaurant_id::text || ':' || coalesce(new.table_number::text, 'unassigned');

  insert into private.guest_event_rate_limits as limits (scope_key, window_number, hit_count)
  values (scope_key, window_number, 1)
  on conflict (scope_key) do update
    set window_number = excluded.window_number,
        hit_count = case when limits.window_number = excluded.window_number then limits.hit_count + 1 else 1 end
  returning hit_count into current_hits;

  if current_hits > max_hits then
    raise exception 'Guest submission limit reached. Please try again later.' using errcode = 'P0001';
  end if;

  return new;
end;
$function$;
revoke all on function private.enforce_guest_event_limits() from public, anon, authenticated;

drop trigger if exists guest_requests_rate_limit on public.guest_requests;
create trigger guest_requests_rate_limit
before insert on public.guest_requests
for each row execute function private.enforce_guest_event_limits();

drop trigger if exists guest_feedback_rate_limit on public.guest_feedback;
create trigger guest_feedback_rate_limit
before insert on public.guest_feedback
for each row execute function private.enforce_guest_event_limits();

-- Bound user-controlled fields even when callers bypass the React forms.
do $constraints$
begin
  if not exists (select 1 from pg_constraint where conname = 'guest_requests_type_length_check') then
    alter table public.guest_requests add constraint guest_requests_type_length_check
      check (char_length(btrim(request_type)) between 1 and 64) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'guest_feedback_message_length_check') then
    alter table public.guest_feedback add constraint guest_feedback_message_length_check
      check (message is null or char_length(message) <= 1000) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'guest_feedback_overall_check') then
    alter table public.guest_feedback add constraint guest_feedback_overall_check
      check (overall is null or overall in ('🤩', '😊', '😐', '🙁')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'guest_feedback_visit_again_check') then
    alter table public.guest_feedback add constraint guest_feedback_visit_again_check
      check (visit_again is null or visit_again in ('YES', 'NO', 'MAYBE')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'restaurants_name_length_check') then
    alter table public.restaurants add constraint restaurants_name_length_check
      check (char_length(btrim(name)) between 1 and 120) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'menu_categories_name_length_check') then
    alter table public.menu_categories add constraint menu_categories_name_length_check
      check (char_length(btrim(name)) between 1 and 80) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'menu_items_name_length_check') then
    alter table public.menu_items add constraint menu_items_name_length_check
      check (char_length(btrim(name)) between 1 and 120) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'menu_items_description_length_check') then
    alter table public.menu_items add constraint menu_items_description_length_check
      check (description is null or char_length(description) <= 1000) not valid;
  end if;
end;
$constraints$;

alter table public.guest_requests validate constraint guest_requests_type_length_check;
alter table public.guest_feedback validate constraint guest_feedback_message_length_check;
alter table public.guest_feedback validate constraint guest_feedback_overall_check;
alter table public.guest_feedback validate constraint guest_feedback_visit_again_check;
alter table public.restaurants validate constraint restaurants_name_length_check;
alter table public.menu_categories validate constraint menu_categories_name_length_check;
alter table public.menu_items validate constraint menu_items_name_length_check;
alter table public.menu_items validate constraint menu_items_description_length_check;

-- Keep the Data API usable only for the columns the app actually writes.
revoke update on public.restaurants from authenticated;
grant update (
  name, tagline, descriptor, menu_title, menu_subtitle, menu_footer_note, description,
  phone, whatsapp, address, city, google_review_url, instagram_url, instagram_profile_url,
  maps_url, logo_url, cover_image_url, wifi_network, wifi_password, opening_hours,
  services, is_published
) on public.restaurants to authenticated;

revoke insert, update, delete on public.menu_categories from authenticated;
grant insert, delete on public.menu_categories to authenticated;
grant update (name, subtitle, image_url, sort_order, is_active) on public.menu_categories to authenticated;

revoke insert, update, delete on public.menu_items from authenticated;
grant insert, delete on public.menu_items to authenticated;
grant update (
  category_id, name, description, price, is_vegetarian, is_maharaja_special,
  is_todays_special, is_popular, image_url, portion_label, taste_note,
  spiciness_level, tags, is_available, sort_order
) on public.menu_items to authenticated;

revoke update on public.restaurant_tables from authenticated;
grant update (label, is_active) on public.restaurant_tables to authenticated;

revoke insert, update on public.guest_requests from anon, authenticated;
grant insert (restaurant_id, table_number, request_type) on public.guest_requests to anon, authenticated;
grant delete on public.guest_requests to authenticated;
revoke update on public.guest_feedback from authenticated;
revoke insert on public.guest_feedback from anon, authenticated;
grant insert (restaurant_id, table_number, overall, food_rating, ambience_rating, service_rating, visit_again, message)
  on public.guest_feedback to anon, authenticated;
grant update (status) on public.guest_feedback to authenticated;

-- Remove legacy bucket-wide write policies if an older setup script created them.
drop policy if exists "Signed-in admins upload restaurant assets" on storage.objects;
drop policy if exists "Signed-in admins update restaurant assets" on storage.objects;
drop policy if exists "Signed-in admins delete restaurant assets" on storage.objects;
drop policy if exists "Public can view restaurant assets" on storage.objects;
drop policy if exists "Public view restaurant assets" on storage.objects;
