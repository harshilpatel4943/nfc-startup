import React from 'react';
import { Home, Utensils, Compass, Radio } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#120F0D]/95 backdrop-blur-xl border-t border-[#C6A477]/30 px-3 pt-2 pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))] shadow-[0_-10px_35px_rgba(0,0,0,0.85)] max-w-md mx-auto select-none">
      <div className="flex items-center justify-between">
        {/* 1. HOME TAB */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 transition-all duration-200 active:scale-95 ${
            currentTab === 'home' ? 'text-[#FFF1D1]' : 'text-[#C6A477]/60 hover:text-[#EFE4CF]'
          }`}
          aria-label="Home"
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'text-[#C6A477] stroke-[2.2]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-sans font-bold tracking-widest mt-1 uppercase">
            Home
          </span>
          {currentTab === 'home' && (
            <span className="w-1 h-1 rounded-full bg-[#C6A477] mt-0.5"></span>
          )}
        </button>

        {/* 2. MENU TAB (ELEVATED & PROMINENT CENTER PILL) */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={() => onTabChange('menu')}
            className={`w-14 h-14 rounded-full bg-gradient-to-b from-[#DFBF8E] via-[#C6A477] to-[#8C5138] text-[#120F0D] flex flex-col items-center justify-center shadow-[0_0_25px_rgba(198,164,119,0.55)] border-[3px] border-[#120F0D] active:scale-95 transition-all duration-200 ${
              currentTab === 'menu' ? 'ring-2 ring-[#FFF1D1] scale-105' : 'hover:scale-105'
            }`}
            aria-label="Digital Menu"
          >
            <Utensils className="w-5 h-5 text-[#120F0D] stroke-[2.8]" />
            <span className="text-[8px] font-sans font-black tracking-widest text-[#120F0D] uppercase mt-0.5">
              MENU
            </span>
          </button>
        </div>

        {/* 3. EXPERIENCE TAB */}
        <button
          onClick={() => onTabChange('experience')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 transition-all duration-200 active:scale-95 ${
            currentTab === 'experience' ? 'text-[#FFF1D1]' : 'text-[#C6A477]/60 hover:text-[#EFE4CF]'
          }`}
          aria-label="The Cave Experience"
        >
          <Compass className={`w-5 h-5 ${currentTab === 'experience' ? 'text-[#C6A477] stroke-[2.2]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-sans font-bold tracking-widest mt-1 uppercase">
            Cave
          </span>
          {currentTab === 'experience' && (
            <span className="w-1 h-1 rounded-full bg-[#C6A477] mt-0.5"></span>
          )}
        </button>

        {/* 4. CONNECT TAB */}
        <button
          onClick={() => onTabChange('connect')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 transition-all duration-200 active:scale-95 ${
            currentTab === 'connect' ? 'text-[#FFF1D1]' : 'text-[#C6A477]/60 hover:text-[#EFE4CF]'
          }`}
          aria-label="Connect Services"
        >
          <Radio className={`w-5 h-5 ${currentTab === 'connect' ? 'text-[#C6A477] stroke-[2.2]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-sans font-bold tracking-widest mt-1 uppercase">
            Connect
          </span>
          {currentTab === 'connect' && (
            <span className="w-1 h-1 rounded-full bg-[#C6A477] mt-0.5"></span>
          )}
        </button>
      </div>
    </nav>
  );
};
