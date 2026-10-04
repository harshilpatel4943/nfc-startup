import React from 'react';
import { menuItems } from '../../data/menuData';
import { ParchmentCard } from '../common/ParchmentCard';
import { TribalDivider } from '../common/TribalDivider';
import { Utensils } from 'lucide-react';

interface MenuPreviewSectionProps {
  onOpenFullMenu: () => void;
}

export const MenuPreviewSection: React.FC<MenuPreviewSectionProps> = ({ onOpenFullMenu }) => {
  // Highlight Maharaja Specials and Signature dishes for preview
  const previewItems = menuItems.filter(item => item.isMaharajaSpecial || item.tags?.includes('Signature')).slice(0, 3);

  return (
    <section className="py-8 px-3.5 bg-[#120F0D] relative z-10 border-t border-[#4A2E1D]/40 select-none">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-5">
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#C6A477] uppercase font-bold">
            CHEF'S CURATION
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-wider text-[#EFE4CF] mt-0.5">
            SIGNATURE DISHES
          </h2>
          <div className="w-32 mx-auto my-1">
            <TribalDivider variant="chevron" />
          </div>
        </div>

        {/* Preview Cards */}
        <div className="space-y-3 mb-5">
          {previewItems.map(item => (
            <ParchmentCard key={item.id} item={item} />
          ))}
        </div>

        {/* View Full Menu CTA */}
        <div>
          <button
            onClick={onOpenFullMenu}
            className="w-full min-h-[50px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#C6A477] via-[#DFBF8E] to-[#C6A477] text-[#120F0D] font-sans font-extrabold text-xs tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(198,164,119,0.35)] active:scale-95 transition-all flex items-center justify-center space-x-2 border-2 border-[#FFF1D1]"
          >
            <Utensils className="w-4 h-4 stroke-[2.5]" />
            <span>OPEN COMPLETE MENU ({menuItems.length} DISHES)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
