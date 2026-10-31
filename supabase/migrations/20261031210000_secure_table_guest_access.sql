-- Require possession of a table-specific bearer token for guest service requests.
-- Existing menu links remain readable, but service requests require regenerated links.

alter table public.restaurant_tables
  add column if not exists access_token text;

update public.restaurant_tables
set access_token = encode(gen_random_bytes(18), 'hex')
where access_token is null or char_length(access_token) < 32;

alter table public.restaurant_tables
  alter column access_token set not null;

create unique index if not exists restaurant_tables_access_token_uidx
  on public.restaurant_tables (access_token);

revoke select (access_token) on public.restaurant_tables from anon;

create or replace function public.submit_guest_request(
  p_slug text,
  p_table_number integer,
  p_access_token text,
  p_request_type text
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  v_restaurant_id uuid;
  v_table_id uuid;
  v_request_id uuid;
begin
  if p_slug is null or char_length(btrim(p_slug)) not between 1 and 80
    or p_table_number is null or p_table_number < 1
    or p_access_token is null or char_length(btrim(p_access_token)) < 32
    or p_request_type is null or char_length(btrim(p_request_type)) not between 1 and 64 then
    raise exception 'This table link is invalid. Scan the current QR code and try again.'
      using errcode = '22023';
  end if;

  select r.id into v_restaurant_id
  from public.restaurants r
  where r.slug = btrim(p_slug) and r.is_published;

  if v_restaurant_id is null then
    raise exception 'This restaurant link is unavailable.' using errcode = 'P0002';
  end if;

  select t.id into v_table_id
  from public.restaurant_tables t
  where t.restaurant_id = v_restaurant_id
    and t.table_number = p_table_number
    and t.is_active
    and t.access_token = btrim(p_access_token);

  if v_table_id is null then
    raise exception 'This table link is invalid or offline.' using errcode = '42501';
  end if;

  insert into public.guest_requests (restaurant_id, table_id, table_number, request_type)
  values (v_restaurant_id, v_table_id, p_table_number, btrim(p_request_type))
  returning id into v_request_id;

  return v_request_id;
end;
$function$;

revoke all on function public.submit_guest_request(text, integer, text, text)
  from public, anon, authenticated;
grant execute on function public.submit_guest_request(text, integer, text, text)
  to anon, authenticated;

revoke insert on public.guest_requests from anon, authenticated;
