-- Publishing all existing table rows uses INSERT ... ON CONFLICT. Do not
-- reject that upsert merely because the table already exists.

create or replace function public.enforce_cave_table_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  is_cave boolean;
  other_table_count integer;
  table_already_exists boolean;
begin
  select (r.slug = 'the-cave') into is_cave
  from public.restaurants r
  where r.id = new.restaurant_id;

  if coalesce(is_cave, false) then
    if new.table_number < 1 or new.table_number > 5 then
      raise exception 'The Cave can only use table numbers 1 through 5.';
    end if;

    select exists (
      select 1
      from public.restaurant_tables t
      where t.restaurant_id = new.restaurant_id
        and t.table_number = new.table_number
    ) into table_already_exists;

    if not table_already_exists then
      select count(*) into other_table_count
      from public.restaurant_tables t
      where t.restaurant_id = new.restaurant_id
        and t.id is distinct from new.id;

      if other_table_count >= 5 then
        raise exception 'The Cave is limited to five table tags.';
      end if;
    end if;
  end if;

  return new;
end;
$function$;
