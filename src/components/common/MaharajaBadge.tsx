import React from 'react';

interface MaharajaBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const MaharajaBadge: React.FC<MaharajaBadgeProps> = ({ className = '', size = 'sm' }) => {
  return (
    <div className={`inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#4A2E1D]/40 via-[#8C5138]/30 to-[#4A2E1D]/40 border border-[#C6A477]/60 text-[#C6A477] font-sans font-bold uppercase tracking-widest shadow-sm ${size === 'sm' ? 'text-[9px]' : 'text-xs'} ${className}`}>
      {/* Royal Crown Seal SVG Icon */}
      <svg className="w-3.5 h-3.5 text-[#C6A477] shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 16L3 5L8.5 9L12 3L15.5 9L21 5L19 16H5Z" fill="currentColor" opacity="0.9" />
        <path d="M4 18H20V20H4V18Z" fill="currentColor" />
        <circle cx="12" cy="7" r="1" fill="#FFF1D1" />
      </svg>
      <span className="font-semibold tracking-[0.15em] text-[#FFF1D1]">MAHARAJA SPECIAL</span>
    </div>
  );
};
