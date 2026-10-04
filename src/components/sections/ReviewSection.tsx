import React from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { restaurantConfig } from '../../config/restaurantConfig';

export const ReviewSection: React.FC = () => {
  const handleReviewClick = () => {
    if (restaurantConfig.googleReviewUrl.includes('[CLIENT')) {
      alert('Client Google Review URL configuration placeholder active: ' + restaurantConfig.googleReviewUrl);
    } else {
      window.open(restaurantConfig.googleReviewUrl, '_blank');
    }
  };

  return (
    <section className="py-8 px-3.5 bg-[#120F0D] relative z-10 border-t border-[#4A2E1D]/40 select-none">
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl p-5 bg-gradient-to-b from-[#191512] to-[#14100D] border border-[#C6A477]/50 text-center shadow-xl relative overflow-hidden space-y-2">
          {/* Subtle Warm Amber Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,241,209,0.12)_0%,transparent_70%)] pointer-events-none"></div>

          {/* 5-Star Rating Row */}
          <div className="flex items-center justify-center space-x-1 text-[#C6A477]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#C6A477] text-[#C6A477]" />
            ))}
          </div>

          <span className="text-[10px] font-sans tracking-[0.25em] text-[#C6A477] uppercase font-bold block">
            YOUR EXPERIENCE MATTERS
          </span>
          
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#FFF1D1]">
            Loved your time at The Cave?
          </h2>

          <p className="font-sans text-xs text-[#EFE4CF]/75 max-w-xs mx-auto leading-relaxed">
            Your review helps fellow food lovers experience authentic regional Indian cuisine.
          </p>

          <div className="pt-2">
            <button
              onClick={handleReviewClick}
              className="w-full min-h-[48px] py-3 px-6 rounded-xl bg-gradient-to-r from-[#C6A477] via-[#DFBF8E] to-[#C6A477] text-[#120F0D] font-sans font-extrabold text-xs tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(198,164,119,0.35)] active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <span>LEAVE A GOOGLE REVIEW</span>
              <ExternalLink className="w-4 h-4 text-[#120F0D] stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
