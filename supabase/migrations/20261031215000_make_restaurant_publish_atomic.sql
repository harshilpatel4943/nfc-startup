-- Keep publishing independent from caller RLS policies. The function still
-- authenticates the caller and checks restaurant membership before changing
-- any content.

create or replace function public.publish_restaurant_setup(p_slug text, p_setup jsonb)
returns timestamptz
language plpgsql
security definer
set search_path = ''
set row_security = off
as $function$
declare
  restaurant_uuid uuid;
  published_time timestamptz := now();
begin
  if (select auth.uid()) is null then
    raise exception 'Sign in is required to publish restaurant changes.' using errcode = '42501';
  end if;

  select r.id into restaurant_uuid
  from public.restaurants r
  where r.slug = btrim(p_slug);

  if restaurant_uuid is null then
    raise exception 'Restaurant % was not found.', p_slug using errcode = 'P0002';
  end if;

  if not exists (
    select 1
    from public.restaurant_admins a
    where a.restaurant_id = restaurant_uuid
      and a.user_id = (select auth.uid())
  ) then
    raise exception 'You do not have permission to publish this restaurant.' using errcode = '42501';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(coalesce(p_setup->'menuItems', '[]'::jsonb)) as item(value)
    where not exists (
      select 1
      from jsonb_array_elements(coalesce(p_setup->'menuCategories', '[]'::jsonb)) as category(value)
      where category.value->>'id' = item.value->>'category'
    )
  ) then
    raise exception 'Every dish must belong to a saved menu category.';
  end if;

  update public.restaurants set
    name = p_setup#>>'{restaurant,name}',
    tagline = p_setup#>>'{restaurant,tagline}',
    descriptor = p_setup#>>'{restaurant,descriptor}',
    menu_title = p_setup#>>'{restaurant,menuTitle}',
    menu_subtitle = p_setup#>>'{restaurant,menuSubtitle}',
    menu_footer_note = p_setup#>>'{restaurant,menuFooterNote}',
    description = p_setup#>>'{restaurant,heroDescription}',
    phone = p_setup#>>'{restaurant,phone}',
    whatsapp = p_setup#>>'{restaurant,whatsapp}',
    address = p_setup#>>'{restaurant,address}',
    city = p_setup#>>'{restaurant,city}',
    google_review_url = p_setup#>>'{restaurant,googleReviewUrl}',
    instagram_url = p_setup#>>'{restaurant,instagramUrl}',
    instagram_profile_url = p_setup#>>'{restaurant,instagramProfileUrl}',
    maps_url = p_setup#>>'{restaurant,mapsUrl}',
    logo_url = p_setup#>>'{restaurant,logoUrl}',
    cover_image_url = p_setup#>>'{restaurant,coverImageUrl}',
    wifi_network = p_setup#>>'{restaurant,wifiNetwork}',
    wifi_password = p_setup#>>'{restaurant,wifiPassword}',
    opening_hours = coalesce(p_setup#>'{restaurant,openingHours}', '{}'::jsonb),
    services = coalesce(p_setup->'services', '[]'::jsonb),
    is_published = true
  where id = restaurant_uuid;

  insert into public.restaurant_tables (restaurant_id, table_number, label, is_active)
  select restaurant_uuid, (entry.value->>'number')::integer,
    'Table ' || (entry.value->>'number'),
    coalesce((entry.value->>'isActive')::boolean, true)
  from jsonb_array_elements(coalesce(p_setup->'tables', '[]'::jsonb)) as entry(value)
  on conflict (restaurant_id, table_number) do update
    set label = excluded.label, is_active = excluded.is_active;

  delete from public.restaurant_tables t
  where t.restaurant_id = restaurant_uuid
    and not exists (
      select 1
      from jsonb_array_elements(coalesce(p_setup->'tables', '[]'::jsonb)) as entry(value)
      where (entry.value->>'number')::integer = t.table_number
    );

  insert into public.menu_categories (restaurant_id, category_key, name, subtitle, image_url, sort_order, is_active)
  select restaurant_uuid, entry.value->>'id', entry.value->>'name',
    nullif(entry.value->>'subtitle', ''), nullif(entry.value->>'imageUrl', ''),
    (entry.ordinality - 1)::integer, true
  from jsonb_array_elements(coalesce(p_setup->'menuCategories', '[]'::jsonb))
    with ordinality as entry(value, ordinality)
  on conflict (restaurant_id, category_key) do update set
    name = excluded.name, subtitle = excluded.subtitle, image_url = excluded.image_url,
    sort_order = excluded.sort_order, is_active = true;

  insert into public.menu_items (
    restaurant_id, category_id, source_id, name, description, price, is_vegetarian,
    is_maharaja_special, is_todays_special, is_popular, image_url, portion_label,
    taste_note, spiciness_level, tags, is_available, sort_order
  )
  select restaurant_uuid, category.id, item.value->>'id', item.value->>'name',
    nullif(item.value->>'description', ''), (item.value->>'price')::numeric,
    coalesce((item.value->>'isVegetarian')::boolean, false),
    coalesce((item.value->>'isMaharajaSpecial')::boolean, false),
    coalesce((item.value->>'isTodaysSpecial')::boolean, false),
    coalesce((item.value->>'isPopular')::boolean, false),
    nullif(item.value->>'imageUrl', ''), nullif(item.value->>'portionLabel', ''),
    nullif(item.value->>'tasteNote', ''), nullif(item.value->>'spicinessLevel', '')::smallint,
    array(select jsonb_array_elements_text(coalesce(item.value->'tags', '[]'::jsonb))),
    coalesce((item.value->>'isAvailable')::boolean, true), (item.ordinality - 1)::integer
  from jsonb_array_elements(coalesce(p_setup->'menuItems', '[]'::jsonb))
    with ordinality as item(value, ordinality)
  join public.menu_categories category
    on category.restaurant_id = restaurant_uuid
    and category.category_key = item.value->>'category'
  on conflict (restaurant_id, source_id) do update set
    category_id = excluded.category_id, name = excluded.name, description = excluded.description,
    price = excluded.price, is_vegetarian = excluded.is_vegetarian,
    is_maharaja_special = excluded.is_maharaja_special,
    is_todays_special = excluded.is_todays_special, is_popular = excluded.is_popular,
    image_url = excluded.image_url, portion_label = excluded.portion_label,
    taste_note = excluded.taste_note, spiciness_level = excluded.spiciness_level,
    tags = excluded.tags, is_available = excluded.is_available, sort_order = excluded.sort_order;

  delete from public.menu_items i
  where i.restaurant_id = restaurant_uuid
    and not exists (
      select 1
      from jsonb_array_elements(coalesce(p_setup->'menuItems', '[]'::jsonb)) as item(value)
      where item.value->>'id' = i.source_id
    );

  delete from public.menu_categories c
  where c.restaurant_id = restaurant_uuid
    and not exists (
      select 1
      from jsonb_array_elements(coalesce(p_setup->'menuCategories', '[]'::jsonb)) as category(value)
      where category.value->>'id' = c.category_key
    );

  insert into public.restaurant_drafts (restaurant_id, draft, updated_at)
  values (restaurant_uuid, p_setup, published_time)
  on conflict (restaurant_id) do update
    set draft = excluded.draft, updated_at = excluded.updated_at;

  return published_time;
end;
$function$;
