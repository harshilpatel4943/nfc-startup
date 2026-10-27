export interface RestaurantConfig {
  name: string;
  tagline: string;
  descriptor: string;
  menuTitle: string;
  menuSubtitle: string;
  menuFooterNote: string;
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
  logoUrl: string;
  coverImageUrl: string;
  instagramProfileUrl: string;
}

let cloudRestaurantConfig: RestaurantConfig | null = null;

export function setCloudRestaurantConfig(config: RestaurantConfig | null): void {
  cloudRestaurantConfig = config;
}

export function getRestaurantConfig(): RestaurantConfig {
  return cloudRestaurantConfig ?? restaurantConfig;
}

export const restaurantConfig: RestaurantConfig = {
  name: "THE CAVE",
  tagline: "REGIONAL INDIAN CUISINE",
  descriptor: "A journey through India's regional flavours",
  menuTitle: 'THE CAVE MENU',
  menuSubtitle: 'Authentic regional flavours crafted in ancient subterranean warmth',
  menuFooterNote: 'All prices are in Indian Rupees (₹). Taxes applicable as per government guidelines.',
  heroDescription: "An immersive dining sanctuary where prehistoric art, cave architecture, organic firelight, and rich regional Indian cuisine converge.",
  phone: '',
  whatsapp: '',
  address: '',
  city: '',
  googleReviewUrl: '',
  instagramUrl: '',
  wifiNetwork: '',
  wifiPassword: '',
  openingHours: {
    days: '',
    lunch: '',
    dinner: ''
  },
  mapsUrl: '',
  logoUrl: '',
  coverImageUrl: '',
  instagramProfileUrl: '',
};
