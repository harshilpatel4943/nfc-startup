import React from 'react';
import { Logo } from '../common/Logo';
import { TribalDivider } from '../common/TribalDivider';
import { restaurantConfig } from '../../config/restaurantConfig';

interface FooterProps {
  onOpenMenu: () => void;
  onOpenReviews: () => void;
  onOpenFeedback: () => void;
  onOpenWifi: () => void;
  onOpenInstagram: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenMenu,
  onOpenReviews,
  onOpenFeedback,
  onOpenWifi,
  onOpenInstagram,
}) => {
  return (
    <footer className="bg-[#0D0A08] text-[#EFE4CF] pt-8 pb-24 px-4 border-t border-[#4A2E1D]/50 relative z-10 select-none">
      <div className="max-w-md mx-auto flex flex-col items-center text-center">
        {/* Brand Mark */}
        <Logo size="md" className="mb-2.5" />

        <h3 className="font-display font-black text-lg tracking-[0.18em] text-[#EFE4CF]">
          {restaurantConfig.name}
        </h3>
        <p className="text-[9px] font-sans tracking-[0.25em] text-[#C6A477] uppercase font-bold">
          {restaurantConfig.tagline}
        </p>

        <div className="w-24 my-3 opacity-60">
          <TribalDivider variant="minimal" />
        </div>

        {/* Compact Quick Links Grid */}
        <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-[11px] font-sans font-bold text-[#C6A477]/80 w-full max-w-xs mb-4">
          <button onClick={onOpenMenu} className="hover:text-[#FFF1D1] py-1 active:scale-95 transition-transform">MENU</button>
          <button onClick={onOpenReviews} className="hover:text-[#FFF1D1] py-1 active:scale-95 transition-transform">REVIEWS</button>
          <button onClick={onOpenFeedback} className="hover:text-[#FFF1D1] py-1 active:scale-95 transition-transform">FEEDBACK</button>
          <button onClick={onOpenWifi} className="hover:text-[#FFF1D1] py-1 active:scale-95 transition-transform">WI-FI</button>
          <button onClick={onOpenInstagram} className="hover:text-[#FFF1D1] py-1 active:scale-95 transition-transform">INSTAGRAM</button>
          <a href="#location" className="hover:text-[#FFF1D1] py-1 active:scale-95 transition-transform">LOCATION</a>
        </div>

        {/* Location & Copyright */}
        <p className="text-[10px] font-sans text-[#EFE4CF]/50 leading-normal max-w-xs">
          {restaurantConfig.address}, {restaurantConfig.city}
        </p>

        <p className="text-[9px] font-sans text-[#C6A477]/40 tracking-wider mt-3">
          © {new Date().getFullYear()} {restaurantConfig.name}. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};
