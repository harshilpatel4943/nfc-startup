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
      className="group relative rounded-xl p-4 sm:p-5 parchment-texture text-[#2A1A10] transition-all duration-300 hover:shadow-[0_12px_35px_rgba(0,0,0,0.6)] cursor-pointer select-none border border-[#C6A477]/70"
    >
      {/* Inner Decorative Double Border Line */}
      <div className="absolute inset-1.5 rounded-lg border border-[#8C5138]/20 pointer-events-none"></div>

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
          <h3 className="font-display font-bold text-base sm:text-lg tracking-wide text-[#2A1A10] group-hover:text-[#8C5138] transition-colors leading-tight">
            {item.name}
          </h3>

          {/* Ingredients / Description */}
          <p className="text-xs font-sans text-[#4A3528]/95 mt-1.5 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price Tag & Expand Arrow */}
        <div className="flex flex-col items-end justify-between self-stretch pl-2 border-l border-[#8C5138]/20">
          <span className="font-display font-black text-lg sm:text-xl text-[#4A2E1D] whitespace-nowrap tracking-wide">
            ₹{item.price}
          </span>
          <div className="p-1 rounded-full bg-[#8C5138]/10 text-[#8C5138] group-hover:bg-[#8C5138]/20 transition-colors mt-2">
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      {/* Expandable Details Tray */}
      {expanded && (
        <div className="relative z-10 mt-3.5 pt-3 border-t border-[#8C5138]/30 animate-fadeIn text-xs font-sans text-[#2A1A10]">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {item.isVegetarian && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-[#385227]/15 text-[#2C421E] border border-[#385227]/40 font-bold text-[10px] tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2C421E]"></span>
                <span>100% PURE VEG</span>
              </span>
            )}

            {item.spicinessLevel && (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#8C5138]/10 text-[#8C5138] text-[10px] font-bold border border-[#8C5138]/30">
                <span>Spice Rating:</span>
                <span className="tracking-tighter font-serif text-sm">{'🌶️'.repeat(item.spicinessLevel)}</span>
              </span>
            )}

            {item.tags?.map((t, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-[#4A2E1D]/10 text-[#4A2E1D] text-[10px] font-semibold border border-[#4A2E1D]/20 uppercase tracking-wider">
                {t}
              </span>
            ))}
          </div>

          <p className="italic font-serif text-xs text-[#5A3926] mt-1.5 flex items-center space-x-1">
            <Info className="w-3.5 h-3.5 text-[#8C5138] inline shrink-0" />
            <span>"Crafted with hand-ground regional spices and slow clay-tandoor roasting."</span>
          </p>
        </div>
      )}
    </div>
  );
};
