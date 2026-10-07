import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NFCTapLoaderOverlayProps {
  onComplete: () => void;
}

export const NFCTapLoaderOverlay: React.FC<NFCTapLoaderOverlayProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'welcome' | 'cave' | 'fade_to_website'>('welcome');

  useEffect(() => {
    // Lock body scrolling while intro overlay is active
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    // Preload cover image in background so website is instant upon reveal
    const img = new Image();
    img.src = '/assets/barlow-cover.jpg';

    // Stage 1 (Welcome) -> Stage 2 (Cave logo): at 1200ms
    const t1 = setTimeout(() => {
      setStage('cave');
    }, 1200);

    // Stage 2 (Cave logo) stays on screen longer -> Stage 3 (Fade to website): at 3600ms
    const t2 = setTimeout(() => {
      setStage('fade_to_website');
    }, 3600);

    // Complete overlay at 4100ms
    const t3 = setTimeout(() => {
      onComplete();
    }, 4100);

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      onClick={onComplete}
      onTouchMove={(e) => e.preventDefault()}
      className={`fixed inset-0 h-[100dvh] w-screen z-[99999] flex flex-col items-center justify-center bg-black text-white select-none cursor-pointer overflow-hidden touch-none transition-opacity duration-600 ${
        stage === 'fade_to_website' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      title="Tap anywhere to skip intro"
    >
      <div className="w-full h-full flex flex-col items-center justify-center my-auto relative z-10 px-4">
        <AnimatePresence mode="wait">
          {/* ================= 1. BLACK SCREEN WELCOME ================= */}
          {stage === 'welcome' && (
            <motion.div
              key="stage-welcome"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="flex flex-col items-center justify-center text-center px-6 my-auto"
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[0.25em] text-white uppercase font-sans">
                WELCOME
              </h1>
              <p className="text-xs font-mono text-gray-400 tracking-[0.3em] uppercase mt-2">
                NFC Table Tag Detected
              </p>
            </motion.div>
          )}

          {/* ================= 2. BLACK SCREEN TO THE CAVE WITH LOGO (EXTENDED DISPLAY) ================= */}
          {stage === 'cave' && (
            <motion.div
              key="stage-cave"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
              className="flex flex-col items-center justify-center text-center px-6 my-auto"
            >
              {/* Round Venue Logo Badge */}
              <div className="w-28 h-28 rounded-full bg-[#120F0D] p-1 border-2 border-[#C6A477]/80 shadow-[0_0_50px_rgba(198,164,119,0.3)] flex items-center justify-center mb-5 shrink-0">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8C5138] to-[#4A2E1D] flex items-center justify-center text-[#FFF1D1] font-bold text-center">
                  <span className="font-display font-extrabold uppercase tracking-tight text-base leading-tight">
                    THE<br />CAVE
                  </span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-[0.2em] text-[#EFE4CF] uppercase">
                THE CAVE
              </h1>
              <p className="text-xs font-sans tracking-[0.28em] text-[#C6A477] uppercase font-bold mt-2">
                Regional Indian Cuisine
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>,
    document.body
  );
};
