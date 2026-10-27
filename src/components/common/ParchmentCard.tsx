import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MenuItem } from '../../data/menuData';
import { MaharajaBadge } from './MaharajaBadge';
import { ChevronDown } from 'lucide-react';

interface ParchmentCardProps {
  item: MenuItem;
  imageUrl?: string;
}

export const ParchmentCard: React.FC<ParchmentCardProps> = ({ item, imageUrl }) => {
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="
        group relative rounded-xl p-4 sm:p-5
        bg-[#1A1613]/85 backdrop-blur-md text-[#EFE4CF]
        transition-all duration-300
        select-none
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
        {imageUrl && (
          <img
            src={imageUrl}
            alt={item.name}
            loading="lazy"
            className="h-20 w-20 shrink-0 rounded-lg border border-[#C6A477]/30 object-cover sm:h-24 sm:w-24"
          />
        )}

        <div className="flex-1 pr-1">
          {/* Maharaja Badge Indicator */}
          {(item.isMaharajaSpecial || item.isTodaysSpecial) && (
            <div className="mb-2">
              <MaharajaBadge size="sm" label="TODAY'S SPECIAL" />
            </div>
          )}

          {/* Item Name */}
          <h3 className="font-display font-bold text-base sm:text-lg tracking-wide text-[#EFE4CF] transition-colors group-hover:text-[#FFF1D1] active:text-[#FFF1D1] leading-tight">
            {item.name}
          </h3>
          {item.tasteNote && <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-[#FFF1D1]/85">{item.tasteNote}</p>}

        </div>

        {/* Price Tag & Expand Arrow */}
        <div className="flex flex-col items-end justify-between self-stretch pl-3 border-l border-[#C6A477]/20">
          <span className="font-display font-black text-lg sm:text-xl text-[#FFF1D1] whitespace-nowrap tracking-wide drop-shadow-[0_2px_8px_rgba(255,241,209,0.2)]">
            ₹{item.price}
          </span>
          <motion.button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            aria-expanded={expanded}
            aria-label={`${expanded ? 'Hide' : 'Show'} details for ${item.name}`}
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.24, ease: 'easeInOut' }}
            className="mt-2 inline-flex min-h-9 min-w-9 items-center justify-center rounded-full bg-[#C6A477]/10 text-[#C6A477] transition-colors hover:bg-[#C6A477]/20 active:bg-[#C6A477]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A477]"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Expandable Details Tray */}
      <AnimatePresence initial={false}>
        {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0, y: reduceMotion ? 0 : -5 }}
          animate={{ height: 'auto', opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: reduceMotion ? 0 : -3 }}
          transition={reduceMotion ? { duration: 0 } : { height: { duration: 0.25, ease: 'easeInOut' }, opacity: { duration: 0.18 }, y: { duration: 0.2 } }}
          className="relative z-10 overflow-hidden text-xs font-sans text-[#EFE4CF]"
        >
        <div className="mt-3.5 border-t border-[#C6A477]/20 pt-3">
          {item.portionLabel && <span className="inline-flex rounded-md border border-[#C6A477]/45 bg-[#C6A477]/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#F1D7A9]">Portion · {item.portionLabel}</span>}
          {item.description && <p className="mt-1.5 text-xs leading-relaxed text-[#C6A477]/85">{item.description}</p>}

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
                {t.replace(/Maharaja Special/gi, "Today's Special")}
              </span>
            ))}
          </div>

        </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
