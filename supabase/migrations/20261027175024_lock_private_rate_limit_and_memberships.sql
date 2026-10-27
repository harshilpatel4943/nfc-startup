revoke all privileges on public.restaurant_admins from anon, authenticated;
grant select on public.restaurant_admins to authenticated;

drop policy if exists "Deny client access to guest event limits" on private.guest_event_rate_limits;
create policy "Deny client access to guest event limits" on private.guest_event_rate_limits
  for all to anon, authenticated using (false) with check (false);