import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuCategories, menuItems } from '../data/menuData';
import { ParchmentCard } from '../components/common/ParchmentCard';
import { TribalDivider } from '../components/common/TribalDivider';
import { Search, Crown, X, Utensils, ArrowLeft, Flame, Sparkles } from 'lucide-react';
import { AmbientCaveGlow } from '../components/common/AmbientCaveGlow';

interface MenuPageProps {
  onBackToHome: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onBackToHome }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMaharajaOnly, setShowMaharajaOnly] = useState<boolean>(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesMaharaja = !showMaharajaOnly || item.isMaharajaSpecial;
      return matchesCategory && matchesSearch && matchesMaharaja;
    });
  }, [selectedCategory, searchQuery, showMaharajaOnly]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-[#120F0D] text-[#EFE4CF] pt-16 pb-28 px-3.5 sm:px-4 select-none relative overflow-x-hidden">
      {/* Flaming Balls & Subterranean Firelight Aura Background Effect */}
      <AmbientCaveGlow isDarkMode={true} />

      <div className="max-w-md mx-auto relative z-10">
        {/* Top Mobile Navigation Bar with Back Button */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#191512]/90 border border-[#C6A477]/40 text-xs font-sans font-bold text-[#EFE4CF] shadow-lg hover:border-[#C6A477] transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#C6A477]" />
            <span>HOME</span>
          </motion.button>

          <span className="text-[10px] font-sans font-extrabold tracking-[0.25em] text-[#C6A477] uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FF9500]" /> PARCHMENT MENU
          </span>
        </div>

        {/* Menu Header Title */}
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-wider text-[#EFE4CF] flex items-center justify-center space-x-2 drop-shadow-md">
            <Flame className="w-6 h-6 text-[#C6A477] animate-pulse" />
            <span>THE CAVE MENU</span>
          </h1>
          <p className="font-serif italic text-xs text-[#FFF1D1]/80 mt-1">
            "Authentic regional flavours crafted in ancient subterranean warmth"
          </p>
          <div className="w-44 mx-auto my-1.5 opacity-80">
            <TribalDivider variant="minimal" />
          </div>
        </div>

        {/* Search & Maharaja Filter Bar */}
        <div className="space-y-2.5 mb-5">
          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#C6A477] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search paneer, biryani, thandai, starters..."
              className="w-full pl-10 pr-9 py-3 rounded-2xl bg-[#191512]/90 backdrop-blur-md border border-[#C6A477]/30 text-xs text-[#EFE4CF] placeholder-[#C6A477]/50 focus:outline-none focus:border-[#C6A477] transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C6A477] p-1"
                aria-label="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Toggle: Maharaja Specials Only */}
          <div className="flex items-center justify-between bg-[#191512]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#C6A477]/30">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-[#C6A477]" />
              <span className="text-xs font-sans font-bold text-[#EFE4CF]">Maharaja Specials Only</span>
            </div>
            <button
              onClick={() => setShowMaharajaOnly(!showMaharajaOnly)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                showMaharajaOnly ? 'bg-gradient-to-r from-[#8C5138] to-[#C6A477]' : 'bg-[#4A2E1D]/60'
              }`}
              aria-label="Filter Maharaja Specials"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                  showMaharajaOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Sticky Mobile Horizontally Scrollable Category Pill Navigation */}
        <div 
          ref={categoryScrollRef}
          className="sticky top-14 z-30 bg-[#120F0D]/95 backdrop-blur-xl py-3 -mx-3.5 px-3.5 border-y border-[#C6A477]/30 mb-5 overflow-x-auto no-scrollbar scroll-smooth"
        >
          <div className="flex items-center space-x-2.5 w-max pr-4">
            <button
              onClick={() => handleCategorySelect('ALL')}
              className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-sans font-extrabold tracking-wider uppercase whitespace-nowrap transition-all duration-200 active:scale-95 ${
                selectedCategory === 'ALL'
                  ? 'bg-gradient-to-r from-[#8C5138] to-[#C6A477] text-white shadow-[0_0_15px_rgba(198,164,119,0.5)] border border-[#C6A477]'
                  : 'bg-[#191512] text-[#EFE4CF]/80 border border-[#C6A477]/30 hover:text-[#FFF1D1]'
              }`}
            >
              ALL DISHES ({menuItems.length})
            </button>
            {menuCategories.map((cat) => {
              const count = menuItems.filter((i) => i.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-sans font-extrabold tracking-wider uppercase whitespace-nowrap transition-all duration-200 active:scale-95 ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-[#8C5138] to-[#C6A477] text-white shadow-[0_0_15px_rgba(198,164,119,0.5)] border border-[#C6A477]'
                      : 'bg-[#191512] text-[#EFE4CF]/80 border border-[#C6A477]/30 hover:text-[#FFF1D1]'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Header Banner */}
        {selectedCategory !== 'ALL' && (
          <div className="mb-4 pb-2 border-b border-[#C6A477]/30">
            {menuCategories
              .filter((c) => c.id === selectedCategory)
              .map((c) => (
                <div key={c.id}>
                  <div className="flex items-baseline space-x-2">
                    <h2 className="font-display text-xl font-bold text-[#FFF1D1]">{c.name}</h2>
                    {c.titleHindi && <span className="text-xs font-serif text-[#C6A477]">{c.titleHindi}</span>}
                  </div>
                  <p className="text-xs font-sans text-[#EFE4CF]/65 mt-0.5">{c.subtitle}</p>
                </div>
              ))}
          </div>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between text-[11px] font-sans text-[#C6A477] mb-3 px-1">
          <span>{filteredItems.length} dishes available</span>
          {showMaharajaOnly && (
            <span className="text-[#FFF1D1] font-semibold flex items-center space-x-1">
              <Crown className="w-3.5 h-3.5 text-[#C6A477]" />
              <span>Maharaja Curated</span>
            </span>
          )}
        </div>

        {/* Main List of Dishes */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-[#191512]/90 backdrop-blur-md rounded-3xl border border-[#C6A477]/30 p-6 shadow-xl">
            <Utensils className="w-10 h-10 text-[#C6A477]/50 mx-auto mb-2" />
            <h3 className="font-serif text-lg font-bold text-[#FFF1D1]">No Dishes Found</h3>
            <p className="text-xs font-sans text-[#EFE4CF]/60 mt-1 max-w-xs mx-auto">
              We couldn't find any dishes matching "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setShowMaharajaOnly(false);
              }}
              className="mt-4 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8C5138] to-[#C6A477] text-white font-sans font-extrabold text-xs uppercase shadow-md active:scale-95"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <ParchmentCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Bottom Menu Footer Note */}
        <div className="text-center mt-10 py-6 border-t border-[#C6A477]/30">
          <p className="font-serif italic text-xs text-[#C6A477]/90">
            All prices are in Indian Rupees (₹). Taxes applicable as per government guidelines.
          </p>
          <div className="w-24 mx-auto my-2 opacity-60">
            <TribalDivider variant="minimal" />
          </div>
        </div>
      </div>
    </div>
  );
};
