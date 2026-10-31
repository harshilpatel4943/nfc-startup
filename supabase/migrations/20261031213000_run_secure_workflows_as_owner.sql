-- Service requests must validate the private table token without exposing it
-- to anonymous callers. Publishing must also write across the tenant tables
-- after validating the signed-in admin.

alter function public.submit_guest_request(text, integer, text, text)
  security definer;

alter function public.publish_restaurant_setup(text, jsonb)
  security definer;
