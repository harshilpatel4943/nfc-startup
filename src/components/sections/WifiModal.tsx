import React, { useState } from 'react';
import { X, Wifi, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { restaurantConfig } from '../../config/restaurantConfig';
import { TribalDivider } from '../common/TribalDivider';

interface WifiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WifiModal: React.FC<WifiModalProps> = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(restaurantConfig.wifiPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#171411]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-[#171411] border border-[#C6A477]/50 rounded-2xl p-6 shadow-2xl cave-dark-texture text-[#EFE4CF]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#5A3926]/30 text-[#C6A477] hover:text-[#FFF1D1]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#5A3926]/30 border border-[#C6A477]/50 text-[#C6A477] mx-auto flex items-center justify-center mb-3">
            <Wifi className="w-6 h-6 animate-pulse text-[#C6A477]" />
          </div>

          <span className="text-[10px] font-sans tracking-[0.25em] text-[#C6A477] uppercase font-bold">
            COMPLIMENTARY HIGH-SPEED INTERNET
          </span>
          <h2 className="font-serif text-xl font-bold text-[#FFF1D1] mt-1">
            CONNECT TO THE CAVE
          </h2>
          <TribalDivider variant="minimal" />
        </div>

        {/* Credentials Display Card */}
        <div className="space-y-4 my-6 bg-[#5A3926]/20 p-4 rounded-xl border border-[#C6A477]/30">
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
              <span className="font-mono text-sm tracking-wider text-[#EFE4CF]">
                {showPassword ? restaurantConfig.wifiPassword : '••••••••••••'}
              </span>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-[#C6A477] hover:text-[#FFF1D1] transition-colors"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleCopyPassword}
            className="w-full py-3 rounded-full bg-[#C6A477] text-[#171411] font-sans font-bold text-xs tracking-widest uppercase hover:bg-[#FFF1D1] active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(198,164,119,0.3)]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>PASSWORD COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>COPY WI-FI PASSWORD</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
