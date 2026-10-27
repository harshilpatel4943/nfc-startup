import { restaurantConfig, type RestaurantConfig } from '../config/restaurantConfig';
import { menuCategories, menuItems, type MenuItem, type MenuCategory } from './menuData';

export interface ManagedMenuItem extends MenuItem {
  isAvailable: boolean;
  isPopular?: boolean;
  isTodaysSpecial?: boolean;
}

export interface RestaurantTable {
  id: string;
  number: number;
  isActive: boolean;
}

export interface GuestService {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
}

export interface DemoSetup {
  restaurant: RestaurantConfig;
  menuCategories: MenuCategory[];
  menuItems: ManagedMenuItem[];
  tables: RestaurantTable[];
  services: GuestService[];
}

export interface GuestRequest {
  id: string;
  tableNumber: number;
  type: string;
  createdAt: string;
}

export interface GuestFeedback {
  id: string;
  tableNumber?: number | null;
  overall: string;
  foodRating: number;
  ambienceRating: number;
  serviceRating: number;
  visitAgain: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Reviewed';
}

export function createDefaultSetup(): DemoSetup {
  return {
    restaurant: { ...restaurantConfig, openingHours: { ...restaurantConfig.openingHours } },
    menuCategories: menuCategories.map((category) => ({ ...category })),
    menuItems: menuItems.map((item) => ({ ...item, isAvailable: true, isTodaysSpecial: !!item.isMaharajaSpecial, isMaharajaSpecial: false })),
    tables: [1, 2, 3].map((number) => ({ id: `table-${number}`, number, isActive: true })),
    services: [
      { id: 'menu', name: 'Digital menu', description: 'Browse categories, search dishes, and view prices.', isEnabled: true },
      { id: 'staff', name: 'Call table staff', description: 'Let guests request water, a waiter, or the bill.', isEnabled: true },
      { id: 'feedback', name: 'Private feedback', description: 'Collect guest ratings and comments for the team.', isEnabled: true },
      { id: 'loyalty', name: 'Loyalty rewards', description: 'Show a sample digital stamp card to returning guests.', isEnabled: true },
      { id: 'wifi', name: 'Guest Wi-Fi', description: 'Display the restaurant’s guest network details.', isEnabled: true },
      { id: 'reviews', name: 'Google reviews', description: 'Send guests to the restaurant review page.', isEnabled: true },
      { id: 'instagram', name: 'Instagram link', description: 'Link guests to the restaurant’s social profile.', isEnabled: true },
      { id: 'game', name: 'Table game', description: 'Offer a simple game while guests wait.', isEnabled: true },
      { id: 'popular', name: 'Popular dishes', description: 'Feature a carousel of highlighted menu items.', isEnabled: true },
      { id: 'contact', name: 'Location and contact', description: 'Show address, hours, directions, and phone number.', isEnabled: true },
    ],
  };
}
