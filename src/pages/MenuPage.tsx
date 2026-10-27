import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MenuCategory, MenuItem } from '../data/menuData';
import { supabase } from '../lib/supabase';
import { createClientId, getPageRestaurantSlug, getRestaurantId } from '../lib/restaurantCloud';
import { ParchmentCard } from '../components/common/ParchmentCard';
import { TribalDivider } from '../components/common/TribalDivider';
import { Search, Crown, X, Utensils, ArrowLeft, Flame, Sparkles, ChevronRight } from 'lucide-react';
import { AmbientCaveGlow } from '../components/common/AmbientCaveGlow';

interface MenuPageProps {
  onBackToHome: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onBackToHome }) => {
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuTitle, setMenuTitle] = useState('MENU');
  const [menuSubtitle, setMenuSubtitle] = useState('');
  const [menuFooterNote, setMenuFooterNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMaharajaOnly, setShowMaharajaOnly] = useState<boolean>(false);

  // Keep the live subscription independent from the menu fetch. Rebuilding the
  // channel after each event can race removeChannel() and reuse a subscribed topic.
  useEffect(() => {
    const client = supabase;
    if (!client) return;

    let current = true;
    let channel: ReturnType<typeof client.channel> | null = null;
    let debounceTimer: number | undefined;
    let fallbackTimer: number | undefined;

    const scheduleReload = () => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        if (current) setReloadKey((key) => key + 1);
      }, 250);
    };

    void getRestaurantId(getPageRestaurantSlug()).then((restaurantId) => {
      if (!current) return;
      // A unique topic also makes React StrictMode remounts safe while an old
      // channel is still being removed asynchronously.
      channel = client.channel(`customer-menu-${restaurantId}-${createClientId()}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurants', filter: `id=eq.${restaurantId}` }, scheduleReload)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_categories', filter: `restaurant_id=eq.${restaurantId}` }, scheduleReload)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items', filter: `restaurant_id=eq.${restaurantId}` }, scheduleReload)
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            if (fallbackTimer) window.clearInterval(fallbackTimer);
            fallbackTimer = undefined;
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            if (!fallbackTimer) fallbackTimer = window.setInterval(scheduleReload, 30_000);
          }
        });
    }).catch((error: unknown) => {
      console.error('Could not subscribe to live menu updates:', error);
      if (current && !fallbackTimer) fallbackTimer = window.setInterval(scheduleReload, 30_000);
    });

    return () => {
      current = false;
      if (debounceTimer) window.clearTimeout(debounceTimer);
      if (fallbackTimer) window.clearInterval(fallbackTimer);
      if (channel) void client.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;

    const loadMenu = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const client = supabase;
        if (!client) {
          throw new Error(
            'The menu is temporarily unavailable. Please contact the restaurant team.',
          );
        }

        const { data: restaurant, error: restaurantError } = await client
          .from('restaurants')
          .select('id, menu_title, menu_subtitle, menu_footer_note')
          .eq('slug', getPageRestaurantSlug())
          .maybeSingle();

        if (restaurantError) throw restaurantError;
        if (!restaurant) throw new Error('The Cave menu has not been published yet.');

        const [categoriesResult, itemsResult] = await Promise.all([
          client
            .from('menu_categories')
            .select('id, category_key, name, subtitle, image_url, sort_order')
            .eq('restaurant_id', restaurant.id)
            .eq('is_active', true)
            .order('sort_order'),
          client
            .from('menu_items')
            .select('source_id, category_id, name, description, price, is_vegetarian, is_maharaja_special, spiciness_level, tags, sort_order, image_url, portion_label, taste_note, is_popular, is_todays_special')
            .eq('restaurant_id', restaurant.id)
            .eq('is_available', true)
            .order('sort_order'),
        ]);

        if (categoriesResult.error || itemsResult.error) throw new Error('Menu data could not load.');

        const categories = categoriesResult.data ?? [];
        const categoriesById = new Map(categories.map((category) => [category.id, category]));
        const categoryOrder = new Map(categories.map((category, index) => [category.category_key, index]));
        const items = (itemsResult.data ?? [])
          .flatMap((item) => {
            const category = categoriesById.get(item.category_id);
            if (!category) return [];

            return [{
              id: item.source_id,
              name: item.name,
              description: item.description ?? '',
              price: Number(item.price),
              category: category.category_key,
              portionLabel: item.portion_label ?? undefined,
              tasteNote: item.taste_note ?? undefined,
              isVegetarian: item.is_vegetarian,
              isMaharajaSpecial: item.is_maharaja_special,
              isTodaysSpecial: item.is_todays_special ?? item.is_maharaja_special ?? false,
              spicinessLevel: item.spiciness_level ?? undefined,
              tags: item.tags ?? [],
              imageUrl: item.image_url ?? undefined,
              isPopular: item.is_popular ?? false,
              sortOrder: item.sort_order,
            }];
          })
          .sort((a, b) =>
            (categoryOrder.get(a.category) ?? 0) - (categoryOrder.get(b.category) ?? 0)
            || a.sortOrder - b.sortOrder,
          )
          .map(({ sortOrder: _sortOrder, ...item }) => item);

        if (isCurrent) {
          setMenuCategories(categories.map((category) => ({
            id: category.category_key,
            name: category.name,
            subtitle: category.subtitle ?? '',
            imageUrl: category.image_url ?? undefined,
          })));
          setMenuItems(items);
          setMenuTitle(restaurant.menu_title || 'MENU');
          setMenuSubtitle(restaurant.menu_subtitle ?? '');
          setMenuFooterNote(restaurant.menu_footer_note ?? '');
        }
      } catch {
        if (isCurrent) {
          setLoadError('Menu could not load right now. Please try again.');
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    void loadMenu();
    return () => {
      isCurrent = false;
    };
  }, [reloadKey]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesMaharaja = !showMaharajaOnly || item.isTodaysSpecial || item.isMaharajaSpecial;
      return matchesCategory && matchesSearch && matchesMaharaja;
    });
  }, [menuItems, selectedCategory, searchQuery, showMaharajaOnly]);

  const categoryLanding = selectedCategory === 'ALL' && !searchQuery.trim() && !showMaharajaOnly;
  const activeCategory = menuCategories.find((category) => category.id === selectedCategory);

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
            <span>{menuTitle}</span>
          </h1>
          <p className="font-serif italic text-xs text-[#FFF1D1]/80 mt-1">
            {menuSubtitle}
          </p>
          <div className="w-44 mx-auto my-1.5 opacity-80">
            <TribalDivider variant="minimal" />
          </div>
        </div>

        {/* Search & Today's Specials Filter Bar */}
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

          {/* Quick Toggle: Today's Specials Only */}
          <div className="flex items-center justify-between bg-[#191512]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#C6A477]/30">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-[#C6A477]" />
              <span className="text-xs font-sans font-bold text-[#EFE4CF]">Today's Specials Only</span>
            </div>
            <button
              onClick={() => setShowMaharajaOnly(!showMaharajaOnly)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                showMaharajaOnly ? 'bg-gradient-to-r from-[#8C5138] to-[#C6A477]' : 'bg-[#4A2E1D]/60'
              }`}
              aria-label="Filter today's specials"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                  showMaharajaOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {selectedCategory !== 'ALL' && (
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => handleCategorySelect('ALL')}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#C6A477]/35 bg-[#191512]/90 px-3.5 text-xs font-bold text-[#FFF1D1] transition hover:border-[#C6A477]"
            >
              <ArrowLeft className="h-4 w-4 text-[#C6A477]" /> All categories
            </button>
          </div>
        )}

        {categoryLanding && !isLoading && !loadError && (
          <section aria-label="Menu categories" className="mb-6">
            <div className="mb-3 px-1">
              <h2 className="font-display text-lg font-bold tracking-wide text-[#FFF1D1]">Explore by category</h2>
              <p className="mt-1 text-xs text-[#EFE4CF]/60">Choose a section to see its dishes and ingredients.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {menuCategories.map((category, index) => {
                const count = menuItems.filter((item) => item.category === category.id).length;
                return (
                  <motion.button
                    key={category.id}
                    type="button"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.045 }}
                    onClick={() => handleCategorySelect(category.id)}
                    aria-label={`${category.name}, ${count} dishes`}
                    className="group relative isolate flex min-h-36 items-end overflow-hidden rounded-2xl border border-[#C6A477]/35 text-left shadow-lg transition hover:-translate-y-0.5 hover:border-[#C6A477]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A477] sm:min-h-44"
                  >
                    {category.imageUrl && <img src={category.imageUrl} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#120F0D] via-[#120F0D]/35 to-black/5" />
                    <div className="w-full p-3 sm:p-4">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E7C58D]">{count} {count === 1 ? 'dish' : 'dishes'}</span>
                      <div className="mt-1 flex items-end justify-between gap-1">
                        <h3 className="font-display text-sm font-extrabold leading-tight text-white sm:text-base">{category.name}</h3>
                        <ChevronRight className="mb-0.5 h-4 w-4 shrink-0 text-[#E7C58D] transition group-hover:translate-x-1" />
                      </div>
                      <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-white/75">{category.subtitle}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>
        )}

        {!categoryLanding && activeCategory && (
          <div className="mb-4 rounded-2xl border border-[#C6A477]/25 bg-[#191512]/75 px-4 py-3">
            <div className="flex items-baseline gap-2">
              <h2 className="font-display text-xl font-bold text-[#FFF1D1]">{activeCategory.name}</h2>
            </div>
            <p className="mt-0.5 text-xs text-[#EFE4CF]/65">{activeCategory.subtitle}</p>
          </div>
        )}

        {/* Results Counter */}
        {!categoryLanding && <div className="flex items-center justify-between text-[11px] font-sans text-[#C6A477] mb-3 px-1">
          <span aria-live="polite">
            {isLoading ? 'Loading menu…' : loadError ? 'Menu unavailable' : `${filteredItems.length} dishes available`}
          </span>
          {showMaharajaOnly && (
            <span className="text-[#FFF1D1] font-semibold flex items-center space-x-1">
              <Crown className="w-3.5 h-3.5 text-[#C6A477]" />
              <span>Today's Specials</span>
            </span>
          )}
        </div>}

        {/* Main List of Dishes */}
        {categoryLanding && !isLoading && !loadError ? null : isLoading ? (
          <div className="text-center py-12 bg-[#191512]/90 backdrop-blur-md rounded-3xl border border-[#C6A477]/30 p-6 shadow-xl" role="status">
            <Utensils className="w-10 h-10 text-[#C6A477]/70 mx-auto mb-2 animate-pulse" />
            <p className="text-sm font-serif text-[#EFE4CF]/80">Loading the restaurant menu…</p>
          </div>
        ) : loadError ? (
          <div className="text-center py-10 bg-[#191512]/90 backdrop-blur-md rounded-3xl border border-[#C6A477]/30 p-6 shadow-xl" role="alert">
            <Utensils className="w-10 h-10 text-[#C6A477]/50 mx-auto mb-2" />
            <h3 className="font-serif text-lg font-bold text-[#FFF1D1]">Menu could not load</h3>
            <p className="text-xs font-sans text-[#EFE4CF]/65 mt-2">{loadError}</p>
            <button
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-4 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8C5138] to-[#C6A477] text-white font-sans font-extrabold text-xs uppercase shadow-md active:scale-95"
            >
              TRY AGAIN
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
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
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <ParchmentCard
                key={item.id}
                item={item}
                imageUrl={item.imageUrl}
              />
            ))}
          </div>
        )}

        {/* Bottom Menu Footer Note */}
        <div className="text-center mt-10 py-6 border-t border-[#C6A477]/30">
          {menuFooterNote && <p className="font-serif italic text-xs text-[#C6A477]/90">{menuFooterNote}</p>}
          <div className="w-24 mx-auto my-2 opacity-60">
            <TribalDivider variant="minimal" />
          </div>
        </div>
      </div>
    </div>
  );
};
