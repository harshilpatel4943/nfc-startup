import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wifi, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { restaurantConfig } from '../../config/restaurantConfig';

interface WifiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WifiModal: React.FC<WifiModalProps> = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(restaurantConfig.wifiPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative w-full max-w-sm bg-[#171411] border border-[#C6A477]/50 rounded-3xl p-5 sm:p-6 shadow-2xl text-[#EFE4CF] my-auto max-h-[88dvh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#5A3926]/30 text-[#C6A477] hover:text-[#FFF1D1] active:scale-95 transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#34C759]/15 border border-[#34C759]/30 text-[#34C759] mx-auto flex items-center justify-center mb-3">
                <Wifi className="w-6 h-6 animate-pulse" />
              </div>

              <span className="text-[10px] font-sans tracking-[0.25em] text-[#C6A477] uppercase font-bold">
                COMPLIMENTARY HIGH-SPEED INTERNET
              </span>
              <h2 className="font-serif text-xl font-bold text-[#FFF1D1] mt-1">
                CONNECT TO THE CAVE
              </h2>
            </div>

            {/* Credentials Display Card */}
            <div className="space-y-4 my-6 bg-[#5A3926]/20 p-4 rounded-2xl border border-[#C6A477]/30">
              <div>
                <span className="text-[10px] font-sans text-[#C6A477] uppercase tracking-wider block font-semibold">
                  Wi-Fi Network Name
                </span>
                <span className="font-sans font-bold text-base text-[#FFF1D1] tracking-wide block mt-0.5">
                  {restaurantConfig.wifiNetwork}
                </span>
              </div>

              <div className="pt-3 border-t border-[#5A3926]/40">
                <span className="text-[10px] font-sans text-[#C6A477] uppercase tracking-wider block font-semibold">
                  Password
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-base font-bold text-[#FFF1D1]">
                    {showPassword ? restaurantConfig.wifiPassword : '••••••••••••'}
                  </span>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-[#C6A477] hover:text-[#FFF1D1] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Copy Password Button */}
            <button
              onClick={handleCopyPassword}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8C5138] to-[#C6A477] text-white font-extrabold text-xs shadow-lg flex items-center justify-center space-x-2 active:scale-98 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Password Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Wi-Fi Password</span>
                </>
              )}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
