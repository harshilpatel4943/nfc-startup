import React, { useState } from 'react';
import { TribalDivider } from '../common/TribalDivider';
import { Maximize2, X, ChevronRight } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  description: string;
}

export const GallerySection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g-1',
      title: 'Prehistoric Murals & Vaulted Ceilings',
      subtitle: 'The Dining Hall',
      src: '/assets/cave-interior-1.jpg',
      description: 'Hand-painted cave ceiling depicting hunter-gatherer campfire rituals, tribal geometric columns, and warm glowing lotus chandeliers.'
    },
    {
      id: 'g-2',
      title: 'Tribal Relief Masks & Floral Light Cluster',
      subtitle: 'Ancient Sculptures',
      src: '/assets/cave-interior-2.jpg',
      description: 'Carved wood and stone mask sculptures mounted on textured walls beneath suspended lotus-petal chandeliers.'
    },
    {
      id: 'g-3',
      title: 'The Circular Illuminated Globe Sign',
      subtitle: 'The Entrance',
      src: '/assets/cave-logo-sign.jpg',
      description: 'The Cave glowing circular exterior mark illuminating the night entrance.'
    },
  ];

  return (
    <section className="py-8 px-3.5 bg-[#120F0D] relative z-10 border-t border-[#4A2E1D]/40 select-none">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-4">
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#C6A477] uppercase font-bold">
            VISUAL SANCTUARY
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-wider text-[#EFE4CF] mt-0.5">
            INSIDE THE CAVE
          </h2>
          <div className="w-32 mx-auto my-1">
            <TribalDivider variant="circles" />
          </div>
        </div>

        {/* Swipe Hint */}
        <div className="flex items-center justify-between text-[11px] font-sans text-[#C6A477]/80 mb-2 px-1">
          <span>Atmospheric Photography</span>
          <span className="flex items-center text-[10px] uppercase font-bold">
            Swipe <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>

        {/* Horizontal Mobile Swipeable Gallery with Snap */}
        <div className="flex space-x-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 -mx-3.5 px-3.5">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="snap-center shrink-0 w-[82vw] max-w-[320px] rounded-2xl overflow-hidden border border-[#C6A477]/40 bg-[#191512] shadow-xl relative cursor-pointer group active:scale-[0.98] transition-transform"
            >
              <div className="h-56 relative overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover object-[50%_35%] filter brightness-[0.88] contrast-[1.1] group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191512] via-transparent to-transparent"></div>

                <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-[#120F0D]/80 border border-[#C6A477]/40 text-[#C6A477] backdrop-blur-sm">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                <div className="absolute bottom-2 left-3 right-3">
                  <span className="text-[9px] font-sans font-bold tracking-widest text-[#C6A477] uppercase bg-[#120F0D]/90 px-2 py-0.5 rounded border border-[#C6A477]/30">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-serif font-bold text-sm text-[#FFF1D1] line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[11px] font-sans text-[#EFE4CF]/70 line-clamp-2 mt-1 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-[#120F0D]/95 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-sm w-full bg-[#191512] rounded-2xl border border-[#C6A477]/60 overflow-hidden shadow-2xl">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-[#120F0D]/85 border border-[#C6A477]/40 text-[#EFE4CF]"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full max-h-[60vh] object-contain bg-[#0C0A09]"
              />

              <div className="p-4 space-y-1">
                <span className="text-[10px] font-sans tracking-widest text-[#C6A477] uppercase font-bold">
                  {selectedImage.subtitle}
                </span>
                <h3 className="font-serif text-base font-bold text-[#FFF1D1]">
                  {selectedImage.title}
                </h3>
                <p className="text-xs font-sans text-[#EFE4CF]/80 leading-relaxed font-light">
                  {selectedImage.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
