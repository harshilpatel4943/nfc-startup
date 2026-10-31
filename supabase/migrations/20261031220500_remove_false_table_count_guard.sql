-- The Cave's table-number range is the hard safety boundary. The previous
-- count guard rejected valid INSERT ... ON CONFLICT publishes of tables 1-5.

create or replace function public.enforce_cave_table_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  is_cave boolean;
begin
  select (r.slug = 'the-cave') into is_cave
  from public.restaurants r
  where r.id = new.restaurant_id;

  if coalesce(is_cave, false) and (new.table_number < 1 or new.table_number > 5) then
    raise exception 'The Cave can only use table numbers 1 through 5.';
  end if;

  return new;
end;
$function$;
