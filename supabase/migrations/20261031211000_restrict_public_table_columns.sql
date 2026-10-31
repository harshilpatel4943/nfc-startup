-- Anonymous guests only need table status. Keep bearer tokens available to
-- authenticated restaurant admins, never to the public Data API role.

revoke select on public.restaurant_tables from anon;
grant select (restaurant_id, table_number, is_active) on public.restaurant_tables to anon;
