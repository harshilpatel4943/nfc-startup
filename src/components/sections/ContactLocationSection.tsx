import React from 'react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { restaurantConfig } from '../../config/restaurantConfig';
import { TribalDivider } from '../common/TribalDivider';

export const ContactLocationSection: React.FC = () => {
  const handleDirectionsClick = () => {
    window.open(restaurantConfig.mapsUrl, '_blank');
  };

  return (
    <section id="location" className="py-8 px-3.5 bg-[#120F0D] relative z-10 border-t border-[#4A2E1D]/40 select-none">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-4">
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#C6A477] uppercase font-bold">
            FIND THE CAVE
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-wider text-[#EFE4CF] mt-0.5">
            LOCATION & CONTACT
          </h2>
          <div className="w-28 mx-auto my-1">
            <TribalDivider variant="chevron" />
          </div>
        </div>

        {/* Location Card */}
        <div className="rounded-2xl p-4 bg-[#191512] border border-[#C6A477]/40 shadow-xl space-y-3.5">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-[#120F0D] border border-[#C6A477]/30 text-[#C6A477]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-sans tracking-widest text-[#C6A477] uppercase font-bold">
                RESTAURANT ADDRESS
              </span>
              <p className="font-sans font-bold text-xs sm:text-sm text-[#FFF1D1] mt-0.5">
                {restaurantConfig.address}
              </p>
              <p className="text-[11px] text-[#EFE4CF]/70 font-sans mt-0.5">
                {restaurantConfig.city}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-2.5 border-t border-[#4A2E1D]/50">
            <div className="p-2 rounded-xl bg-[#120F0D] border border-[#C6A477]/30 text-[#C6A477]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-sans tracking-widest text-[#C6A477] uppercase font-bold">
                DINING HOURS
              </span>
              <p className="font-sans text-[11px] text-[#EFE4CF] mt-0.5">
                {restaurantConfig.openingHours.days}
              </p>
              <p className="font-sans text-[11px] text-[#FFF1D1] font-semibold">
                Lunch: {restaurantConfig.openingHours.lunch} • Dinner: {restaurantConfig.openingHours.dinner}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: GET DIRECTIONS & CALL */}
        <div className="grid grid-cols-2 gap-2.5 mt-3.5">
          <button
            onClick={handleDirectionsClick}
            className="min-h-[46px] py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C6A477] to-[#DFBF8E] text-[#120F0D] font-sans font-extrabold text-[11px] tracking-wider uppercase active:scale-95 transition-all shadow-md flex items-center justify-center space-x-1.5"
          >
            <Navigation className="w-3.5 h-3.5 fill-current" />
            <span>GET DIRECTIONS</span>
          </button>

          <a
            href={`tel:${restaurantConfig.phone}`}
            className="min-h-[46px] py-2.5 px-3 rounded-xl bg-[#191512] border border-[#C6A477]/40 text-[#FFF1D1] font-sans font-bold text-[11px] tracking-wider uppercase active:scale-95 transition-all flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 text-[#C6A477]" />
            <span>CALL US NOW</span>
          </a>
        </div>
      </div>
    </section>
  );
};
