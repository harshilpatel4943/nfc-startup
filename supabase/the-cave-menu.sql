-- Trianox / The Cave: schema and menu seed for the current frontend.
-- Safe to rerun: seed rows are upserted using stable source ids and category keys.

create extension if not exists pgcrypto;

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tagline text,
  descriptor text,
  description text,
  phone text,
  whatsapp text,
  address text,
  city text,
  google_review_url text,
  instagram_url text,
  maps_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_key text not null,
  name text not null,
  title_hindi text,
  subtitle text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  unique (restaurant_id, category_key)
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid not null references public.menu_categories(id) on delete cascade,
  source_id text not null,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  is_vegetarian boolean not null default false,
  is_maharaja_special boolean not null default false,
  spiciness_level smallint check (spiciness_level between 1 and 3),
  tags text[] not null default '{}',
  is_available boolean not null default true,
  sort_order integer not null default 0,
  unique (restaurant_id, source_id)
);

alter table public.restaurants add column if not exists tagline text;
alter table public.restaurants add column if not exists descriptor text;
alter table public.restaurants add column if not exists description text;
alter table public.restaurants add column if not exists phone text;
alter table public.restaurants add column if not exists whatsapp text;
alter table public.restaurants add column if not exists address text;
alter table public.restaurants add column if not exists city text;
alter table public.restaurants add column if not exists google_review_url text;
alter table public.restaurants add column if not exists instagram_url text;
alter table public.restaurants add column if not exists maps_url text;
alter table public.restaurants add column if not exists is_published boolean not null default false;
alter table public.menu_categories add column if not exists category_key text;
alter table public.menu_categories add column if not exists title_hindi text;
alter table public.menu_categories add column if not exists subtitle text;
alter table public.menu_categories add column if not exists sort_order integer not null default 0;
alter table public.menu_categories add column if not exists is_active boolean not null default true;
update public.menu_categories set category_key = name where category_key is null;
alter table public.menu_categories alter column category_key set not null;
alter table public.menu_items add column if not exists source_id text;
alter table public.menu_items add column if not exists is_vegetarian boolean not null default false;
alter table public.menu_items add column if not exists is_maharaja_special boolean not null default false;
alter table public.menu_items add column if not exists spiciness_level smallint;
alter table public.menu_items add column if not exists tags text[] not null default '{}';
alter table public.menu_items add column if not exists is_available boolean not null default true;
alter table public.menu_items add column if not exists sort_order integer not null default 0;
update public.menu_items set source_id = 'legacy-' || id::text where source_id is null;
alter table public.menu_items alter column source_id set not null;
create unique index if not exists menu_categories_restaurant_key_uidx
  on public.menu_categories (restaurant_id, category_key);
create unique index if not exists menu_items_restaurant_source_uidx
  on public.menu_items (restaurant_id, source_id);

create index if not exists menu_categories_restaurant_order_idx
  on public.menu_categories (restaurant_id, sort_order);
create index if not exists menu_items_restaurant_category_order_idx
  on public.menu_items (restaurant_id, category_id, sort_order);

alter table public.restaurants enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;

grant select on public.restaurants, public.menu_categories, public.menu_items to anon, authenticated;

drop policy if exists "Public can read published restaurants" on public.restaurants;
create policy "Public can read published restaurants"
  on public.restaurants for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Public can read active categories" on public.menu_categories;
create policy "Public can read active categories"
  on public.menu_categories for select to anon, authenticated
  using (is_active = true and exists (
    select 1 from public.restaurants r
    where r.id = public.menu_categories.restaurant_id and r.is_published = true
  ));

drop policy if exists "Public can read available menu items" on public.menu_items;
create policy "Public can read available menu items"
  on public.menu_items for select to anon, authenticated
  using (is_available = true and exists (
    select 1 from public.restaurants r
    where r.id = public.menu_items.restaurant_id and r.is_published = true
  ) and exists (
    select 1 from public.menu_categories c
    where c.id = public.menu_items.category_id
      and c.restaurant_id = public.menu_items.restaurant_id
      and c.is_active = true
  ));

insert into public.restaurants
  (name, slug, tagline, descriptor, description, phone, whatsapp, address, city,
   google_review_url, instagram_url, maps_url, is_published)
values
  ('THE CAVE', 'the-cave', 'REGIONAL INDIAN CUISINE',
   'A journey through India''s regional flavours',
   'An immersive dining sanctuary where prehistoric art, cave architecture, organic firelight, and rich regional Indian cuisine converge.',
   '+91 98765 43210', '+91 98765 43210',
   'Plot No. 42, Cave Temple Avenue, Regional Cultural District', 'Ahmedabad, Gujarat',
   '[CLIENT GOOGLE REVIEW URL]', '[CLIENT INSTAGRAM URL]',
   'https://maps.google.com/?q=The+Cave+Regional+Indian+Cuisine', true)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  descriptor = excluded.descriptor,
  description = excluded.description,
  phone = excluded.phone,
  whatsapp = excluded.whatsapp,
  address = excluded.address,
  city = excluded.city,
  google_review_url = excluded.google_review_url,
  instagram_url = excluded.instagram_url,
  maps_url = excluded.maps_url,
  is_published = excluded.is_published;

insert into public.menu_categories
  (restaurant_id, category_key, name, title_hindi, subtitle, sort_order)
select r.id, v.category_key, v.name, v.title_hindi, v.subtitle, v.sort_order
from public.restaurants r
cross join (values
  ('STARTER', 'STARTER', 'शुरुआत', 'Handcrafted appetizers & tandoori delights', 0),
  ('THANDA KA MOUJ', 'THANDA KA MOUJ', 'ठंडा का मौज', 'Traditional cold elixirs & refreshing sharbats', 1),
  ('SOUP', 'SOUP', 'शूर्बा', 'Aromatic broths & warm herbal extracts', 2),
  ('MAIN COURSE', 'MAIN COURSE', 'मुख्य भोजन', 'Rich regional curries & slow-cooked gravies', 3),
  ('RICE & BREADS', 'RICE & BREADS', 'चावल एवं रोटी', 'Dum biryanis & clay-oven baked artisanal breads', 4),
  ('DESSERTS', 'DESSERTS', 'मीठा', 'Traditional Indian sweets & royal desserts', 5)
) as v(category_key, name, title_hindi, subtitle, sort_order)
where r.slug = 'the-cave'
on conflict (restaurant_id, category_key) do update set
  name = excluded.name,
  title_hindi = excluded.title_hindi,
  subtitle = excluded.subtitle,
  sort_order = excluded.sort_order,
  is_active = true;

insert into public.menu_items
  (restaurant_id, category_id, source_id, name, description, price,
   is_vegetarian, is_maharaja_special, spiciness_level, tags, sort_order)
select r.id, c.id, v.source_id, v.name, v.description, v.price,
       v.is_vegetarian, v.is_maharaja_special, v.spiciness_level, v.tags, v.sort_order
from public.restaurants r
join (values
  ('st-1', 'STARTER', 'SCHEZWAN PANEER TIKKA', 'House-made Schezwan sauce • Hung curd • Indian spices • Cottage cheese cooked in clay tandoor', 399, true, false, 2, array['Tandoor', 'Popular']::text[], 0),
  ('st-2', 'STARTER', 'LUCKNOWI SILKEN MALAI PANEER TIKKA', 'Hung curd • Cottage cheese • Awadhi aromatic spices • Country butter finish', 419, true, true, 1, array['Chef Special', 'Mild']::text[], 1),
  ('st-3', 'STARTER', 'ANDHRA STYLE CHILLI PANEER', 'Fiery Guntur chillies • Fresh curry leaves • Crushed garlic • Tossed cottage cheese', 389, true, false, 3, array['Spicy', 'South Regional']::text[], 2),
  ('st-4', 'STARTER', 'SPICY HUMMUS WITH KHAKHRA', 'Roasted chickpea & Kashmiri red pepper dip • Served with crisp house artisanal thali khakhra', 349, true, false, 1, array['Fusion', 'Crispy']::text[], 3),
  ('st-5', 'STARTER', 'PANEER TIKKA WRAPSTAR', 'Tandoori marinated paneer strips • Mint chutney • Pickled onions in paper-thin roomali bread', 379, true, false, 2, array[]::text[], 4),
  ('st-6', 'STARTER', 'SCHEZWAN MANCHURIAN', 'Crispy seasonal vegetable dumplings tossed in spicy Indo-Chinese Schezwan glaze & spring greens', 359, true, false, 2, array[]::text[], 5),
  ('st-7', 'STARTER', 'THEPLA NACHO', 'Crispy spiced Gujarati fenugreek wheat chips • Topped with melted cheese, tomato salsa & mint drizzle', 329, true, false, 1, array['Gujarati Regional']::text[], 6),
  ('st-8', 'STARTER', 'AWADHI MALAI CHAAR', 'Tender soya chaap marinated in rich cashew malai cream, green cardamom & royal saffron', 399, true, true, 1, array['Royal Awadhi']::text[], 7),
  ('st-9', 'STARTER', 'KEBAB-E-HARA', 'Pan-seared spinach, green pea & roasted cumin patties infused with raw mango powder', 369, true, false, 1, array[]::text[], 8),
  ('st-10', 'STARTER', 'JODHPURI MIRCHI WADA', 'Traditional Marwari large fiery chillies stuffed with spiced potato mash & fried in gram flour', 319, true, false, 3, array['Rajasthani Regional']::text[], 9),
  ('th-1', 'THANDA KA MOUJ', 'THANDAI', 'Traditional chilled milk infused with ground almonds, melon seeds, royal saffron & dried rose petals', 229, true, true, null, array['Royal Beverage']::text[], 0),
  ('th-2', 'THANDA KA MOUJ', 'PUDINA NIMBOO KI SHIKANJI', 'Cooling fresh mint crushed with key lime, rock salt, roasted cumin & chilled soda', 189, true, false, null, array['Refreshing']::text[], 1),
  ('th-3', 'THANDA KA MOUJ', 'KHAS KA SHARBAT', 'Cool vetiver grass extract elixir sweetened with organic sugar & soaked basil seeds', 199, true, false, null, array[]::text[], 2),
  ('th-4', 'THANDA KA MOUJ', 'KOKUM SHARBAT', 'Tangy wild mangosteen extract spiced with crushed pink salt & roasted cumin powder', 199, true, false, null, array['Konkan Regional']::text[], 3),
  ('sp-1', 'SOUP', 'TOMATO BASIL SOUP', 'Rich vine-ripened tomato extract finished with fresh basil leaves & garlic croutons', 249, true, false, null, array[]::text[], 0),
  ('sp-2', 'SOUP', 'MINESTRONE SOUP', 'Hearty Indian vegetable broth with diced roots, macaroni pasta & garden herbs', 269, true, false, null, array[]::text[], 1),
  ('sp-3', 'SOUP', 'HOT AND SOUR SOUP', 'Spicy & sour dark mushroom broth with shredded bamboo shoots, cabbage & green chillies', 259, true, false, 2, array[]::text[], 2),
  ('sp-4', 'SOUP', 'LEMON CORIANDER SOUP', 'Clear citrus broth simmered with fresh coriander stems, mushrooms & diced vegetables', 249, true, false, 1, array[]::text[], 3),
  ('mc-1', 'MAIN COURSE', 'LEHSUNI PALAK PANEER', 'Fresh farm spinach purée tempered with burnt garlic, pure desi ghee & cottage cheese cubes', 449, true, false, 1, array['Signature']::text[], 0),
  ('mc-2', 'MAIN COURSE', 'AWADHI SUBZ MILONI', 'Seasonal garden vegetables simmered in a velvet cashew & onion gravy infused with green cardamom', 429, true, true, 1, array['Royal Gravy']::text[], 1),
  ('mc-3', 'MAIN COURSE', 'CHEESE BALL CURRY', 'Golden cottage cheese dumplings cooked in a rich, buttery tomato makhani gravy', 469, true, false, null, array['Rich & Creamy']::text[], 2),
  ('mc-4', 'MAIN COURSE', 'SOYA CHAAP CURRY', 'Tandoor-roasted soya chaap simmered in a robust North Indian onion-tomato gravy', 439, true, false, 2, array[]::text[], 3),
  ('mc-5', 'MAIN COURSE', 'CHETTINAD PANEER', 'Fiery South Indian coconut, star anise & freshly ground black pepper curry with paneer', 459, true, false, 3, array['Tamil Regional']::text[], 4),
  ('mc-6', 'MAIN COURSE', 'BAINGAN KA BHARTA', 'Smoky clay-oven roasted eggplant mash tempered with raw onions, garlic, green chillies & mustard oil', 389, true, false, 2, array['Rustic Classic']::text[], 5),
  ('mc-7', 'MAIN COURSE', 'CHEESE KAJU MUSSALLAM', 'Royal Mughlai roasted cashews and paneer cooked in a saffron-infused nut gravy', 499, true, true, null, array['Maharaja Special', 'Chef Choice']::text[], 6),
  ('mc-8', 'MAIN COURSE', 'MALAI PYAZ KI SUBZI', 'Sweet baby spring onions stewed in a rich cream gravy scented with nutmeg & mace', 419, true, false, null, array[]::text[], 7),
  ('mc-9', 'MAIN COURSE', 'DUNGRI BATAKA NU SHAK', 'Traditional Kathiyawadi baby potato & red onion curry prepared with roasted sesame & red chilli oil', 379, true, false, 2, array['Kathiyawadi Regional']::text[], 8),
  ('rb-1', 'RICE & BREADS', 'DUM PUKHT SUBZ BIRYANI', 'Long-grain basmati rice layered with spiced vegetables, mint, saffron & steam-cooked under clay dough seal', 449, true, true, null, array['Biryani', 'Maharaja Special']::text[], 0),
  ('rb-2', 'RICE & BREADS', 'JEERA RICE', 'Aromatic basmati rice tempered with roasted cumin seeds and fresh desi ghee', 269, true, false, null, array[]::text[], 1),
  ('rb-3', 'RICE & BREADS', 'BUTTER NAAN', 'Clay tandoor baked leavened flatbread brushed with country butter', 99, true, false, null, array[]::text[], 2),
  ('rb-4', 'RICE & BREADS', 'GARLIC NAAN', 'Tandoori naan stuffed and topped with finely crushed roasted garlic & cilantro', 119, true, false, null, array[]::text[], 3),
  ('rb-5', 'RICE & BREADS', 'MISSI ROTI', 'Rustic gram flour & wheat flatbread seasoned with carom seeds & chopped onion baked in tandoor', 89, true, false, null, array[]::text[], 4),
  ('rb-6', 'RICE & BREADS', 'ROOMALI ROTI', 'Ultra-thin hand-spun soft flatbread folded like a handkerchief', 79, true, false, null, array[]::text[], 5),
  ('ds-1', 'DESSERTS', 'ROYAL SHAHI TUKDA', 'Ghee-fried brioche soaked in saffron cardamom rabri, garnished with pistachios & edible silver leaf', 289, true, true, null, array['Royal Dessert']::text[], 0),
  ('ds-2', 'DESSERTS', 'GULAB JAMUN WITH ICE CREAM', 'Warm khoya dumplings soaked in rose syrup served alongside artisanal vanilla bean ice cream', 249, true, false, null, array[]::text[], 1),
  ('ds-3', 'DESSERTS', 'KESARI PHIRNI', 'Chilled ground basmati rice pudding slow-cooked with milk, saffron & almonds served in earthenware matka', 229, true, false, null, array[]::text[], 2)) as v(source_id, category_key, name, description, price, is_vegetarian,
       is_maharaja_special, spiciness_level, tags, sort_order) on true
join public.menu_categories c
  on c.restaurant_id = r.id and c.category_key = v.category_key
where r.slug = 'the-cave'
on conflict (restaurant_id, source_id) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  is_vegetarian = excluded.is_vegetarian,
  is_maharaja_special = excluded.is_maharaja_special,
  spiciness_level = excluded.spiciness_level,
  tags = excluded.tags,
  is_available = true;
