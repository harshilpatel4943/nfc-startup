import React from 'react';
import { ExternalLink } from 'lucide-react';
import { restaurantConfig } from '../../config/restaurantConfig';
import { TribalDivider } from '../common/TribalDivider';
import { InstagramIcon } from '../common/InstagramIcon';

export const InstagramSection: React.FC = () => {
  const handleInstagramClick = () => {
    if (restaurantConfig.instagramUrl.includes('[CLIENT')) {
      alert('Client Instagram URL configuration placeholder active: ' + restaurantConfig.instagramUrl);
    } else {
      window.open(restaurantConfig.instagramUrl, '_blank');
    }
  };

  return (
    <section className="py-8 px-3.5 bg-[#120F0D] relative z-10 border-t border-[#4A2E1D]/40 select-none">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-4">
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#C6A477] uppercase font-bold">
            VISUAL DISCOVERY
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-wider text-[#EFE4CF] mt-0.5 flex items-center justify-center space-x-2">
            <InstagramIcon className="w-5 h-5 text-[#C6A477]" />
            <span>FROM THE CAVE</span>
          </h2>
          <div className="w-28 mx-auto my-1">
            <TribalDivider variant="chevron" />
          </div>
        </div>

        {/* Instagram Visual Showcase 3-Tile Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="relative rounded-xl overflow-hidden aspect-square border border-[#4A2E1D] group active:scale-95 transition-transform">
            <img src="/assets/cave-interior-1.jpg" alt="The Cave Murals" className="w-full h-full object-cover object-[50%_30%]" />
            <div className="absolute inset-0 bg-[#120F0D]/30 flex items-center justify-center">
              <InstagramIcon className="w-4 h-4 text-[#FFF1D1]/90" />
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden aspect-square border border-[#4A2E1D] group active:scale-95 transition-transform">
            <img src="/assets/cave-interior-2.jpg" alt="The Cave Masks" className="w-full h-full object-cover object-[50%_35%]" />
            <div className="absolute inset-0 bg-[#120F0D]/30 flex items-center justify-center">
              <InstagramIcon className="w-4 h-4 text-[#FFF1D1]/90" />
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden aspect-square border border-[#4A2E1D] group active:scale-95 transition-transform">
            <img src="/assets/cave-logo-sign.jpg" alt="The Cave Night Sign" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-[#120F0D]/30 flex items-center justify-center">
              <InstagramIcon className="w-4 h-4 text-[#FFF1D1]/90" />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div>
          <button
            onClick={handleInstagramClick}
            className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-[#191512] border border-[#C6A477]/40 text-[#FFF1D1] font-sans font-bold text-xs tracking-wider uppercase active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <span>FOLLOW THE JOURNEY</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C6A477]" />
          </button>
        </div>
      </div>
    </section>
  );
};
