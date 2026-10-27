-- Start from no Data API privileges, then grant only operations used by the app.
revoke all privileges on public.restaurants, public.menu_categories, public.menu_items,
  public.restaurant_tables, public.guest_requests, public.guest_feedback, public.restaurant_drafts
  from anon, authenticated;

grant select on public.restaurants, public.menu_categories, public.menu_items, public.restaurant_tables
  to anon, authenticated;

grant update (
  name, tagline, descriptor, menu_title, menu_subtitle, menu_footer_note, description,
  phone, whatsapp, address, city, google_review_url, instagram_url, instagram_profile_url,
  maps_url, logo_url, cover_image_url, wifi_network, wifi_password, opening_hours,
  services, is_published
) on public.restaurants to authenticated;
grant insert, delete on public.menu_categories to authenticated;
grant update (name, subtitle, image_url, sort_order, is_active) on public.menu_categories to authenticated;
grant insert, delete on public.menu_items to authenticated;
grant update (
  category_id, name, description, price, is_vegetarian, is_maharaja_special,
  is_todays_special, is_popular, image_url, portion_label, taste_note,
  spiciness_level, tags, is_available, sort_order
) on public.menu_items to authenticated;
grant update (label, is_active) on public.restaurant_tables to authenticated;

grant insert (restaurant_id, table_number, request_type) on public.guest_requests to anon, authenticated;
grant select, delete on public.guest_requests to authenticated;
grant insert (restaurant_id, table_number, overall, food_rating, ambience_rating, service_rating, visit_again, message)
  on public.guest_feedback to anon, authenticated;
grant select on public.guest_feedback to authenticated;
grant update (status) on public.guest_feedback to authenticated;

grant select, insert, update on public.restaurant_drafts to authenticated;