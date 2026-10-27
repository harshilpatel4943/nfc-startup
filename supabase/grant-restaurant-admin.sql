-- First create/ invite the admin user in Supabase Authentication.
-- Replace the email and restaurant slug below, then run as project owner in SQL Editor.
insert into public.restaurant_admins (restaurant_id, user_id)
select r.id, u.id
from public.restaurants r
join auth.users u on lower(u.email) = lower('owner@example.com')
where r.slug = 'the-cave'
on conflict (restaurant_id, user_id) do nothing;

-- Confirm the assignment:
select r.name as restaurant, r.slug, u.email, a.created_at
from public.restaurant_admins a
join public.restaurants r on r.id = a.restaurant_id
join auth.users u on u.id = a.user_id
where lower(u.email) = lower('owner@example.com');
