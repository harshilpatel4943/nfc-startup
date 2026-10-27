-- Use one SELECT policy per role while preserving restaurant-scoped admin access.
drop policy if exists "Admins manage categories" on public.menu_categories;
drop policy if exists "Public can read active categories" on public.menu_categories;
create policy "Admins and guests read categories" on public.menu_categories
  for select to authenticated using (
    public.is_restaurant_admin(restaurant_id)
    or (is_active and exists (select 1 from public.restaurants r where r.id = menu_categories.restaurant_id and r.is_published))
  );
create policy "Public read active categories" on public.menu_categories
  for select to anon using (
    is_active and exists (select 1 from public.restaurants r where r.id = menu_categories.restaurant_id and r.is_published)
  );
create policy "Admins insert categories" on public.menu_categories
  for insert to authenticated with check (public.is_restaurant_admin(restaurant_id));
create policy "Admins update categories" on public.menu_categories
  for update to authenticated using (public.is_restaurant_admin(restaurant_id))
  with check (public.is_restaurant_admin(restaurant_id));
create policy "Admins delete categories" on public.menu_categories
  for delete to authenticated using (public.is_restaurant_admin(restaurant_id));

drop policy if exists "Admins manage menu items" on public.menu_items;
drop policy if exists "Public can read available menu items" on public.menu_items;
create policy "Admins and guests read menu items" on public.menu_items
  for select to authenticated using (
    public.is_restaurant_admin(restaurant_id)
    or (is_available and exists (
      select 1 from public.restaurants r where r.id = menu_items.restaurant_id and r.is_published
    ) and exists (
      select 1 from public.menu_categories c where c.id = menu_items.category_id
        and c.restaurant_id = menu_items.restaurant_id and c.is_active
    ))
  );
create policy "Public read available menu items" on public.menu_items
  for select to anon using (
    is_available and exists (
      select 1 from public.restaurants r where r.id = menu_items.restaurant_id and r.is_published
    ) and exists (
      select 1 from public.menu_categories c where c.id = menu_items.category_id
        and c.restaurant_id = menu_items.restaurant_id and c.is_active
    )
  );
create policy "Admins insert menu items" on public.menu_items
  for insert to authenticated with check (public.is_restaurant_admin(restaurant_id));
create policy "Admins update menu items" on public.menu_items
  for update to authenticated using (public.is_restaurant_admin(restaurant_id))
  with check (public.is_restaurant_admin(restaurant_id));
create policy "Admins delete menu items" on public.menu_items
  for delete to authenticated using (public.is_restaurant_admin(restaurant_id));

drop policy if exists "Admins manage restaurant tables" on public.restaurant_tables;
drop policy if exists "Guests read published table link status" on public.restaurant_tables;
create policy "Admins and guests read table link status" on public.restaurant_tables
  for select to authenticated using (
    public.is_restaurant_admin(restaurant_id)
    or exists (select 1 from public.restaurants r where r.id = restaurant_tables.restaurant_id and r.is_published)
  );
create policy "Public read table link status" on public.restaurant_tables
  for select to anon using (
    exists (select 1 from public.restaurants r where r.id = restaurant_tables.restaurant_id and r.is_published)
  );
create policy "Admins insert restaurant tables" on public.restaurant_tables
  for insert to authenticated with check (public.is_restaurant_admin(restaurant_id));
create policy "Admins update restaurant tables" on public.restaurant_tables
  for update to authenticated using (public.is_restaurant_admin(restaurant_id))
  with check (public.is_restaurant_admin(restaurant_id));
create policy "Admins delete restaurant tables" on public.restaurant_tables
  for delete to authenticated using (public.is_restaurant_admin(restaurant_id));

drop policy if exists "Admins read restaurant profile" on public.restaurants;
drop policy if exists "Public can read published restaurants" on public.restaurants;
create policy "Admins and guests read restaurant profile" on public.restaurants
  for select to authenticated using (public.is_restaurant_admin(id) or is_published);
create policy "Public read published restaurants" on public.restaurants
  for select to anon using (is_published);
