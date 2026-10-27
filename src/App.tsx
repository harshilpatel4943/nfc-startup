import React, { lazy, Suspense, useEffect, useState } from 'react';
import { CandourHubPage } from './pages/CandourHubPage';
import { MenuPage } from './pages/MenuPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { ConnectPage } from './pages/ConnectPage';
import { WifiModal } from './components/sections/WifiModal';
import { FeedbackModal } from './components/sections/FeedbackModal';
import { CallStaffModal } from './components/sections/CallStaffModal';
import { LoyaltyModal } from './components/sections/LoyaltyModal';
import { SnakeModal } from './components/sections/SnakeModal';
import { NFCTapLoaderOverlay } from './components/sections/NFCTapLoaderOverlay';
import { getRestaurantConfig, setCloudRestaurantConfig } from './config/restaurantConfig';
import { createDefaultSetup } from './data/demoStore';
import type { ManagedMenuItem } from './data/demoStore';
import { getPageRestaurantSlug, getRestaurantId, isPublicTableActive, loadPublicPopularItems, loadPublicRestaurantConfig, loadPublicServices } from './lib/restaurantCloud';
import { supabase } from './lib/supabase';

const AdminApp = lazy(() => import('./features/admin/AdminApp').then((module) => ({ default: module.AdminApp })));

function CustomerExperience() {
  const [publishedSetup, setPublishedSetup] = useState(createDefaultSetup);
  const [popularMenuItems, setPopularMenuItems] = useState<ManagedMenuItem[]>([]);
  const restaurantConfig = getRestaurantConfig();
  const enabledServices = Array.isArray(publishedSetup.services) ? publishedSetup.services : createDefaultSetup().services;
  const isServiceEnabled = (id: string) => {
    const enabled = enabledServices.find((service) => service.id === id)?.isEnabled ?? true;
    if (!enabled) return false;
    if (id === 'reviews') return Boolean(restaurantConfig.googleReviewUrl);
    if (id === 'instagram') return Boolean(restaurantConfig.instagramUrl);
    if (id === 'wifi') return Boolean(restaurantConfig.wifiNetwork && restaurantConfig.wifiPassword);
    if (id === 'contact') return Boolean(restaurantConfig.address || restaurantConfig.city || restaurantConfig.mapsUrl || restaurantConfig.phone || restaurantConfig.openingHours.days || restaurantConfig.openingHours.lunch || restaurantConfig.openingHours.dinner);
    return true;
  };
  const tableParam = Number(new URLSearchParams(window.location.search).get('table'));
  const tableNumber = Number.isInteger(tableParam) && tableParam > 0 ? tableParam : 1;
  const [tableIsActive, setTableIsActive] = useState<boolean | null>(null);
  const [currentTab, setCurrentTab] = useState<'home' | 'menu' | 'experience' | 'connect'>('home');
  const [showLoaderOverlay, setShowLoaderOverlay] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Utility Modal States
  const [isWifiOpen, setIsWifiOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isStaffOpen, setIsStaffOpen] = useState<boolean>(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState<boolean>(false);
  const [isSnakeOpen, setIsSnakeOpen] = useState<boolean>(false);

  useEffect(() => {
    let current = true;
    void Promise.all([loadPublicRestaurantConfig(), loadPublicServices(), loadPublicPopularItems()]).then(([config, services, popular]) => {
      if (!current) return;
      if (config) setCloudRestaurantConfig(config);
      if (services) setPublishedSetup((setup) => ({ ...setup, services }));
      setPopularMenuItems(popular);
      // Trigger a render so components reading getRestaurantConfig() receive the cloud profile.
      setPublishedSetup((setup) => ({ ...setup }));
    }).catch((error: unknown) => console.error('Could not load restaurant setup:', error));
    return () => { current = false; };
  }, []);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let current = true;
    let refreshTimer: number | undefined;
    let channel: ReturnType<typeof client.channel> | null = null;
    const refreshTableStatus = () => {
      void isPublicTableActive(tableNumber).then((active) => { if (current) setTableIsActive(active); })
        .catch((error: unknown) => console.error('Could not refresh table link status:', error));
    };
    const refreshPublishedContent = () => {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        void Promise.all([loadPublicRestaurantConfig(), loadPublicServices(), loadPublicPopularItems()]).then(([config, services, popular]) => {
          if (!current) return;
          if (config) setCloudRestaurantConfig(config);
          if (services) setPublishedSetup((setup) => ({ ...setup, services }));
          setPopularMenuItems(popular);
          setPublishedSetup((setup) => ({ ...setup }));
        }).catch((error: unknown) => console.error('Could not refresh published restaurant content:', error));
      }, 300);
    };
    void getRestaurantId(getPageRestaurantSlug()).then((restaurantId) => {
      if (!current) return;
      channel = client.channel(`customer-published-${restaurantId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurants', filter: `id=eq.${restaurantId}` }, refreshPublishedContent)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_categories', filter: `restaurant_id=eq.${restaurantId}` }, refreshPublishedContent)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items', filter: `restaurant_id=eq.${restaurantId}` }, refreshPublishedContent)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurant_tables', filter: `restaurant_id=eq.${restaurantId}` }, refreshTableStatus)
        .subscribe();
    }).catch((error: unknown) => console.error('Could not subscribe to restaurant updates:', error));
    return () => {
      current = false;
      if (refreshTimer) window.clearTimeout(refreshTimer);
      if (channel) void client.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let current = true;
    void isPublicTableActive(tableNumber).then((active) => { if (current) setTableIsActive(active); })
      .catch((error: unknown) => { console.error('Could not check table link status:', error); if (current) setTableIsActive(true); });
    return () => { current = false; };
  }, [tableNumber]);

  const menuIsEnabled = isServiceEnabled('menu');
  useEffect(() => {
    if (!menuIsEnabled && currentTab === 'menu') setCurrentTab('home');
  }, [menuIsEnabled, currentTab]);

  const handleOpenReviews = () => {
    if (restaurantConfig.googleReviewUrl) window.open(restaurantConfig.googleReviewUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenInstagram = () => {
    if (restaurantConfig.instagramUrl) window.open(restaurantConfig.instagramUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab as 'home' | 'menu' | 'experience' | 'connect');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen font-sans antialiased flex flex-col items-center justify-start transition-colors duration-300 ${
      isDarkMode ? 'bg-[#0A0807] text-[#EFE4CF]' : 'bg-[#E5E5EA] text-[#1C1C1E]'
    }`}>
      {/* NFC Tap Multi-Phase Animated Welcome & Preloader Overlay */}
      {showLoaderOverlay && (
        <NFCTapLoaderOverlay onComplete={() => setShowLoaderOverlay(false)} />
      )}

      {/* Mobile Shell Frame */}
      <div className={`w-full max-w-md min-h-screen relative flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.4)] overflow-x-hidden transition-colors duration-300 ${
        isDarkMode ? 'bg-[#120F0D] border-x border-[#382E27]/40' : 'bg-[#ECECEE]'
      }`}>
        {/* Dynamic Route View */}
        <main className="flex-1 w-full">
          {tableIsActive === null ? (
            <div className="flex min-h-[50vh] items-center justify-center px-6 text-sm text-[#C6A477]" role="status">Checking table link…</div>
          ) : !tableIsActive ? (
            <section className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center"><div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#C6A477]/50 text-2xl text-[#C6A477]">!</div><h1 className="font-display text-2xl font-bold">Table {tableNumber} is offline</h1><p className="mt-2 max-w-xs text-sm leading-relaxed text-[#B7AA98]">This QR or NFC link is currently paused. Please ask the restaurant team for help.</p></section>
          ) : currentTab === 'menu' && menuIsEnabled ? (
            /* Digital Menu Page */
            <MenuPage onBackToHome={() => handleTabChange('home')} />
          ) : currentTab === 'experience' ? (
            <ExperiencePage 
              onBackToHome={() => handleTabChange('home')} 
              onOpenMenu={() => handleTabChange('menu')}
            />
          ) : currentTab === 'connect' ? (
            <ConnectPage
              onBackToHome={() => handleTabChange('home')}
              onOpenFeedback={() => setIsFeedbackOpen(true)}
              onOpenStaffModal={() => setIsStaffOpen(true)}
              isServiceEnabled={isServiceEnabled}
            />
          ) : (
            /* Main NFC Table Hub View */
            <CandourHubPage
              onOpenLoyalty={() => setIsLoyaltyOpen(true)}
              onOpenReviews={handleOpenReviews}
              onOpenMenu={() => handleTabChange('menu')}
              onOpenWifi={() => setIsWifiOpen(true)}
              onOpenFeedback={() => setIsFeedbackOpen(true)}
              onOpenSudoku={() => setIsSnakeOpen(true)}
              onOpenInstagram={handleOpenInstagram}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
              tableNumber={tableNumber}
              isServiceEnabled={isServiceEnabled}
              popularMenuItems={popularMenuItems}
            />
          )}
        </main>

        {/* In-Restaurant Guest Modals */}
        {tableIsActive && isServiceEnabled('wifi') && <WifiModal
          isOpen={isWifiOpen}
          onClose={() => setIsWifiOpen(false)}
        />}

        {tableIsActive && isServiceEnabled('feedback') && <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          tableNumber={tableNumber}
        />}

        {tableIsActive && isServiceEnabled('staff') && <CallStaffModal
          isOpen={isStaffOpen}
          onClose={() => setIsStaffOpen(false)}
          tableNumber={tableNumber}
        />}

        {tableIsActive && isServiceEnabled('loyalty') && <LoyaltyModal
          isOpen={isLoyaltyOpen}
          onClose={() => setIsLoyaltyOpen(false)}
        />}

        {tableIsActive && isServiceEnabled('game') && <SnakeModal
          isOpen={isSnakeOpen}
          onClose={() => setIsSnakeOpen(false)}
        />}
      </div>
    </div>
  );
}

export function App() {
  return window.location.pathname.startsWith('/admin')
    ? <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#F6F5F2] text-sm font-medium text-[#756C62]">Opening restaurant workspace…</div>}><AdminApp /></Suspense>
    : <CustomerExperience />;
}

export default App;
