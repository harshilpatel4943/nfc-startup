import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Award, Sparkles, CheckCircle2, QrCode, ArrowRight } from 'lucide-react';
import { restaurantConfig } from '../../config/restaurantConfig';

interface LoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoyaltyModal: React.FC<LoyaltyModalProps> = ({ isOpen, onClose }) => {
  const [stamps, setStamps] = useState<number>(3); // Initial 3 stamps collected
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleClaimStamp = () => {
    if (stamps < 9) {
      setStamps((prev) => prev + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setIsSubmitted(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
          animate={{ opacity: 0.99, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotateX: -15 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          className="w-full max-w-sm glass-3d-card rounded-3xl p-6 relative border border-[#C6A477]/30 shadow-[0_25px_60px_rgba(0,0,0,0.9)] perspective-1000 overflow-hidden"
        >
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#C6A477]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-[#8C5138]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#1A1512]/80 border border-[#C6A477]/20 flex items-center justify-center text-[#EFE4CF] hover:text-[#FFF1D1] hover:border-[#C6A477]/50 transition-all active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8C5138] to-[#4A2E1D] flex items-center justify-center border border-[#C6A477]/40 shadow-lg shadow-[#8C5138]/20">
              <Heart className="w-6 h-6 text-[#FFF1D1] fill-[#FFF1D1]/30" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#C6A477] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Digital Loyalty Card
              </span>
              <h3 className="text-lg font-bold text-[#EFE4CF]">Earn Rewards</h3>
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div className="relative w-full h-56 mb-5 perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="w-full h-full preserve-3d relative"
            >
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 w-full h-full rounded-2xl parchment-texture p-4 flex flex-col justify-between backface-hidden shadow-xl border border-[#4A2E1D]/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#2A1A10] text-base leading-tight">{restaurantConfig.name}</h4>
                    <p className="text-xs text-[#5A3926] font-medium">Collect 9 stamps to earn a free coffee</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#2A1A10]/10 text-[10px] font-bold text-[#2A1A10] border border-[#2A1A10]/20">
                    {stamps}/9 Stamps
                  </span>
                </div>

                {/* 3x3 Stamp Grid */}
                <div className="grid grid-cols-5 gap-2 my-2">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (i === stamps) handleClaimStamp();
                      }}
                      className={`h-11 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                        i < stamps
                          ? 'bg-[#8C5138] border-[#4A2E1D] text-[#FFF1D1] shadow-md shadow-[#8C5138]/30 scale-100'
                          : i === stamps
                          ? 'bg-[#8C5138]/20 border-dashed border-[#8C5138] text-[#8C5138] animate-pulse cursor-pointer'
                          : 'bg-[#2A1A10]/5 border-[#2A1A10]/15 text-[#2A1A10]/30'
                      }`}
                    >
                      {i < stamps ? (
                        <Award className="w-5 h-5 fill-[#FFF1D1]/30 text-[#FFF1D1]" />
                      ) : i === stamps ? (
                        <span className="text-xs font-bold">+1</span>
                      ) : (
                        <span className="text-xs font-semibold">{i + 1}</span>
                      )}
                    </motion.div>
                  ))}
                  {/* 10th reward badge */}
                  <div className={`col-span-2 h-11 rounded-xl flex items-center justify-center gap-1 text-xs font-bold border transition-all ${
                    stamps === 9 
                      ? 'bg-gradient-to-r from-[#8C5138] to-[#C6A477] text-white border-[#FFF1D1] shadow-lg animate-bounce' 
                      : 'bg-[#2A1A10]/10 text-[#5A3926] border-[#2A1A10]/20'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5" /> FREE COFFEE
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-[#5A3926] pt-1 border-t border-[#2A1A10]/10">
                  <span>Tap card to show QR code</span>
                  <span className="font-semibold underline">Flip ↻</span>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="absolute inset-0 w-full h-full rounded-2xl bg-[#120F0D] p-5 flex flex-col items-center justify-center text-center backface-hidden [transform:rotateY(180deg)] border border-[#C6A477]/40 shadow-xl">
                <div className="w-16 h-16 bg-[#FFF1D1] rounded-xl p-2 flex items-center justify-center mb-2 shadow-lg shadow-[#C6A477]/20">
                  <QrCode className="w-12 h-12 text-[#120F0D]" />
                </div>
                <h5 className="text-sm font-bold text-[#FFF1D1]">Member ID: #CAVE-{Math.floor(1000 + Math.random() * 9000)}</h5>
                <p className="text-xs text-[#C6A477] mt-1">Show this QR to staff at the counter to claim your stamps</p>
                <span className="text-[10px] text-[#EFE4CF]/60 mt-3 underline">Tap to flip back ↺</span>
              </div>
            </motion.div>
          </div>

          {/* Form / Claim Section */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#C6A477] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F0D]/90 border border-[#C6A477]/30 text-sm text-[#EFE4CF] placeholder-[#EFE4CF]/40 focus:outline-none focus:border-[#C6A477] focus:ring-1 focus:ring-[#C6A477] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#C6A477] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#120F0D]/90 border border-[#C6A477]/30 text-sm text-[#EFE4CF] placeholder-[#EFE4CF]/40 focus:outline-none focus:border-[#C6A477] focus:ring-1 focus:ring-[#C6A477] transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8C5138] to-[#C6A477] text-[#120F0D] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#8C5138]/30 transition-all hover:brightness-110 mt-2"
              >
                <span>Save Digital Loyalty Card</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-[#8C5138]/20 border border-[#8C5138]/40 text-center space-y-2"
            >
              <div className="w-10 h-10 rounded-full bg-[#8C5138] text-[#FFF1D1] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#FFF1D1]">Loyalty Card Saved!</h4>
              <p className="text-xs text-[#EFE4CF]/80">
                Welcome back, <span className="text-[#C6A477] font-semibold">{name}</span>! Your stamps will auto-sync every time you scan our table QR code.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
