import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Bell, Utensils, Wifi } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenStaffModal: () => void;
  onOpenWifiModal: () => void;
  onGoHome: () => void;
  currentTab: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenMenu, 
  onOpenStaffModal, 
  onOpenWifiModal,
  onGoHome,
  currentTab 
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 max-w-md mx-auto pt-[env(safe-area-inset-top,0px)] ${
        scrolled 
          ? 'bg-[#120F0D]/95 backdrop-blur-xl border-b border-[#4A2E1D]/60 py-2 shadow-2xl' 
          : 'bg-gradient-to-b from-[#120F0D]/95 via-[#120F0D]/70 to-transparent py-2.5'
      }`}
    >
      <div className="px-3.5 flex items-center justify-between select-none">
        {/* Brand Logo & Name */}
        <button 
          onClick={onGoHome} 
          className="flex items-center space-x-2 text-left active:scale-95 transition-transform"
        >
          <Logo size="sm" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm tracking-widest text-[#EFE4CF] font-extrabold">
              THE CAVE
            </span>
            <span className="text-[8px] font-sans tracking-[0.2em] text-[#C6A477] uppercase font-bold">
              Regional Indian
            </span>
          </div>
        </button>

        {/* Top Header Actions */}
        <div className="flex items-center space-x-1.5">
          {/* Wi-Fi Quick Access */}
          <button 
            onClick={onOpenWifiModal}
            className="w-9 h-9 rounded-full bg-[#191512] border border-[#C6A477]/40 text-[#C6A477] hover:text-[#FFF1D1] active:scale-95 transition-all flex items-center justify-center shadow-sm"
            title="Guest Wi-Fi"
            aria-label="Guest Wi-Fi"
          >
            <Wifi className="w-4 h-4" />
          </button>

          {/* Call Waiter */}
          <button 
            onClick={onOpenStaffModal}
            className="min-h-[36px] px-2.5 py-1 rounded-full bg-[#8C5138]/25 border border-[#8C5138]/60 text-[#EFE4CF] text-[11px] font-sans font-semibold active:scale-95 transition-all flex items-center space-x-1"
            title="Call Table Staff"
          >
            <Bell className="w-3.5 h-3.5 text-[#C6A477] animate-pulse" />
            <span className="text-[10px] tracking-wider text-[#EFE4CF] font-bold">Staff</span>
          </button>

          {/* Direct Menu Quick Pill */}
          {currentTab !== 'menu' && (
            <button 
              onClick={onOpenMenu}
              className="min-h-[36px] px-3 py-1 rounded-full bg-[#C6A477] text-[#120F0D] font-sans font-extrabold text-[11px] tracking-wider uppercase active:scale-95 transition-all duration-200 shadow-[0_0_15px_rgba(198,164,119,0.35)] flex items-center space-x-1"
            >
              <Utensils className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>MENU</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
