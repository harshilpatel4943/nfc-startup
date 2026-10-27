-- Expire service requests after five minutes; feedback is retained.
create extension if not exists pg_cron with schema pg_catalog;

drop policy if exists "Admins delete own restaurant requests" on public.guest_requests;
create policy "Admins delete own restaurant requests"
  on public.guest_requests for delete to authenticated
  using (public.is_restaurant_admin(restaurant_id));

create index if not exists guest_requests_created_at_idx
  on public.guest_requests (created_at);

select cron.unschedule(jobid)
from cron.job
where jobname = 'expire-guest-requests-after-five-minutes';

select cron.schedule(
  'expire-guest-requests-after-five-minutes',
  '* * * * *',
  $job$delete from public.guest_requests where created_at <= now() - interval '5 minutes';$job$
);