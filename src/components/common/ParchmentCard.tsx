import React, { useState } from 'react';
import { MenuItem } from '../../data/menuData';
import { MaharajaBadge } from './MaharajaBadge';
import { ChevronDown, Info } from 'lucide-react';

interface ParchmentCardProps {
  item: MenuItem;
}

export const ParchmentCard: React.FC<ParchmentCardProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="
        group relative rounded-xl p-4 sm:p-5
        bg-[#1A1613]/85 backdrop-blur-md text-[#EFE4CF]
        transition-all duration-300
        cursor-pointer select-none
        border border-[#C6A477]/30
        hover:shadow-[0_8px_30px_rgba(198,164,119,0.15)]
        hover:border-[#C6A477]/70
        active:shadow-[0_8px_30px_rgba(198,164,119,0.28)]
        active:border-[#C6A477]/80
        active:scale-[0.99]
      "
    >
      {/* Inner Decorative Accent Line */}
      <div className="absolute inset-1.5 rounded-lg border border-[#C6A477]/15 pointer-events-none transition-colors group-hover:border-[#C6A477]/30 active:border-[#C6A477]/45" />

      {/* Main Card Content */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex-1 pr-1">
          {/* Maharaja Badge Indicator */}
          {item.isMaharajaSpecial && (
            <div className="mb-2">
              <MaharajaBadge size="sm" />
            </div>
          )}

          {/* Item Name */}
          <h3 className="font-display font-bold text-base sm:text-lg tracking-wide text-[#EFE4CF] transition-colors group-hover:text-[#FFF1D1] active:text-[#FFF1D1] leading-tight">
            {item.name}
          </h3>

          {/* Ingredients / Description */}
          <p className="text-xs font-sans text-[#C6A477]/80 mt-1.5 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price Tag & Expand Arrow */}
        <div className="flex flex-col items-end justify-between self-stretch pl-3 border-l border-[#C6A477]/20">
          <span className="font-display font-black text-lg sm:text-xl text-[#FFF1D1] whitespace-nowrap tracking-wide drop-shadow-[0_2px_8px_rgba(255,241,209,0.2)]">
            ₹{item.price}
          </span>
          <div className="p-1 rounded-full bg-[#C6A477]/10 text-[#C6A477] transition-colors mt-2 group-hover:bg-[#C6A477]/20 active:bg-[#C6A477]/25">
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      {/* Expandable Details Tray */}
      {expanded && (
        <div className="relative z-10 mt-3.5 pt-3 border-t border-[#C6A477]/20 animate-fadeIn text-xs font-sans text-[#EFE4CF]">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {item.isVegetarian && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-[#2C421E]/40 text-[#86EFAC] border border-[#2C421E] font-bold text-[10px] tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]"></span>
                <span>100% PURE VEG</span>
              </span>
            )}

            {item.spicinessLevel && (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#C6A477]/10 text-[#C6A477] text-[10px] font-bold border border-[#C6A477]/30">
                <span>Spice Rating:</span>
                <span className="tracking-tighter font-serif text-sm">{'🌶️'.repeat(item.spicinessLevel)}</span>
              </span>
            )}

            {item.tags?.map((t, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-[#4A2E1D]/40 text-[#C6A477] text-[10px] font-semibold border border-[#C6A477]/20 uppercase tracking-wider">
                {t}
              </span>
            ))}
          </div>

          <p className="italic font-serif text-xs text-[#C6A477]/80 mt-1.5 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-[#C6A477] inline shrink-0" />
            <span>"Crafted with hand-ground regional spices and slow clay-tandoor roasting."</span>
          </p>
        </div>
      )}
    </div>
  );
};
