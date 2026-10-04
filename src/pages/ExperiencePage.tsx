import React, { useState } from 'react';
import { ArrowLeft, Utensils, Maximize2, X, Sparkles } from 'lucide-react';
import { TribalDivider } from '../components/common/TribalDivider';

interface ExperiencePageProps {
  onBackToHome: () => void;
  onOpenMenu: () => void;
}

export const ExperiencePage: React.FC<ExperiencePageProps> = ({ onBackToHome, onOpenMenu }) => {
  const [activeImage, setActiveImage] = useState<{ src: string; title: string; desc: string } | null>(null);

  const highlights = [
    {
      id: 'h-1',
      title: 'ORGANIC LOTUS PENDANTS & TRIBAL MASKS',
      subtitle: 'Subterranean Ambiance',
      image: '/assets/cave-interior-2.jpg',
      quote: 'Earth. Art. Warm Light.',
      description: 'Towering relief-carved tribal mask sculptures mounted on textured walls, beneath clusters of glowing lotus-petal chandeliers suspended from thick natural rope cords.'
    },
    {
      id: 'h-2',
      title: 'PREHISTORIC CEILING MURALS & VAULTS',
      subtitle: 'Ancient Communal Rituals',
      image: '/assets/cave-interior-1.jpg',
      quote: 'Cave Plaster. Hunters. Firelight.',
      description: 'Curved vaulted plaster ceilings adorned with hand-painted prehistoric murals of campfire rituals, hunters with spears, and radiating fan-rib column capitals.'
    },
    {
      id: 'h-3',
      title: 'THE NIGHT ENTRANCE SIGN',
      subtitle: 'Illuminated Identity',
      image: '/assets/cave-logo-sign.jpg',
      quote: 'The Sanctuary Entrance.',
      description: 'The circular illuminated globe sign shining through the night, welcoming guests into an otherworldly cavern of regional Indian gastronomy.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#120F0D] text-[#EFE4CF] pt-16 pb-28 px-3.5 sm:px-4 cave-dark-texture select-none">
      <div className="max-w-md mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#191512] border border-[#C6A477]/40 text-xs font-sans font-bold text-[#EFE4CF] hover:text-[#FFF1D1] active:scale-95 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C6A477]" />
            <span>HOME</span>
          </button>

          <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#C6A477] uppercase">
            IMMERSIVE CAVERN
          </span>
        </div>

        {/* Section Intro */}
        <div className="text-center">
          <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#C6A477] uppercase">
            PHYSICAL ATMOSPHERE
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-wider text-[#EFE4CF] mt-1">
            STEP INSIDE THE CAVE
          </h1>
          <p className="font-serif italic text-xs text-[#FFF1D1]/80 mt-1 max-w-xs mx-auto">
            "A dining sanctuary shaped by earth, prehistoric art, and low-light firelight."
          </p>
          <div className="w-36 mx-auto my-1">
            <TribalDivider variant="circles" />
          </div>
        </div>

        {/* Mobile Visual Storytelling Cards */}
        <div className="space-y-6">
          {highlights.map((item, idx) => (
            <div 
              key={item.id}
              className="rounded-2xl overflow-hidden border border-[#C6A477]/40 bg-[#191512] shadow-xl relative"
            >
              {/* Photo with Vertical Mobile Frame */}
              <div 
                className="relative h-64 sm:h-72 w-full overflow-hidden cursor-pointer group"
                onClick={() => setActiveImage({ src: item.image, title: item.title, desc: item.description })}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover object-[50%_35%] group-hover:scale-105 transition-transform duration-500 filter brightness-[0.88] contrast-[1.1]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191512] via-transparent to-transparent"></div>
                
                {/* Tap to expand badge */}
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-[#120F0D]/80 border border-[#C6A477]/40 text-[#C6A477] backdrop-blur-sm">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                <div className="absolute bottom-2 left-3 right-3">
                  <span className="text-[9px] font-sans font-bold tracking-widest text-[#C6A477] uppercase bg-[#120F0D]/85 px-2 py-0.5 rounded border border-[#C6A477]/30">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {/* Story Content Block */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#FFF1D1] tracking-wide">
                    {item.title}
                  </h3>
                  <span className="font-display font-extrabold text-xs text-[#C6A477]/60">0{idx + 1}</span>
                </div>

                <p className="font-serif italic text-xs text-[#C6A477]">
                  "{item.quote}"
                </p>

                <p className="text-xs font-sans text-[#EFE4CF]/80 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Short Philosophy Kraft Box */}
        <div className="rounded-2xl p-5 parchment-texture text-[#2A1A10] border border-[#C6A477] shadow-xl text-center space-y-2">
          <span className="text-[10px] font-sans font-black tracking-[0.2em] text-[#8C5138] uppercase">
            PHILOSOPHY OF THE CAVE
          </span>
          <h3 className="font-display font-bold text-lg text-[#2A1A10]">
            The Primal Ritual of Gathering
          </h3>
          <p className="text-xs font-serif leading-relaxed text-[#3D291C]/90">
            Before modern restaurants, humanity gathered around central firelight in subterranean stone shelters to break bread and celebrate harvests. The Cave brings that timeless communion back to life with authentic regional Indian recipes.
          </p>
        </div>

        {/* Bottom CTA to Menu */}
        <div className="pt-2">
          <button
            onClick={onOpenMenu}
            className="w-full min-h-[50px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#C6A477] via-[#DFBF8E] to-[#C6A477] text-[#120F0D] font-sans font-extrabold text-xs tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(198,164,119,0.4)] active:scale-95 transition-all flex items-center justify-center space-x-2 border-2 border-[#FFF1D1]"
          >
            <Utensils className="w-4 h-4 stroke-[2.5]" />
            <span>EXPLORE THE DIGITAL MENU</span>
          </button>
        </div>

        {/* Lightbox Modal */}
        {activeImage && (
          <div className="fixed inset-0 z-50 bg-[#120F0D]/95 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-md w-full bg-[#191512] rounded-2xl border border-[#C6A477]/60 overflow-hidden shadow-2xl">
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-[#120F0D]/80 border border-[#C6A477]/40 text-[#EFE4CF]"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={activeImage.src}
                alt={activeImage.title}
                className="w-full max-h-[60vh] object-contain bg-[#0C0A09]"
              />

              <div className="p-4 space-y-1">
                <h3 className="font-serif text-base font-bold text-[#FFF1D1]">
                  {activeImage.title}
                </h3>
                <p className="text-xs font-sans text-[#EFE4CF]/80 leading-relaxed font-light">
                  {activeImage.desc}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
