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
import { getRestaurantConfig, PUBLIC_SETUP_STORAGE_KEY } from './config/restaurantConfig';
import { loadPublishedSetup } from './data/demoStore';

const AdminApp = lazy(() => import('./features/admin/AdminApp').then((module) => ({ default: module.AdminApp })));

function CustomerExperience() {
  const [publishedSetup, setPublishedSetup] = useState(loadPublishedSetup);
  const restaurantConfig = getRestaurantConfig();
  const enabledServices = publishedSetup.services;
  const isServiceEnabled = (id: string) => enabledServices.find((service) => service.id === id)?.isEnabled ?? true;
  const tableParam = Number(new URLSearchParams(window.location.search).get('table'));
  const tableNumber = Number.isInteger(tableParam) && tableParam > 0 ? tableParam : 12;
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
    const syncPublishedSetup = (event: StorageEvent) => {
      if (event.key === null || event.key === PUBLIC_SETUP_STORAGE_KEY) setPublishedSetup(loadPublishedSetup());
    };
    window.addEventListener('storage', syncPublishedSetup);
    return () => window.removeEventListener('storage', syncPublishedSetup);
  }, []);

  const menuIsEnabled = isServiceEnabled('menu');
  useEffect(() => {
    if (!menuIsEnabled && currentTab === 'menu') setCurrentTab('home');
  }, [menuIsEnabled, currentTab]);

  const handleOpenReviews = () => {
    if (restaurantConfig.googleReviewUrl.includes('[CLIENT')) {
      alert('Client Google Review URL configuration active: ' + restaurantConfig.googleReviewUrl);
    } else {
      window.open(restaurantConfig.googleReviewUrl, '_blank');
    }
  };

  const handleOpenInstagram = () => {
    if (restaurantConfig.instagramUrl.includes('[CLIENT')) {
      alert('Client Instagram URL configuration active: ' + restaurantConfig.instagramUrl);
    } else {
      window.open(restaurantConfig.instagramUrl, '_blank');
    }
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
          {currentTab === 'menu' && menuIsEnabled ? (
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
            />
          )}
        </main>

        {/* In-Restaurant Guest Modals */}
        {isServiceEnabled('wifi') && <WifiModal
          isOpen={isWifiOpen}
          onClose={() => setIsWifiOpen(false)}
        />}

        {isServiceEnabled('feedback') && <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
        />}

        {isServiceEnabled('staff') && <CallStaffModal
          isOpen={isStaffOpen}
          onClose={() => setIsStaffOpen(false)}
          tableNumber={tableNumber}
        />}

        {isServiceEnabled('loyalty') && <LoyaltyModal
          isOpen={isLoyaltyOpen}
          onClose={() => setIsLoyaltyOpen(false)}
        />}

        {isServiceEnabled('game') && <SnakeModal
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
