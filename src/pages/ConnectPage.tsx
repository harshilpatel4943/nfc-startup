import React, { useState } from 'react';
import { Wifi, Phone, MapPin, Star, MessageSquareHeart, Clock, Copy, Check, Eye, EyeOff, Navigation, Bell, ArrowLeft, ExternalLink } from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { TribalDivider } from '../components/common/TribalDivider';
import { getRestaurantConfig } from '../config/restaurantConfig';

interface ConnectPageProps {
  onBackToHome: () => void;
  onOpenFeedback: () => void;
  onOpenStaffModal: () => void;
  isServiceEnabled: (id: string) => boolean;
}

export const ConnectPage: React.FC<ConnectPageProps> = ({
  onBackToHome,
  onOpenFeedback,
  onOpenStaffModal,
  isServiceEnabled,
}) => {
  const restaurantConfig = getRestaurantConfig();
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(restaurantConfig.wifiPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReviewClick = () => {
    if (restaurantConfig.googleReviewUrl.includes('[CLIENT')) {
      alert('Client Google Review URL configuration placeholder active: ' + restaurantConfig.googleReviewUrl);
    } else {
      window.open(restaurantConfig.googleReviewUrl, '_blank');
    }
  };

  const handleInstagramClick = () => {
    if (restaurantConfig.instagramUrl.includes('[CLIENT')) {
      alert('Client Instagram URL configuration placeholder active: ' + restaurantConfig.instagramUrl);
    } else {
      window.open(restaurantConfig.instagramUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#120F0D] text-[#EFE4CF] pt-16 pb-28 px-3.5 sm:px-4 cave-dark-texture select-none">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#191512] border border-[#C6A477]/40 text-xs font-sans font-bold text-[#EFE4CF] hover:text-[#FFF1D1] active:scale-95 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C6A477]" />
            <span>HOME</span>
          </button>

          <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#C6A477] uppercase">
            GUEST SERVICES
          </span>
        </div>

        <div className="text-center mb-4">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-wider text-[#EFE4CF]">
            CONNECT TO THE CAVE
          </h1>
          <p className="font-serif italic text-xs text-[#FFF1D1]/80 mt-1">
            "In-restaurant guest utilities, contact & reviews"
          </p>
          <div className="w-36 mx-auto my-1">
            <TribalDivider variant="minimal" />
          </div>
        </div>

        {/* 1. In-Restaurant Guest Wi-Fi Card */}
        {isServiceEnabled('wifi') && <div className="rounded-2xl p-4 bg-gradient-to-b from-[#191512] to-[#14100D] border border-[#C6A477]/50 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#4A2E1D]/50 border border-[#C6A477]/40 text-[#C6A477] flex items-center justify-center">
                <Wifi className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-sans font-bold tracking-widest text-[#C6A477] uppercase block">
                  HIGH-SPEED INTERNET
                </span>
                <span className="font-sans font-extrabold text-sm text-[#FFF1D1]">
                  Complimentary Guest Wi-Fi
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-sans font-bold bg-[#C6A477]/20 text-[#C6A477] border border-[#C6A477]/30">
              Active
            </span>
          </div>

          <div className="bg-[#120F0D] p-3 rounded-xl border border-[#4A2E1D] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#EFE4CF]/60 font-sans">Network:</span>
              <span className="font-sans font-bold text-[#FFF1D1]">{restaurantConfig.wifiNetwork}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#4A2E1D]/40">
              <span className="text-[#EFE4CF]/60 font-sans">Password:</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs tracking-wider text-[#EFE4CF]">
                  {showPassword ? restaurantConfig.wifiPassword : '••••••••••••'}
                </span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#C6A477] hover:text-[#FFF1D1] p-0.5"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleCopyPassword}
            className="w-full min-h-[44px] py-2.5 rounded-xl bg-[#C6A477] text-[#120F0D] font-sans font-extrabold text-xs tracking-widest uppercase hover:bg-[#FFF1D1] active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-md"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>COPIED TO CLIPBOARD!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>COPY WI-FI PASSWORD</span>
              </>
            )}
          </button>
        </div>}

        {/* 2. Call Waiter / Table Service Quick Tile */}
        {isServiceEnabled('staff') && <button
          onClick={onOpenStaffModal}
          className="w-full min-h-[50px] p-3.5 rounded-2xl bg-[#8C5138]/20 border border-[#8C5138]/60 text-left flex items-center justify-between active:scale-95 transition-all shadow-md group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#8C5138]/40 border border-[#8C5138] text-[#FFF1D1] flex items-center justify-center">
              <Bell className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="font-sans font-extrabold text-xs text-[#FFF1D1] uppercase tracking-wider block">
                CALL TABLE SERVICE
              </span>
              <span className="text-[10px] font-sans text-[#EFE4CF]/70">
                Request Water Refill, Waiter, or Bill
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#C6A477] group-hover:translate-x-1 transition-transform">→</span>
        </button>}

        {/* 3. Google Reviews 5-Star Card */}
        {isServiceEnabled('reviews') && <div className="rounded-2xl p-4 bg-gradient-to-b from-[#191512] to-[#14100D] border border-[#C6A477]/40 shadow-xl space-y-2.5 text-center">
          <div className="flex items-center justify-center space-x-1 text-[#C6A477]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#C6A477] text-[#C6A477]" />
            ))}
          </div>
          <h2 className="font-serif text-lg font-bold text-[#FFF1D1]">
            Loved your time at The Cave?
          </h2>
          <p className="text-[11px] font-sans text-[#EFE4CF]/75 max-w-xs mx-auto leading-relaxed">
            Your review helps food enthusiasts discover authentic regional Indian dining.
          </p>
          <button
            onClick={handleReviewClick}
            className="w-full min-h-[44px] py-2.5 rounded-xl bg-gradient-to-r from-[#C6A477] to-[#DFBF8E] text-[#120F0D] font-sans font-extrabold text-xs tracking-wider uppercase active:scale-95 transition-all flex items-center justify-center space-x-1.5 shadow-md"
          >
            <span>LEAVE A 5-STAR GOOGLE REVIEW</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#120F0D]" />
          </button>
        </div>}

        {/* 4. Instagram & Private Feedback Row */}
        {(isServiceEnabled('instagram') || isServiceEnabled('feedback')) && <div className={'grid gap-2.5 ' + (isServiceEnabled('instagram') && isServiceEnabled('feedback') ? 'grid-cols-2' : 'grid-cols-1')}>
          {isServiceEnabled('instagram') && <>
          <button
            onClick={handleInstagramClick}
            className="min-h-[52px] p-3 rounded-xl bg-[#191512] border border-[#4A2E1D] hover:border-[#C6A477]/60 active:scale-95 transition-all text-left flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <InstagramIcon className="w-4 h-4 text-[#C6A477]" />
              <ExternalLink className="w-3 h-3 text-[#C6A477]/60" />
            </div>
            <div>
              <span className="font-sans font-bold text-xs text-[#EFE4CF] uppercase block">
                INSTAGRAM
              </span>
              <span className="text-[10px] font-sans text-[#EFE4CF]/60">
                Follow Journey
              </span>
            </div>
          </button>
          </>}

          {isServiceEnabled('feedback') && <>
          <button
            onClick={onOpenFeedback}
            className="min-h-[52px] p-3 rounded-xl bg-[#191512] border border-[#4A2E1D] hover:border-[#C6A477]/60 active:scale-95 transition-all text-left flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <MessageSquareHeart className="w-4 h-4 text-[#C6A477]" />
              <span className="text-[10px] text-[#C6A477]/60 font-bold">→</span>
            </div>
            <div>
              <span className="font-sans font-bold text-xs text-[#EFE4CF] uppercase block">
                FEEDBACK
              </span>
              <span className="text-[10px] font-sans text-[#EFE4CF]/60">
                Private Review
              </span>
            </div>
          </button>
          </>}
        </div>}

        {/* 5. Restaurant Location & Hours */}
        {isServiceEnabled('contact') && <div className="rounded-2xl p-4 bg-[#191512] border border-[#4A2E1D] shadow-lg space-y-3">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-[#120F0D] border border-[#C6A477]/30 text-[#C6A477]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-sans font-bold tracking-widest text-[#C6A477] uppercase block">
                LOCATION & ADDRESS
              </span>
              <p className="font-sans font-bold text-xs text-[#FFF1D1] mt-0.5">
                {restaurantConfig.address}
              </p>
              <p className="text-[11px] text-[#EFE4CF]/70 font-sans">
                {restaurantConfig.city}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-2.5 border-t border-[#4A2E1D]/50">
            <div className="p-2 rounded-xl bg-[#120F0D] border border-[#C6A477]/30 text-[#C6A477]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-sans font-bold tracking-widest text-[#C6A477] uppercase block">
                SERVICE HOURS
              </span>
              <p className="font-sans text-[11px] text-[#EFE4CF] mt-0.5">
                {restaurantConfig.openingHours.days}
              </p>
              <p className="font-sans text-[11px] text-[#FFF1D1] font-semibold">
                Lunch: {restaurantConfig.openingHours.lunch} • Dinner: {restaurantConfig.openingHours.dinner}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <a
              href={restaurantConfig.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] py-2 px-3 rounded-xl bg-[#C6A477] text-[#120F0D] font-sans font-extrabold text-[11px] tracking-wider uppercase flex items-center justify-center space-x-1.5 active:scale-95 shadow-md"
            >
              <Navigation className="w-3.5 h-3.5 fill-current" />
              <span>DIRECTIONS</span>
            </a>

            <a
              href={`tel:${restaurantConfig.phone}`}
              className="min-h-[44px] py-2 px-3 rounded-xl bg-[#120F0D] border border-[#C6A477]/40 text-[#FFF1D1] font-sans font-bold text-[11px] tracking-wider uppercase flex items-center justify-center space-x-1.5 active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-[#C6A477]" />
              <span>CALL NOW</span>
            </a>
          </div>
        </div>}
      </div>
    </div>
  );
};
