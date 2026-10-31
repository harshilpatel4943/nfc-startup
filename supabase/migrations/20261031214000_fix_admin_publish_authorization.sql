-- The publish workflow is a SECURITY DEFINER function. Keep its tenant
-- membership check independent of the caller's table RLS context.

alter function public.is_restaurant_admin(uuid)
  security definer;
