alter table public.restaurants add constraint restaurants_content_lengths_check check (
  (tagline is null or char_length(tagline) <= 160)
  and (descriptor is null or char_length(descriptor) <= 300)
  and (menu_title is null or char_length(menu_title) <= 120)
  and (menu_subtitle is null or char_length(menu_subtitle) <= 300)
  and (menu_footer_note is null or char_length(menu_footer_note) <= 500)
  and (description is null or char_length(description) <= 1500)
  and (phone is null or char_length(phone) <= 32)
  and (whatsapp is null or char_length(whatsapp) <= 32)
  and (address is null or char_length(address) <= 300)
  and (city is null or char_length(city) <= 100)
  and (google_review_url is null or char_length(google_review_url) <= 2048)
  and (instagram_url is null or char_length(instagram_url) <= 2048)
  and (instagram_profile_url is null or char_length(instagram_profile_url) <= 2048)
  and (maps_url is null or char_length(maps_url) <= 2048)
  and (logo_url is null or char_length(logo_url) <= 2048)
  and (cover_image_url is null or char_length(cover_image_url) <= 2048)
  and (wifi_network is null or char_length(wifi_network) <= 128)
  and (wifi_password is null or char_length(wifi_password) <= 256)
) not valid;
alter table public.restaurants validate constraint restaurants_content_lengths_check;

alter table public.menu_categories add constraint menu_categories_content_lengths_check check (
  (subtitle is null or char_length(subtitle) <= 300)
  and (image_url is null or char_length(image_url) <= 2048)
) not valid;
alter table public.menu_categories validate constraint menu_categories_content_lengths_check;

alter table public.menu_items add constraint menu_items_detail_bounds_check check (
  (image_url is null or char_length(image_url) <= 2048)
  and (portion_label is null or char_length(portion_label) <= 80)
  and (taste_note is null or char_length(taste_note) <= 240)
  and (spiciness_level is null or spiciness_level between 0 and 5)
  and (tags is null or (cardinality(tags) <= 20 and pg_column_size(tags) <= 4096))
) not valid;
alter table public.menu_items validate constraint menu_items_detail_bounds_check;

alter table public.restaurant_tables add constraint restaurant_tables_label_length_check
  check (label is null or char_length(label) <= 80) not valid;
alter table public.restaurant_tables validate constraint restaurant_tables_label_length_check;