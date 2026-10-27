-- Avoid PL/pgSQL variable/column ambiguity in the public guest request trigger.
-- The old scope_key variable collided with private.guest_event_rate_limits.scope_key,
-- causing every guest request insert to fail before it reached the inbox.
create or replace function private.enforce_guest_event_limits()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_window_seconds integer;
  v_max_hits integer;
  v_window_number bigint;
  v_scope_key text;
  v_current_hits integer;
begin
  if tg_table_name = 'guest_requests' then
    v_window_seconds := 300;
    v_max_hits := 15;
  else
    v_window_seconds := 3600;
    v_max_hits := 5;
  end if;

  v_window_number := floor(extract(epoch from clock_timestamp()) / v_window_seconds)::bigint;
  v_scope_key := tg_table_name || ':' || new.restaurant_id::text || ':' || coalesce(new.table_number::text, 'unassigned');

  insert into private.guest_event_rate_limits as limits (scope_key, window_number, hit_count)
  values (v_scope_key, v_window_number, 1)
  on conflict (scope_key) do update
    set window_number = excluded.window_number,
        hit_count = case when limits.window_number = excluded.window_number then limits.hit_count + 1 else 1 end
  returning hit_count into v_current_hits;

  if v_current_hits > v_max_hits then
    raise exception 'Guest submission limit reached. Please try again later.' using errcode = 'P0001';
  end if;

  return new;
end;
$function$;
