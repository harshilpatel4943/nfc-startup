drop policy if exists "Guests read active published table links" on public.restaurant_tables;
create policy "Guests read published table link status" on public.restaurant_tables
  for select to anon, authenticated
  using (exists (
    select 1 from public.restaurants r
    where r.id = restaurant_tables.restaurant_id and r.is_published
  ));
