import React from 'react';
import { TribalDivider } from '../common/TribalDivider';

export const StorySection: React.FC = () => {
  return (
    <section className="py-8 px-3.5 bg-[#120F0D] relative z-10 border-t border-[#4A2E1D]/40 select-none">
      <div className="max-w-md mx-auto">
        {/* Story Card Container with Parchment Texture Accent */}
        <div className="relative rounded-2xl p-5 parchment-texture shadow-xl border border-[#C6A477]/60 text-[#2A1A10]">
          {/* Subtle Corner Tribal Ornaments */}
          <div className="absolute top-3 left-3 text-[#8C5138]/40">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M0 0H10V2H2V10H0V0Z" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute top-3 right-3 text-[#8C5138]/40">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M24 0H14V2H22V10H24V0Z" fill="currentColor" />
            </svg>
          </div>

          <div className="text-center pt-1">
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#8C5138] uppercase font-black">
              OUR ROOTS
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-wider text-[#2A1A10] mt-0.5">
              THE CAVE STORY
            </h2>
            <div className="w-28 mx-auto my-1">
              <TribalDivider variant="minimal" color="#8C5138" />
            </div>
          </div>

          <div className="space-y-3 font-serif text-xs sm:text-sm text-[#3D291C] leading-relaxed text-center mt-2.5">
            <p>
              Long before modern dining rooms existed, humanity gathered around the warmth of central firelight in stone shelters—sharing stories, breaking bread, and celebrating harvests.
            </p>
            <p className="font-bold text-[#4A2E1D]">
              At <span className="font-display font-black">THE CAVE</span>, we recreate that primal warmth and sanctuary.
            </p>
            <p className="font-sans text-xs text-[#4A3528]/90 font-light">
              From the clay tandoors of Awadh to the fiery spices of Chettinad and vibrant Gujarati platters, our kitchen curates true regional Indian gastronomy.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#8C5138]/25 flex items-center justify-center">
            <span className="text-[10px] font-sans tracking-[0.2em] text-[#8C5138] uppercase font-bold">
              EARTH • ART • LIGHT • FLAVOUR
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
