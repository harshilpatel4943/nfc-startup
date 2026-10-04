import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { LogoRevealOverlay } from './components/sections/LogoRevealOverlay';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { ConnectPage } from './pages/ConnectPage';
import { WifiModal } from './components/sections/WifiModal';
import { FeedbackModal } from './components/sections/FeedbackModal';
import { CallStaffModal } from './components/sections/CallStaffModal';
import { LoyaltyModal } from './components/sections/LoyaltyModal';
import { SudokuModal } from './components/sections/SudokuModal';
import { restaurantConfig } from './config/restaurantConfig';

export function App() {
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<'home' | 'menu' | 'experience' | 'connect'>('home');

  // Utility Modal States
  const [isWifiOpen, setIsWifiOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isStaffOpen, setIsStaffOpen] = useState<boolean>(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState<boolean>(false);
  const [isSudokuOpen, setIsSudokuOpen] = useState<boolean>(false);

  const handleOpenReviews = () => {
    if (restaurantConfig.googleReviewUrl.includes('[CLIENT')) {
      alert('Client Google Review URL configuration placeholder active: ' + restaurantConfig.googleReviewUrl);
    } else {
      window.open(restaurantConfig.googleReviewUrl, '_blank');
    }
  };

  const handleOpenInstagram = () => {
    if (restaurantConfig.instagramUrl.includes('[CLIENT')) {
      alert('Client Instagram URL configuration placeholder active: ' + restaurantConfig.instagramUrl);
    } else {
      window.open(restaurantConfig.instagramUrl, '_blank');
    }
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab as 'home' | 'menu' | 'experience' | 'connect');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0807] text-[#EFE4CF] font-sans antialiased flex justify-center">
      {/* 1. Mobile-Native Shell (100% width on phones, centered on tablet/desktop) */}
      <div className="w-full max-w-md min-h-screen bg-[#120F0D] relative flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.95)] sm:border-x sm:border-[#4A2E1D]/50 overflow-x-hidden">
        
        {/* 2. Opening Reveal Overlay (~1s snappy mobile entrance) */}
        {showOverlay && (
          <LogoRevealOverlay onComplete={() => setShowOverlay(false)} />
        )}

        {/* 3. Mobile Header Bar */}
        <Header
          onOpenMenu={() => handleTabChange('menu')}
          onOpenStaffModal={() => setIsStaffOpen(true)}
          onOpenWifiModal={() => setIsWifiOpen(true)}
          onGoHome={() => handleTabChange('home')}
          currentTab={currentTab}
        />

        {/* 4. Active Tab Content View */}
        <main className="flex-1 w-full">
          {currentTab === 'home' && (
            <HomePage
              onOpenMenu={() => handleTabChange('menu')}
              onOpenWifi={() => setIsWifiOpen(true)}
              onOpenReviews={handleOpenReviews}
              onOpenFeedback={() => setIsFeedbackOpen(true)}
              onOpenInstagram={handleOpenInstagram}
              onOpenContact={() => handleTabChange('connect')}
              onOpenLoyalty={() => setIsLoyaltyOpen(true)}
              onOpenSudoku={() => setIsSudokuOpen(true)}
            />
          )}

          {currentTab === 'menu' && (
            <MenuPage onBackToHome={() => handleTabChange('home')} />
          )}

          {currentTab === 'experience' && (
            <ExperiencePage 
              onBackToHome={() => handleTabChange('home')} 
              onOpenMenu={() => handleTabChange('menu')}
            />
          )}

          {currentTab === 'connect' && (
            <ConnectPage
              onBackToHome={() => handleTabChange('home')}
              onOpenFeedback={() => setIsFeedbackOpen(true)}
              onOpenStaffModal={() => setIsStaffOpen(true)}
            />
          )}
        </main>

        {/* 5. Persistent Mobile Bottom Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={handleTabChange}
        />

        {/* 6. In-Restaurant Guest Modals */}
        <WifiModal
          isOpen={isWifiOpen}
          onClose={() => setIsWifiOpen(false)}
        />

        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
        />

        <CallStaffModal
          isOpen={isStaffOpen}
          onClose={() => setIsStaffOpen(false)}
        />

        <LoyaltyModal
          isOpen={isLoyaltyOpen}
          onClose={() => setIsLoyaltyOpen(false)}
        />

        <SudokuModal
          isOpen={isSudokuOpen}
          onClose={() => setIsSudokuOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;
