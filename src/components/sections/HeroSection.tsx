import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Star, Wifi, ChevronDown, Sparkles, Flame } from 'lucide-react';
import { Logo } from '../common/Logo';
import { TribalDivider } from '../common/TribalDivider';
import { restaurantConfig } from '../../config/restaurantConfig';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onOpenWifi: () => void;
  onOpenReviews: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMenu,
  onOpenWifi,
  onOpenReviews,
}) => {
  return (
    <section 
      id="home" 
      className="relative min-h-[100dvh] w-full flex flex-col justify-between pt-16 pb-24 px-4 overflow-hidden cave-dark-texture select-none perspective-1000"
    >
      {/* Background Photography with Vertical Mobile Crop & Atmospheric Vignette */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/cave-interior-1.jpg" 
          alt="The Cave Restaurant Atmosphere" 
          className="w-full h-full object-cover object-[50%_25%] filter brightness-[0.38] contrast-[1.2]"
          loading="eager"
        />
        {/* Cinematic Dual Vignette: Dark Bottom & Top Shadow with Warm Center Firelight */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-[#120F0D]/60 to-[#120F0D]/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(255,241,209,0.18)_0%,rgba(198,164,119,0.06)_45%,rgba(18,15,13,0.85)_80%)]"></div>
      </div>

      {/* Floating 3D Ambient Light Orbs */}
      <div className="absolute top-1/4 -left-20 w-56 h-56 bg-[#8C5138]/20 rounded-full blur-3xl pointer-events-none animate-lamp-pulse" />
      <div className="absolute top-1/2 -right-20 w-56 h-56 bg-[#C6A477]/15 rounded-full blur-3xl pointer-events-none animate-lamp-pulse" />

      {/* Top Floating Table Guest Welcome Badge (3D Glass Pill) */}
      <motion.div 
        initial={{ opacity: 0, y: -20, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 flex items-center justify-center pt-2"
      >
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#120F0D]/80 border border-[#C6A477]/50 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.6)] glow-border-3d">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C6A477] animate-ping" />
          <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-[#FFF1D1] uppercase flex items-center gap-1">
            <Flame className="w-3 h-3 text-[#C6A477]" /> NFC Smart Table Experience
          </span>
        </div>
      </motion.div>

      {/* Center Brand Identity (Illuminated Logo & Typography with 3D Float) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, z: -50 }}
        animate={{ opacity: 1, scale: 1, z: 0 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative z-10 flex flex-col items-center text-center my-auto px-2 preserve-3d animate-float-3d"
      >
        {/* Illuminated Circular Logo Mark matching cave-logo-sign.jpg */}
        <div className="animate-lamp-pulse mb-3 filter drop-shadow-[0_0_25px_rgba(255,241,209,0.3)]">
          <Logo size="lg" />
        </div>

        {/* Descriptor Tagline with Brackets */}
        <div className="flex items-center space-x-1 text-[11px] font-sans tracking-[0.22em] text-[#C6A477] uppercase font-bold mb-1.5">
          <span className="text-[#8C5138]">[</span>
          <span>{restaurantConfig.tagline}</span>
          <span className="text-[#8C5138]">]</span>
        </div>
        
        {/* Main Name */}
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-[0.16em] text-[#EFE4CF] drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
          {restaurantConfig.name}
        </h1>

        {/* Subtitle */}
        <p className="font-serif italic text-sm sm:text-base text-[#FFF1D1]/90 max-w-xs mt-2 leading-snug">
          "{restaurantConfig.descriptor}"
        </p>

        {/* Hunter/Fauna Tribal Divider Line */}
        <div className="w-48 my-2">
          <TribalDivider variant="hunter" />
        </div>

        <p className="text-[11px] font-sans text-[#EFE4CF]/80 max-w-[280px] leading-relaxed font-light">
          Immersive subterranean dining inspired by ancient firelight and rich regional Indian spices.
        </p>
      </motion.div>

      {/* Bottom One-Hand Touch Reach Zone (Thumb Reachable 3D Actions) */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm mx-auto space-y-3">
        {/* Primary High-Impact CTA: EXPLORE MENU */}
        <motion.button
          whileHover={{ scale: 1.03, rotateX: -5 }}
          whileTap={{ scale: 0.96 }}
          onClick={onExploreMenu}
          className="w-full min-h-[54px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#C6A477] via-[#DFBF8E] to-[#C6A477] text-[#120F0D] font-sans font-extrabold text-xs sm:text-sm tracking-[0.22em] uppercase shadow-[0_10px_35px_rgba(198,164,119,0.5)] active:scale-[0.97] transition-all duration-200 flex items-center justify-center space-x-2.5 border-2 border-[#FFF1D1]"
        >
          <Utensils className="w-4 h-4 text-[#120F0D] shrink-0 stroke-[2.5]" />
          <span>EXPLORE DIGITAL MENU</span>
        </motion.button>

        {/* Secondary Quick Tap Utility Row */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenWifi}
            className="min-h-[44px] py-2.5 px-3 rounded-xl bg-[#191512]/90 border border-[#C6A477]/40 text-[#EFE4CF] text-[11px] font-sans font-semibold tracking-wider uppercase hover:border-[#C6A477] active:scale-95 transition-all flex items-center justify-center space-x-1.5 backdrop-blur-sm shadow-md"
          >
            <Wifi className="w-3.5 h-3.5 text-[#C6A477]" />
            <span>GUEST WI-FI</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenReviews}
            className="min-h-[44px] py-2.5 px-3 rounded-xl bg-[#191512]/90 border border-[#C6A477]/40 text-[#EFE4CF] text-[11px] font-sans font-semibold tracking-wider uppercase hover:border-[#C6A477] active:scale-95 transition-all flex items-center justify-center space-x-1.5 backdrop-blur-sm shadow-md"
          >
            <Star className="w-3.5 h-3.5 fill-[#C6A477] text-[#C6A477]" />
            <span>GOOGLE REVIEWS</span>
          </motion.button>
        </div>

        {/* Subtle Scroll Cue */}
        <div className="pt-1 flex items-center space-x-1 text-[#C6A477]/70 text-[9px] font-sans tracking-[0.2em] uppercase">
          <span>Scroll to discover</span>
          <ChevronDown className="w-3 h-3 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
