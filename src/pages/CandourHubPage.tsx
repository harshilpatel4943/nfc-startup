import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, BookOpen, Wifi, MessageSquare, Grid, ArrowUpRight, X, Star, 
  MapPin, Clock, Phone, Bell, Droplet, Receipt, CheckCircle2, Flame, Sparkles, ChevronRight
} from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { restaurantConfig } from '../config/restaurantConfig';

interface CandourHubPageProps {
  onOpenLoyalty: () => void;
  onOpenReviews: () => void;
  onOpenMenu: () => void;
  onOpenWifi: () => void;
  onOpenFeedback: () => void;
  onOpenSudoku: () => void;
  onOpenInstagram: () => void;
}

interface MenuPreviewItem {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  badge?: string;
}

const FEATURED_ITEMS: MenuPreviewItem[] = [
  {
    id: 'f1',
    name: 'Maharaja Paneer Tikka',
    price: '₹380',
    category: 'Starters',
    image: '/assets/cave-interior-1.jpg',
    badge: 'Popular',
  },
  {
    id: 'f2',
    name: 'Subterranean Dal Makhani',
    price: '₹420',
    category: 'Mains',
    image: '/assets/cave-interior-2.jpg',
    badge: 'House Specialty',
  },
  {
    id: 'f3',
    name: 'Ancient Firewood Biryani',
    price: '₹490',
    category: 'Mains',
    image: '/assets/cave-interior-1.jpg',
    badge: 'Chef Favorite',
  },
  {
    id: 'f4',
    name: 'Kesari Thandai Elixir',
    price: '₹220',
    category: 'Elixirs',
    image: '/assets/cave-interior-2.jpg',
  },
];

export const CandourHubPage: React.FC<CandourHubPageProps> = ({
  onOpenLoyalty,
  onOpenReviews,
  onOpenMenu,
  onOpenWifi,
  onOpenFeedback,
  onOpenSudoku,
  onOpenInstagram,
}) => {
  const [showClipBanner, setShowClipBanner] = useState<boolean>(true);
  const [showStaffDrawer, setShowStaffDrawer] = useState<boolean>(false);
  const [staffSuccessMsg, setStaffSuccessMsg] = useState<string | null>(null);

  const handleStaffRequest = (requestName: string) => {
    setStaffSuccessMsg(requestName);
    setTimeout(() => {
      setStaffSuccessMsg(null);
      setShowStaffDrawer(false);
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#F2F2F7] text-[#1C1C1E] font-sans flex flex-col justify-between select-none relative overflow-x-hidden pb-24">
      {/* 1. iOS NFC Tap Welcome Banner */}
      <AnimatePresence>
        {showClipBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            className="fixed top-2 inset-x-2 z-50 max-w-md mx-auto bg-white/95 backdrop-blur-2xl rounded-2xl p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-black/10 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#8C5138] to-[#C6A477] flex items-center justify-center text-[#FFF1D1] shadow-md shadow-[#8C5138]/30">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-gray-500">Welcome to</span>
                  <span className="text-[11px] font-extrabold text-black uppercase tracking-wider">{restaurantConfig.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
                </div>
                <h4 className="text-xs font-bold text-black leading-snug">Instant NFC Table Dining Experience</h4>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setShowClipBanner(false);
                  onOpenMenu();
                }}
                className="px-4 py-1.5 rounded-full bg-[#8C5138] text-white text-xs font-bold shadow-md shadow-[#8C5138]/30 hover:bg-[#4A2E1D] active:scale-95 transition-all"
              >
                View Menu
              </button>
              <button
                onClick={() => setShowClipBanner(false)}
                className="p-1 rounded-full text-gray-400 hover:text-black transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full">
        {/* 2. Top Header Storefront Photo */}
        <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-black">
          <img
            src="/assets/barlow-cover.jpg"
            alt="Venue Cover"
            className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.1]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/cave-interior-1.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/30" />

          {/* Top Floating Badges */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#34C759] animate-ping" />
              OPEN NOW
            </span>
          </div>
        </div>

        {/* 3. Overlapping Logo Avatar & Venue Header */}
        <div className="px-5 -mt-12 relative z-10">
          <div className="flex items-end justify-between">
            {/* Round Venue Logo Avatar */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 rounded-full bg-[#120F0D] p-1 shadow-2xl border-4 border-white overflow-hidden flex items-center justify-center relative group"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8C5138] to-[#4A2E1D] flex items-center justify-center text-[#FFF1D1] font-bold text-center text-xs p-1 border-2 border-[#C6A477]/60 shadow-inner">
                <span className="font-display font-extrabold uppercase tracking-tighter leading-tight text-center">
                  THE<br />CAVE
                </span>
              </div>
            </motion.div>

            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[11px] font-bold text-gray-700 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-gray-200 shadow-sm flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#8C5138]" /> {restaurantConfig.city.split(',')[0]}
              </span>
              <span className="text-[11px] font-bold text-gray-700 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-gray-200 shadow-sm flex items-center gap-1">
                <Star className="w-3 h-3 fill-[#FF9500] text-[#FF9500]" /> 4.9 (1.2k)
              </span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#1C1C1E] tracking-tight">
                {restaurantConfig.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#8C5138]/10 text-[#8C5138] text-[10px] font-extrabold">Verified NFC Table</span>
            </div>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              {restaurantConfig.tagline}
            </p>
          </div>
        </div>

        {/* 4. Instant Action Cards Vertical Stack (Tapping Menu opens Menu page) */}
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9500]" /> INSTANT GUEST UTILITIES
            </span>
            <span className="text-[11px] text-gray-400 font-medium">1-Tap NFC Access</span>
          </div>

          <div className="space-y-2.5">
            {/* Card 1: Start Earning Rewards */}
            <motion.button
              whileHover={{ scale: 1.015, x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenLoyalty}
              className="w-full p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between text-left group transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-[#FFEFF2] flex items-center justify-center text-[#FF2D55] shrink-0 shadow-sm">
                  <Heart className="w-5 h-5 fill-[#FF2D55]" />
                </div>
                <div>
                  <span className="font-bold text-base text-[#1C1C1E] block leading-snug">
                    Start earning rewards
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Collect 9 stamps for a free dining item</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
            </motion.button>

            {/* Card 2: Leave a Google Review */}
            <motion.button
              whileHover={{ scale: 1.015, x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenReviews}
              className="w-full p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between text-left group transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-[#F2F2F7] flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-base text-[#1C1C1E] block leading-snug">
                    Leave a Google Review
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Rate us ★★★★★ on Google</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
            </motion.button>

            {/* Card 3: View Menu (Fix: Triggers Full Interactive Menu Page) */}
            <motion.button
              whileHover={{ scale: 1.015, x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenMenu}
              className="w-full p-3.5 rounded-2xl bg-[#FFF9F2] border border-[#C6A477]/40 shadow-[0_2px_12px_rgba(198,164,119,0.12)] flex items-center justify-between text-left group transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-[#FFF4E5] flex items-center justify-center text-[#FF9500] shrink-0 shadow-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-base text-[#1C1C1E] leading-snug">
                      View Menu
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#8C5138] text-white">
                      Interactive
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Full Parchment Menu & Pricing</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#8C5138] group-hover:translate-x-0.5 transition-all" />
            </motion.button>

            {/* Card 4: Connect to Wi-Fi */}
            <motion.button
              whileHover={{ scale: 1.015, x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenWifi}
              className="w-full p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between text-left group transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-[#E8F8F0] flex items-center justify-center text-[#34C759] shrink-0 shadow-sm">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-base text-[#1C1C1E] block leading-snug">
                    Connect to Wi-Fi
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Auto-copy high-speed guest password</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
            </motion.button>

            {/* Card 5: Leave Anonymous Feedback */}
            <motion.button
              whileHover={{ scale: 1.015, x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenFeedback}
              className="w-full p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between text-left group transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-[#EBF5FF] flex items-center justify-center text-[#007AFF] shrink-0 shadow-sm">
                  <MessageSquare className="w-5 h-5 fill-[#007AFF]/20" />
                </div>
                <div>
                  <span className="font-bold text-base text-[#1C1C1E] block leading-snug">
                    Leave Anonymous Feedback
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Private 100% anonymous guest thoughts</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
            </motion.button>

            {/* Card 6: Play Sudoku */}
            <motion.button
              whileHover={{ scale: 1.015, x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenSudoku}
              className="w-full p-3.5 rounded-2xl bg-white border border-[#E5E5EA] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between text-left group transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-[#F5F0FF] flex items-center justify-center text-[#5856D6] shrink-0 shadow-sm">
                  <Grid className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-base text-[#1C1C1E] block leading-snug">
                    Play Sudoku
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Fun table game while waiting</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
            </motion.button>
          </div>
        </div>

        {/* 5. Popular Dishes Horizontal Snap Carousel */}
        <div className="mt-8 px-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#FF2D55]" /> POPULAR DISHES
            </span>
            <button onClick={onOpenMenu} className="text-xs font-bold text-[#8C5138] hover:underline flex items-center">
              Full Menu <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 snap-x snap-mandatory">
            {FEATURED_ITEMS.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={onOpenMenu}
                className="w-44 shrink-0 rounded-2xl bg-white border border-gray-200/80 p-3 shadow-md snap-start cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2.5 bg-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    {item.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[9px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h5 className="font-bold text-xs text-[#1C1C1E] line-clamp-1">{item.name}</h5>
                  <span className="text-[10px] text-gray-400 font-medium">{item.category}</span>
                </div>
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100">
                  <span className="font-extrabold text-xs text-[#1C1C1E]">{item.price}</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#8C5138] text-white text-[10px] font-bold shadow-sm">View</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 6. Social & Contact Section */}
        <div className="mt-8 px-4 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            {/* Instagram */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onOpenInstagram}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFDC80] via-[#F56040] to-[#C13584] text-white flex items-center justify-center shadow-lg shadow-[#F56040]/20"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-gray-500 font-medium pt-2">
            <Flame className="w-3.5 h-3.5 text-[#8C5138]" />
            <span className="font-extrabold text-black tracking-tight">{restaurantConfig.name}</span>
          </div>
        </div>
      </main>

      {/* 7. Floating Table Service Action Bar */}
      <div className="fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/90 backdrop-blur-xl rounded-2xl p-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.3)] border border-white/10 flex items-center justify-between text-white"
        >
          <div className="flex items-center space-x-2 pl-2">
            <div className="w-2 h-2 rounded-full bg-[#34C759] animate-ping" />
            <span className="text-xs font-bold tracking-wider">TABLE #12</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStaffDrawer(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8C5138] to-[#C6A477] text-white font-extrabold text-xs shadow-md shadow-[#8C5138]/20 flex items-center space-x-1.5"
          >
            <Bell className="w-4 h-4 animate-bounce" />
            <span>Call Waiter</span>
          </motion.button>
        </motion.div>
      </div>

      {/* 8. Table Assistance Modal Drawer */}
      <AnimatePresence>
        {showStaffDrawer && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-3">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative border border-gray-100"
            >
              <button
                onClick={() => setShowStaffDrawer(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>

              {staffSuccessMsg ? (
                <div className="py-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-[#34C759] mx-auto mb-2 animate-bounce" />
                  <h4 className="text-base font-bold text-black">Request Sent!</h4>
                  <p className="text-xs text-gray-500 mt-1">Our staff has been notified: <span className="font-bold text-black">{staffSuccessMsg}</span></p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-2.5 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#8C5138]/10 text-[#8C5138] flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-black">Table Assistance</h4>
                      <p className="text-xs text-gray-400 font-medium">Request instant service for Table #12</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => handleStaffRequest('Water Refill')}
                      className="w-full p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60 flex items-center space-x-3 text-left transition-all active:scale-95"
                    >
                      <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                        <Droplet className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-black block">Request Water</span>
                        <span className="text-[10px] text-gray-400">Fresh table water refilled</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleStaffRequest('Call Waiter')}
                      className="w-full p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60 flex items-center space-x-3 text-left transition-all active:scale-95"
                    >
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-black block">Call Waiter</span>
                        <span className="text-[10px] text-gray-400">Assistance with ordering or questions</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleStaffRequest('Request Bill')}
                      className="w-full p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60 flex items-center space-x-3 text-left transition-all active:scale-95"
                    >
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-black block">Request Bill</span>
                        <span className="text-[10px] text-gray-400">Print & bring dining receipt</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
