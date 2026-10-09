import { restaurantConfig, type RestaurantConfig, PUBLIC_SETUP_STORAGE_KEY } from '../config/restaurantConfig';
import { menuItems, type MenuItem } from './menuData';

const ADMIN_DRAFT_KEY = 'nfc-restaurant-demo:admin-draft';
export const DEMO_REQUESTS_STORAGE_KEY = 'nfc-restaurant-demo:requests';
export const DEMO_FEEDBACK_STORAGE_KEY = 'nfc-restaurant-demo:feedback';

export interface ManagedMenuItem extends MenuItem {
  isAvailable: boolean;
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
  menuItems: ManagedMenuItem[];
  tables: RestaurantTable[];
  services: GuestService[];
}

export interface GuestRequest {
  id: string;
  tableNumber: number;
  type: string;
  createdAt: string;
  status: 'New' | 'In progress' | 'Done';
}

export interface GuestFeedback {
  id: string;
  overall: string;
  foodRating: number;
  ambienceRating: number;
  serviceRating: number;
  visitAgain: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Reviewed';
}

const defaultSetup: DemoSetup = {
  restaurant: { ...restaurantConfig },
  menuItems: menuItems.map((item) => ({ ...item, isAvailable: true })),
  tables: [
    { id: 'table-12', number: 12, isActive: true },
    { id: 'table-13', number: 13, isActive: true },
    { id: 'table-14', number: 14, isActive: true },
    { id: 'table-15', number: 15, isActive: true },
  ],
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

const sampleRequests: GuestRequest[] = [
  { id: 'request-sample-1', tableNumber: 12, type: 'Call Waiter', createdAt: 'Today · 12:18 PM', status: 'New' },
  { id: 'request-sample-2', tableNumber: 8, type: 'Water Refill', createdAt: 'Today · 12:04 PM', status: 'In progress' },
  { id: 'request-sample-3', tableNumber: 5, type: 'Request Bill', createdAt: 'Today · 11:52 AM', status: 'Done' },
];

const sampleFeedback: GuestFeedback[] = [
  { id: 'feedback-sample-1', overall: '😊', foodRating: 5, ambienceRating: 5, serviceRating: 4, visitAgain: 'YES', message: 'Loved the paneer tikka and the warm lighting.', createdAt: 'Today · 12:11 PM', status: 'New' },
  { id: 'feedback-sample-2', overall: '🤩', foodRating: 5, ambienceRating: 4, serviceRating: 5, visitAgain: 'YES', message: 'Great service. We will be back with friends.', createdAt: 'Today · 11:36 AM', status: 'Reviewed' },
];

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadAdminDraft(): DemoSetup {
  const base = loadPublishedSetup();
  const draft = readJson<Partial<DemoSetup>>(ADMIN_DRAFT_KEY, {});
  return {
    ...base,
    ...draft,
    restaurant: { ...base.restaurant, ...draft.restaurant },
    menuItems: draft.menuItems ?? base.menuItems,
    tables: draft.tables ?? base.tables,
    services: mergeServices(draft.services ?? base.services),
  };
}

export function saveAdminDraft(setup: DemoSetup): void {
  writeJson(ADMIN_DRAFT_KEY, setup);
}

export function publishAdminSetup(setup: DemoSetup): void {
  writeJson(PUBLIC_SETUP_STORAGE_KEY, {
    restaurant: setup.restaurant,
    menuItems: setup.menuItems,
    tables: setup.tables,
    services: setup.services,
    publishedAt: new Date().toISOString(),
  });
  saveAdminDraft(setup);
}

export function publishServiceSettings(services: GuestService[]): string {
  const current = loadPublishedSetup();
  const publishedAt = new Date().toISOString();
  writeJson(PUBLIC_SETUP_STORAGE_KEY, {
    restaurant: current.restaurant,
    menuItems: current.menuItems,
    tables: current.tables,
    services,
    publishedAt,
  });
  return publishedAt;
}

export function getPublishedAt(): string | null {
  const saved = readJson<{ publishedAt?: string }>(PUBLIC_SETUP_STORAGE_KEY, {});
  return saved.publishedAt ?? null;
}

export function loadPublishedSetup(): DemoSetup {
  const saved = readJson<Partial<DemoSetup>>(PUBLIC_SETUP_STORAGE_KEY, {});
  return {
    ...defaultSetup,
    ...saved,
    restaurant: { ...defaultSetup.restaurant, ...saved.restaurant },
    menuItems: saved.menuItems ?? defaultSetup.menuItems,
    tables: saved.tables ?? defaultSetup.tables,
    services: mergeServices(saved.services ?? defaultSetup.services),
  };
}

function mergeServices(savedServices: GuestService[]): GuestService[] {
  const savedById = new Map(savedServices.map((service) => [service.id, service]));
  return defaultSetup.services.map((service) => ({ ...service, ...savedById.get(service.id) }));
}

export function getPublishedMenuItems(): ManagedMenuItem[] {
  return loadPublishedSetup().menuItems.filter((item) => item.isAvailable !== false);
}

export function getRequests(): GuestRequest[] {
  return readJson(DEMO_REQUESTS_STORAGE_KEY, sampleRequests);
}

export function addGuestRequest(tableNumber: number, type: string): void {
  const request: GuestRequest = {
    id: `request-${Date.now()}`,
    tableNumber,
    type,
    createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    status: 'New',
  };
  writeJson(DEMO_REQUESTS_STORAGE_KEY, [request, ...getRequests()]);
}

export function updateRequestStatus(id: string, status: GuestRequest['status']): GuestRequest[] {
  const updated = getRequests().map((request) => request.id === id ? { ...request, status } : request);
  writeJson(DEMO_REQUESTS_STORAGE_KEY, updated);
  return updated;
}

export function getFeedback(): GuestFeedback[] {
  return readJson(DEMO_FEEDBACK_STORAGE_KEY, sampleFeedback);
}

export function addGuestFeedback(feedback: Omit<GuestFeedback, 'id' | 'createdAt' | 'status'>): void {
  const entry: GuestFeedback = {
    ...feedback,
    id: `feedback-${Date.now()}`,
    createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    status: 'New',
  };
  writeJson(DEMO_FEEDBACK_STORAGE_KEY, [entry, ...getFeedback()]);
}

export function updateFeedbackStatus(id: string, status: GuestFeedback['status']): GuestFeedback[] {
  const updated = getFeedback().map((entry) => entry.id === id ? { ...entry, status } : entry);
  writeJson(DEMO_FEEDBACK_STORAGE_KEY, updated);
  return updated;
}
