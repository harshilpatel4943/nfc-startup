alter table public.menu_items
  add column if not exists portion_label text,
  add column if not exists taste_note text;

alter table public.menu_categories
  add column if not exists image_url text;

alter table public.restaurants
  add column if not exists menu_title text,
  add column if not exists menu_subtitle text;

with presentation(name, portion_label, taste_note) as (
  values
    ('SCHEZWAN PANEER TIKKA', 'Approx. 250 g', 'Smoky, tangy, and gently hot.'),
    ('LUCKNOWI SILKEN MALAI PANEER TIKKA', 'Approx. 250 g', 'Creamy, buttery, and delicately spiced.'),
    ('ANDHRA STYLE CHILLI PANEER', 'Approx. 250 g', 'Fiery, garlicky, and bright with curry leaves.'),
    ('SPICY HUMMUS WITH KHAKHRA', 'Approx. 200 g', 'Nutty, smoky, and crisp with a chilli kick.'),
    ('PANEER TIKKA WRAPSTAR', 'Approx. 250 g', 'Smoky paneer meets cool mint and tangy onions.'),
    ('SCHEZWAN MANCHURIAN', 'Approx. 250 g', 'Crisp, savoury, and sweetly spicy.'),
    ('THEPLA NACHO', 'Approx. 200 g', 'Crunchy, cheesy, and herby with a mint finish.'),
    ('AWADHI MALAI CHAAR', 'Approx. 250 g', 'Rich, creamy, and softly aromatic.'),
    ('KEBAB-E-HARA', 'Approx. 200 g', 'Earthy greens with a fresh, tangy finish.'),
    ('JODHPURI MIRCHI WADA', 'Approx. 200 g', 'Crisp outside, warmly spiced, and fiery.'),
    ('THANDAI', 'Approx. 250 ml', 'Creamy, nutty, and fragrant with saffron.'),
    ('PUDINA NIMBOO KI SHIKANJI', 'Approx. 250 ml', 'Bright citrus, cool mint, and a fizzy finish.'),
    ('KHAS KA SHARBAT', 'Approx. 250 ml', 'Sweet, floral, and gently herbal.'),
    ('KOKUM SHARBAT', 'Approx. 250 ml', 'Tart and fruity with a savoury hint.'),
    ('TOMATO BASIL SOUP', 'Approx. 250 ml', 'Rich tomato with a fresh basil finish.'),
    ('MINESTRONE SOUP', 'Approx. 250 ml', 'Hearty, savoury, and full of garden herbs.'),
    ('HOT AND SOUR SOUP', 'Approx. 250 ml', 'Peppery heat balanced by a tangy broth.'),
    ('LEMON CORIANDER SOUP', 'Approx. 250 ml', 'Light, citrusy, and fresh with coriander.'),
    ('LEHSUNI PALAK PANEER', 'Approx. 300 g', 'Creamy spinach with fragrant, toasted garlic.'),
    ('AWADHI SUBZ MILONI', 'Approx. 300 g', 'Mellow vegetables in a velvety, fragrant gravy.'),
    ('CHEESE BALL CURRY', 'Approx. 300 g', 'Rich, buttery, and gently sweet.'),
    ('SOYA CHAAP CURRY', 'Approx. 300 g', 'Smoky chaap in a robust, savoury gravy.'),
    ('CHETTINAD PANEER', 'Approx. 300 g', 'Peppery, aromatic, and warmly spiced.'),
    ('BAINGAN KA BHARTA', 'Approx. 300 g', 'Smoky, rustic, and pleasantly savoury.'),
    ('CHEESE KAJU MUSSALLAM', 'Approx. 300 g', 'Silky, nutty, and rich with saffron.'),
    ('MALAI PYAZ KI SUBZI', 'Approx. 300 g', 'Mildly sweet, creamy, and warmly spiced.'),
    ('DUNGRI BATAKA NU SHAK', 'Approx. 300 g', 'Rustic potatoes with toasted spice and gentle heat.'),
    ('DUM PUKHT SUBZ BIRYANI', 'Approx. 350 g', 'Fragrant, gently spiced, and layered with herbs.'),
    ('JEERA RICE', 'Approx. 250 g', 'Fluffy, buttery rice with toasted cumin.'),
    ('BUTTER NAAN', 'Approx. 120 g', 'Soft, warm, and finished with rich butter.'),
    ('GARLIC NAAN', 'Approx. 130 g', 'Soft and buttery with roasted garlic.'),
    ('MISSI ROTI', 'Approx. 120 g', 'Rustic, savoury, and fragrant with carom.'),
    ('ROOMALI ROTI', 'Approx. 80 g', 'Feather-light, soft, and gently toasted.'),
    ('ROYAL SHAHI TUKDA', 'Approx. 180 g', 'Crisp, syrupy, and rich with saffron cream.'),
    ('GULAB JAMUN WITH ICE CREAM', 'Approx. 180 g', 'Warm, syrupy sweetness with cool vanilla.'),
    ('KESARI PHIRNI', 'Approx. 150 g', 'Chilled, creamy, and fragrant with saffron.')
)
update public.menu_items item
set portion_label = coalesce(item.portion_label, presentation.portion_label),
    taste_note = coalesce(item.taste_note, presentation.taste_note)
from presentation
where upper(item.name) = presentation.name
  and (item.portion_label is null or item.taste_note is null);

update public.restaurants
set menu_title = coalesce(nullif(menu_title, ''), name || ' MENU'),
    menu_subtitle = coalesce(nullif(menu_subtitle, ''), case
      when slug = 'the-cave' then 'Authentic regional flavours crafted in ancient subterranean warmth'
      else coalesce(nullif(descriptor, ''), nullif(tagline, ''), '') end);

drop policy if exists "Signed-in admins upload restaurant assets" on storage.objects;
drop policy if exists "Signed-in admins update restaurant assets" on storage.objects;
drop policy if exists "Signed-in admins delete restaurant assets" on storage.objects;
drop policy if exists "Public view restaurant assets" on storage.objects;
drop policy if exists "Anyone can read active categories for published restaurants" on public.menu_categories;
drop policy if exists "Anyone can read available items for published restaurants" on public.menu_items;
drop policy if exists "Anyone can read published restaurants" on public.restaurants;

drop policy if exists "Admins can read own memberships" on public.restaurant_admins;
create policy "Admins can read own memberships" on public.restaurant_admins
  for select to authenticated using (user_id = (select auth.uid()));

create index if not exists guest_feedback_table_id_idx on public.guest_feedback (table_id);
create index if not exists guest_requests_table_id_idx on public.guest_requests (table_id);
create index if not exists menu_items_category_id_idx on public.menu_items (category_id);
create index if not exists restaurant_admins_user_id_idx on public.restaurant_admins (user_id);

create or replace function public.is_restaurant_admin(target_restaurant uuid)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $function$
  select exists (
    select 1 from public.restaurant_admins a
    where a.restaurant_id = target_restaurant
      and a.user_id = (select auth.uid())
  )
$function$;

revoke all on function public.is_restaurant_admin(uuid) from public, anon, authenticated;
grant execute on function public.is_restaurant_admin(uuid) to authenticated;

create or replace function public.enforce_cave_table_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  is_cave boolean;
  other_table_count integer;
begin
  select (r.slug = 'the-cave') into is_cave
  from public.restaurants r where r.id = new.restaurant_id;
  if coalesce(is_cave, false) then
    if new.table_number < 1 or new.table_number > 5 then
      raise exception 'The Cave can only use table numbers 1 through 5.';
    end if;
    select count(*) into other_table_count
    from public.restaurant_tables t
    where t.restaurant_id = new.restaurant_id and t.id is distinct from new.id;
    if other_table_count >= 5 then
      raise exception 'The Cave is limited to five table tags.';
    end if;
  end if;
  return new;
end;
$function$;

create or replace function public.seed_restaurant_tables()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  insert into public.restaurant_tables (restaurant_id, table_number, label)
  select new.id, numbers.table_number, 'Table ' || numbers.table_number
  from generate_series(1, 3) as numbers(table_number)
  on conflict (restaurant_id, table_number) do nothing;
  return new;
end;
$function$;

revoke all on function public.enforce_cave_table_limit() from public, anon, authenticated;
revoke all on function public.seed_restaurant_tables() from public, anon, authenticated;

create or replace function public.publish_restaurant_setup(p_slug text, p_setup jsonb)
returns timestamptz
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  restaurant_uuid uuid;
  published_time timestamptz := now();
begin
  if (select auth.uid()) is null then
    raise exception 'Sign in is required to publish restaurant changes.' using errcode = '42501';
  end if;
  select r.id into restaurant_uuid from public.restaurants r where r.slug = p_slug;
  if restaurant_uuid is null then
    raise exception 'Restaurant % was not found.', p_slug using errcode = 'P0002';
  end if;
  if not public.is_restaurant_admin(restaurant_uuid) then
    raise exception 'You do not have permission to publish this restaurant.' using errcode = '42501';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(coalesce(p_setup->'menuItems', '[]'::jsonb)) as item(value)
    where not exists (
      select 1 from jsonb_array_elements(coalesce(p_setup->'menuCategories', '[]'::jsonb)) as category(value)
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
         'Table ' || (entry.value->>'number'), coalesce((entry.value->>'isActive')::boolean, true)
  from jsonb_array_elements(coalesce(p_setup->'tables', '[]'::jsonb)) as entry(value)
  on conflict (restaurant_id, table_number) do update
    set label = excluded.label, is_active = excluded.is_active;
  delete from public.restaurant_tables t
  where t.restaurant_id = restaurant_uuid
    and not exists (
      select 1 from jsonb_array_elements(coalesce(p_setup->'tables', '[]'::jsonb)) as entry(value)
      where (entry.value->>'number')::integer = t.table_number
    );

  insert into public.menu_categories (restaurant_id, category_key, name, subtitle, image_url, sort_order, is_active)
  select restaurant_uuid, entry.value->>'id', entry.value->>'name',
         nullif(entry.value->>'subtitle', ''), nullif(entry.value->>'imageUrl', ''),
         (entry.ordinality - 1)::integer, true
  from jsonb_array_elements(coalesce(p_setup->'menuCategories', '[]'::jsonb)) with ordinality as entry(value, ordinality)
  on conflict (restaurant_id, category_key) do update
    set name = excluded.name, subtitle = excluded.subtitle,
        image_url = excluded.image_url, sort_order = excluded.sort_order, is_active = true;

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
  from jsonb_array_elements(coalesce(p_setup->'menuItems', '[]'::jsonb)) with ordinality as item(value, ordinality)
  join public.menu_categories category
    on category.restaurant_id = restaurant_uuid and category.category_key = item.value->>'category'
  on conflict (restaurant_id, source_id) do update set
    category_id = excluded.category_id, name = excluded.name, description = excluded.description,
    price = excluded.price, is_vegetarian = excluded.is_vegetarian,
    is_maharaja_special = excluded.is_maharaja_special, is_todays_special = excluded.is_todays_special,
    is_popular = excluded.is_popular, image_url = excluded.image_url,
    portion_label = excluded.portion_label, taste_note = excluded.taste_note,
    spiciness_level = excluded.spiciness_level, tags = excluded.tags,
    is_available = excluded.is_available, sort_order = excluded.sort_order;

  delete from public.menu_items i
  where i.restaurant_id = restaurant_uuid
    and not exists (
      select 1 from jsonb_array_elements(coalesce(p_setup->'menuItems', '[]'::jsonb)) as item(value)
      where item.value->>'id' = i.source_id
    );
  delete from public.menu_categories c
  where c.restaurant_id = restaurant_uuid
    and not exists (
      select 1 from jsonb_array_elements(coalesce(p_setup->'menuCategories', '[]'::jsonb)) as category(value)
      where category.value->>'id' = c.category_key
    );

  insert into public.restaurant_drafts (restaurant_id, draft, updated_at)
  values (restaurant_uuid, p_setup, published_time)
  on conflict (restaurant_id) do update set draft = excluded.draft, updated_at = excluded.updated_at;
  return published_time;
end;
$function$;

revoke all on function public.publish_restaurant_setup(text, jsonb) from public, anon;
grant execute on function public.publish_restaurant_setup(text, jsonb) to authenticated;

do $publication$
declare table_name text;
begin
  foreach table_name in array array['guest_requests', 'guest_feedback', 'restaurants', 'menu_categories', 'menu_items'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = table_name
    ) then
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    end if;
  end loop;
end;
$publication$;

