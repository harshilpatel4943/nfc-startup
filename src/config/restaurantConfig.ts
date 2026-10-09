export interface RestaurantConfig {
  name: string;
  tagline: string;
  descriptor: string;
  heroDescription: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  googleReviewUrl: string;
  instagramUrl: string;
  wifiNetwork: string;
  wifiPassword: string;
  openingHours: {
    lunch: string;
    dinner: string;
    days: string;
  };
  mapsUrl: string;
}

export const PUBLIC_SETUP_STORAGE_KEY = 'nfc-restaurant-demo:published-setup';

export function getRestaurantConfig(): RestaurantConfig {
  if (typeof window === 'undefined') return restaurantConfig;

  try {
    const saved = window.localStorage.getItem(PUBLIC_SETUP_STORAGE_KEY);
    if (!saved) return restaurantConfig;
    const parsed = JSON.parse(saved) as { restaurant?: Partial<RestaurantConfig> };
    return { ...restaurantConfig, ...parsed.restaurant };
  } catch {
    return restaurantConfig;
  }
}

export const restaurantConfig: RestaurantConfig = {
  name: "THE CAVE",
  tagline: "REGIONAL INDIAN CUISINE",
  descriptor: "A journey through India's regional flavours",
  heroDescription: "An immersive dining sanctuary where prehistoric art, cave architecture, organic firelight, and rich regional Indian cuisine converge.",
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  address: "Plot No. 42, Cave Temple Avenue, Regional Cultural District",
  city: "Ahmedabad, Gujarat",
  // Placeholder URLs clearly marked for client replacement
  googleReviewUrl: "[CLIENT GOOGLE REVIEW URL]",
  instagramUrl: "[CLIENT INSTAGRAM URL]",
  wifiNetwork: "THECAVE_GUEST",
  wifiPassword: "CAVE_DINING_GUEST",
  openingHours: {
    days: "Open All 7 Days",
    lunch: "12:00 PM – 3:30 PM",
    dinner: "7:00 PM – 11:30 PM"
  },
  mapsUrl: "https://maps.google.com/?q=The+Cave+Regional+Indian+Cuisine"
};
