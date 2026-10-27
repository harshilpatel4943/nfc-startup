-- Keep existing direct Data API privileges limited and allow scoped admin asset listing.
revoke insert, update, delete on public.restaurants from authenticated;
grant update (
  name, tagline, descriptor, menu_title, menu_subtitle, menu_footer_note, description,
  phone, whatsapp, address, city, google_review_url, instagram_url, instagram_profile_url,
  maps_url, logo_url, cover_image_url, wifi_network, wifi_password, opening_hours,
  services, is_published
) on public.restaurants to authenticated;

revoke insert, update, delete on public.restaurant_tables from authenticated;
grant update (label, is_active) on public.restaurant_tables to authenticated;

drop policy if exists "Restaurant admins list own assets" on storage.objects;
create policy "Restaurant admins list own assets" on storage.objects
  for select to authenticated using (
    bucket_id = 'restaurant-assets'
    and (storage.foldername(name))[1] is not null
    and public.is_restaurant_admin(((storage.foldername(name))[1])::uuid)
  );