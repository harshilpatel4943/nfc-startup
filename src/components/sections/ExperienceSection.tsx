import React from 'react';
import { TribalDivider } from '../common/TribalDivider';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-16 px-4 bg-[#120F0D] relative z-10 overflow-hidden border-t border-[#4A2E1D]/40">
      <div className="max-w-md mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-sans tracking-[0.3em] text-[#C6A477] uppercase font-bold">
            ARCHITECTURE & AMBIENCE
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-wider text-[#EFE4CF] mt-1">
            STEP INSIDE THE CAVE
          </h2>
          <TribalDivider variant="circles" />
        </div>

        {/* Editorial Story Card 1 - Mask Sculptures & Organic Lighting */}
        <div className="relative rounded-2xl overflow-hidden border border-[#C6A477]/40 shadow-2xl mb-8 group bg-[#191512]">
          <img 
            src="/assets/cave-interior-2.jpg" 
            alt="The Cave Organic Lotus Pendant Lights and Carved Mask Sculptures" 
            className="w-full h-84 object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[0.85] contrast-[1.05]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-[#120F0D]/60 to-transparent"></div>
          
          <div className="absolute bottom-0 inset-x-0 p-5">
            <span className="text-[10px] font-sans tracking-[0.2em] text-[#C6A477] uppercase font-bold bg-[#120F0D]/80 px-2 py-0.5 rounded border border-[#C6A477]/30">
              ORGANIC ILLUMINATION & MASK ART
            </span>
            <h3 className="font-serif text-xl font-bold text-[#FFF1D1] mt-2">
              Ancient Sculptures & Lotus Firelight
            </h3>
            <p className="text-xs font-sans text-[#EFE4CF]/85 mt-2 leading-relaxed font-light">
              Towering relief-carved tribal mask sculptures mounted on textured earth walls, paired with glowing lotus-petal chandeliers suspended from rope cords, create an atmospheric subterranean sanctuary.
            </p>
          </div>
        </div>

        {/* Editorial Story Card 2 - Prehistoric Murals & Vaulted Ceilings */}
        <div className="relative rounded-2xl overflow-hidden border border-[#C6A477]/40 shadow-2xl group bg-[#191512]">
          <img 
            src="/assets/cave-interior-1.jpg" 
            alt="The Cave Prehistoric Ceiling Murals and Painted Columns" 
            className="w-full h-84 object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[0.85] contrast-[1.05]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-[#120F0D]/60 to-transparent"></div>
          
          <div className="absolute bottom-0 inset-x-0 p-5">
            <span className="text-[10px] font-sans tracking-[0.2em] text-[#C6A477] uppercase font-bold bg-[#120F0D]/80 px-2 py-0.5 rounded border border-[#C6A477]/30">
              PREHISTORIC WALL & CEILING MURALS
            </span>
            <h3 className="font-serif text-xl font-bold text-[#FFF1D1] mt-2">
              Hand-Painted Cave Ceiling Murals
            </h3>
            <p className="text-xs font-sans text-[#EFE4CF]/85 mt-2 leading-relaxed font-light">
              Vaulted plaster ceilings adorned with early hunter-gatherer cave art, campfires, and geometric fan-palm column motifs evoke humanity's earliest communal dining rituals.
            </p>
          </div>
        </div>

        {/* Key Experience Highlights */}
        <div className="grid grid-cols-3 gap-3 mt-8 text-center">
          <div className="p-3.5 rounded-xl bg-[#4A2E1D]/25 border border-[#C6A477]/30">
            <span className="block font-display text-lg font-extrabold text-[#C6A477]">100%</span>
            <span className="text-[10px] font-sans text-[#EFE4CF]/80 uppercase tracking-wider mt-1 block font-medium">Cave Atmosphere</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#4A2E1D]/25 border border-[#C6A477]/30">
            <span className="block font-display text-lg font-extrabold text-[#C6A477]">REGIONAL</span>
            <span className="text-[10px] font-sans text-[#EFE4CF]/80 uppercase tracking-wider mt-1 block font-medium">Indian Flavours</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#4A2E1D]/25 border border-[#C6A477]/30">
            <span className="block font-display text-lg font-extrabold text-[#C6A477]">WARM</span>
            <span className="text-[10px] font-sans text-[#EFE4CF]/80 uppercase tracking-wider mt-1 block font-medium">Firelight Glow</span>
          </div>
        </div>
      </div>
    </section>
  );
};
