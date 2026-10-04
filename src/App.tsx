import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { LogoRevealOverlay } from './components/sections/LogoRevealOverlay';
import { HomePage } from './pages/HomePage';
import { CandourHubPage } from './pages/CandourHubPage';
import { MenuPage } from './pages/MenuPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { ConnectPage } from './pages/ConnectPage';
import { WifiModal } from './components/sections/WifiModal';
import { FeedbackModal } from './components/sections/FeedbackModal';
import { CallStaffModal } from './components/sections/CallStaffModal';
import { LoyaltyModal } from './components/sections/LoyaltyModal';
import { SudokuModal } from './components/sections/SudokuModal';
import { restaurantConfig } from './config/restaurantConfig';
import { Sparkles, Phone, ShieldCheck } from 'lucide-react';

export function App() {
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'nfc_table_hub' | 'cave_dark'>('nfc_table_hub');
  const [currentTab, setCurrentTab] = useState<'home' | 'menu' | 'experience' | 'connect'>('home');

  // Utility Modal States
  const [isWifiOpen, setIsWifiOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isStaffOpen, setIsStaffOpen] = useState<boolean>(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState<boolean>(false);
  const [isSudokuOpen, setIsSudokuOpen] = useState<boolean>(false);

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
    <div className={`min-h-screen font-sans antialiased flex flex-col items-center justify-start ${
      viewMode === 'nfc_table_hub' ? 'bg-[#E5E5EA] text-[#1C1C1E]' : 'bg-[#0A0807] text-[#EFE4CF]'
    }`}>
      {/* Client Preview Bar (Allows client to switch between NFC Instant Hub vs Subterranean Dark Theme) */}
      <div className="w-full max-w-md bg-black text-white px-4 py-2 flex items-center justify-between text-xs z-50 border-b border-white/10 shadow-lg">
        <span className="font-semibold text-gray-300 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> NFC Table Tag Demo
        </span>
        <div className="flex bg-white/10 p-0.5 rounded-lg border border-white/10">
          <button
            onClick={() => setViewMode('nfc_table_hub')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              viewMode === 'nfc_table_hub' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            NFC Table View
          </button>
          <button
            onClick={() => setViewMode('cave_dark')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              viewMode === 'cave_dark' ? 'bg-[#C6A477] text-black shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Dark Mode
          </button>
        </div>
      </div>

      {/* Mobile Shell Frame */}
      <div className={`w-full max-w-md min-h-screen relative flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.4)] overflow-x-hidden ${
        viewMode === 'nfc_table_hub' ? 'bg-[#ECECEE]' : 'bg-[#120F0D] sm:border-x sm:border-[#4A2E1D]/50'
      }`}>
        
        {/* Opening Reveal Overlay (Only for Dark mode) */}
        {showOverlay && viewMode === 'cave_dark' && (
          <LogoRevealOverlay onComplete={() => setShowOverlay(false)} />
        )}

        {/* Dynamic Route View */}
        <main className="flex-1 w-full">
          {currentTab === 'menu' ? (
            /* Digital Menu Page - Accessible in ALL view modes */
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
            />
          ) : viewMode === 'nfc_table_hub' ? (
            /* NFC Table Tag Home View */
            <CandourHubPage
              onOpenLoyalty={() => setIsLoyaltyOpen(true)}
              onOpenReviews={handleOpenReviews}
              onOpenMenu={() => handleTabChange('menu')}
              onOpenWifi={() => setIsWifiOpen(true)}
              onOpenFeedback={() => setIsFeedbackOpen(true)}
              onOpenSudoku={() => setIsSudokuOpen(true)}
              onOpenInstagram={handleOpenInstagram}
            />
          ) : (
            /* Subterranean Cave Theme */
            <>
              <Header
                onOpenMenu={() => handleTabChange('menu')}
                onOpenStaffModal={() => setIsStaffOpen(true)}
                onOpenWifiModal={() => setIsWifiOpen(true)}
                onGoHome={() => handleTabChange('home')}
                currentTab={currentTab}
              />

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

              <BottomNav
                currentTab={currentTab}
                onTabChange={handleTabChange}
              />
            </>
          )}
        </main>

        {/* In-Restaurant Guest Modals */}
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
