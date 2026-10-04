import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Star, MessageSquareHeart, Wifi, MapPin, Phone, ArrowUpRight, Heart, Gamepad2, Sparkles } from 'lucide-react';
import { InstagramIcon } from '../common/InstagramIcon';
import { restaurantConfig } from '../../config/restaurantConfig';

interface QuickActionsProps {
  onOpenMenu: () => void;
  onOpenReviews: () => void;
  onOpenFeedback: () => void;
  onOpenInstagram: () => void;
  onOpenWifi: () => void;
  onOpenContact: () => void;
  onOpenLoyalty: () => void;
  onOpenSudoku: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenMenu,
  onOpenReviews,
  onOpenFeedback,
  onOpenInstagram,
  onOpenWifi,
  onOpenContact,
  onOpenLoyalty,
  onOpenSudoku,
}) => {
  return (
    <section className="py-6 px-4 bg-[#120F0D] relative z-10 border-y border-[#4A2E1D]/40 perspective-1000">
      {/* Background 3D Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#C6A477]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-sm mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#C6A477] uppercase flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FFF1D1] animate-pulse" /> INSTANT TABLE UTILITIES
          </span>
          <span className="text-[10px] font-sans text-[#EFE4CF]/50 tracking-wider">
            1-Tap NFC Access
          </span>
        </div>

        {/* 1. Main Featured Action Tile: DIGITAL MENU (3D Tilt Card) */}
        <motion.button
          whileHover={{ scale: 1.02, rotateX: -3, rotateY: 3, z: 20 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenMenu}
          className="w-full min-h-[60px] mb-3 p-4 rounded-2xl glass-3d-card border border-[#C6A477]/50 flex items-center justify-between text-left transition-all duration-300 group shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C6A477] to-[#8C5138] text-[#120F0D] flex items-center justify-center shadow-lg shadow-[#8C5138]/40 border border-[#FFF1D1]/30">
              <Utensils className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-extrabold text-sm sm:text-base text-[#FFF1D1] tracking-wider uppercase">
                  DIGITAL KRAFT MENU
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-sans font-bold bg-[#8C5138]/40 text-[#FFF1D1] border border-[#C6A477]/50 shadow-sm">
                  Instant
                </span>
              </div>
              <span className="text-[11px] font-sans text-[#EFE4CF]/80">
                Starters, Mains, Thanda Elixirs & Desserts
              </span>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#C6A477] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </motion.button>

        {/* 2. Featured Rewards & Table Sudoku 3D Cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          {/* Earning Rewards Loyalty Card */}
          <motion.button
            whileHover={{ scale: 1.03, rotateX: 3, rotateY: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenLoyalty}
            className="min-h-[70px] p-3.5 rounded-2xl glass-3d-card border border-[#8C5138]/50 hover:border-[#C6A477] text-left flex flex-col justify-between shadow-md group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#8C5138]/30 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between w-full mb-1">
              <div className="p-2 rounded-xl bg-[#8C5138]/30 text-[#FFF1D1] border border-[#C6A477]/30 shadow-sm">
                <Heart className="w-4 h-4 fill-[#FFF1D1]/40 text-[#FFF1D1]" />
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#C6A477]/20 text-[#C6A477]">9 Stamps</span>
            </div>
            <div>
              <span className="font-sans font-bold text-xs text-[#FFF1D1] uppercase block tracking-wide">
                EARN REWARDS
              </span>
              <span className="text-[10px] font-sans text-[#EFE4CF]/70">
                Free Coffee Stamp Card
              </span>
            </div>
          </motion.button>

          {/* Play Table Sudoku Game */}
          <motion.button
            whileHover={{ scale: 1.03, rotateX: 3, rotateY: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSudoku}
            className="min-h-[70px] p-3.5 rounded-2xl glass-3d-card border border-[#4A2E1D] hover:border-[#C6A477] text-left flex flex-col justify-between shadow-md group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#C6A477]/20 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between w-full mb-1">
              <div className="p-2 rounded-xl bg-[#4A2E1D]/50 text-[#C6A477] border border-[#C6A477]/30 shadow-sm">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#8C5138]/30 text-[#FFF1D1]">Play</span>
            </div>
            <div>
              <span className="font-sans font-bold text-xs text-[#FFF1D1] uppercase block tracking-wide">
                TABLE SUDOKU
              </span>
              <span className="text-[10px] font-sans text-[#EFE4CF]/70">
                Play while waiting
              </span>
            </div>
          </motion.button>
        </div>

        {/* 3. Compact 2x2 Grid for Guest Services */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Guest Wi-Fi */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenWifi}
            className="min-h-[58px] p-3.5 rounded-xl bg-[#191512]/90 border border-[#4A2E1D] hover:border-[#C6A477]/50 text-left flex items-center space-x-3 shadow-sm group"
          >
            <div className="p-2 rounded-lg bg-[#4A2E1D]/40 text-[#C6A477] border border-[#C6A477]/20">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <span className="font-sans font-bold text-xs text-[#EFE4CF] uppercase block tracking-wide">
                GUEST WI-FI
              </span>
              <span className="text-[10px] font-sans text-[#EFE4CF]/60">
                1-Tap Auto Connect
              </span>
            </div>
          </motion.button>

          {/* Google Review */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenReviews}
            className="min-h-[58px] p-3.5 rounded-xl bg-[#191512]/90 border border-[#4A2E1D] hover:border-[#C6A477]/50 text-left flex items-center space-x-3 shadow-sm group"
          >
            <div className="p-2 rounded-lg bg-[#4A2E1D]/40 text-[#C6A477] border border-[#C6A477]/20">
              <Star className="w-4 h-4 fill-[#C6A477]" />
            </div>
            <div>
              <span className="font-sans font-bold text-xs text-[#EFE4CF] uppercase block tracking-wide">
                GOOGLE REVIEW
              </span>
              <span className="text-[10px] font-sans text-[#EFE4CF]/60">
                Rate The Cave ★★★★★
              </span>
            </div>
          </motion.button>

          {/* Private Feedback */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenFeedback}
            className="min-h-[58px] p-3.5 rounded-xl bg-[#191512]/90 border border-[#4A2E1D] hover:border-[#C6A477]/50 text-left flex items-center space-x-3 shadow-sm group"
          >
            <div className="p-2 rounded-lg bg-[#4A2E1D]/40 text-[#C6A477] border border-[#C6A477]/20">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
            <div>
              <span className="font-sans font-bold text-xs text-[#EFE4CF] uppercase block tracking-wide">
                FEEDBACK
              </span>
              <span className="text-[10px] font-sans text-[#EFE4CF]/60">
                Anonymous Thoughts
              </span>
            </div>
          </motion.button>

          {/* Instagram */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenInstagram}
            className="min-h-[58px] p-3.5 rounded-xl bg-[#191512]/90 border border-[#4A2E1D] hover:border-[#C6A477]/50 text-left flex items-center space-x-3 shadow-sm group"
          >
            <div className="p-2 rounded-lg bg-[#4A2E1D]/40 text-[#C6A477] border border-[#C6A477]/20">
              <InstagramIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="font-sans font-bold text-xs text-[#EFE4CF] uppercase block tracking-wide">
                INSTAGRAM
              </span>
              <span className="text-[10px] font-sans text-[#EFE4CF]/60">
                @fromthecave
              </span>
            </div>
          </motion.button>
        </div>

        {/* 4. Direct Contact & Directions Row */}
        <div className="grid grid-cols-2 gap-2 mt-2.5">
          <a
            href={`tel:${restaurantConfig.phone}`}
            className="min-h-[44px] py-2 px-3 rounded-xl bg-[#191512] border border-[#4A2E1D]/80 text-[#EFE4CF] text-[11px] font-sans font-semibold tracking-wider flex items-center justify-center space-x-1.5 active:scale-95 transition-all hover:border-[#C6A477]/50"
          >
            <Phone className="w-3.5 h-3.5 text-[#C6A477]" />
            <span>CALL RECEPTION</span>
          </a>

          <button
            onClick={onOpenContact}
            className="min-h-[44px] py-2 px-3 rounded-xl bg-[#191512] border border-[#4A2E1D]/80 text-[#EFE4CF] text-[11px] font-sans font-semibold tracking-wider flex items-center justify-center space-x-1.5 active:scale-95 transition-all hover:border-[#C6A477]/50"
          >
            <MapPin className="w-3.5 h-3.5 text-[#C6A477]" />
            <span>DIRECTIONS & INFO</span>
          </button>
        </div>
      </div>
    </section>
  );
};
