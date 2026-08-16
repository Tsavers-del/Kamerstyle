import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Search, Heart, MessageCircle, MapPin, X, RotateCcw, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category, Condition } from '../types';
import RecentlyViewed from '../components/RecentlyViewed';

const CATEGORIES: Category[] = [
  'All',
  'Traditional',
  'Modern',
  'Bridal',
  'Bespoke Men',
  'Accessories',
  'Shoes'
];

const REGIONS = ['All', 'North West (Bamenda)', 'Littoral (Douala)', 'West (Bamileke)', 'Far North (Maroua)', 'Centre (Yaoundé)'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, formatPrice, isWishlisted, toggleWishlist, contactInfo } = useStore();

  const initialCat = (searchParams.get('cat') as Category) || 'All';
  const initialRegion = searchParams.get('region') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCat);
  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion);
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<'Featured' | 'PriceLow' | 'PriceHigh'>('Featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state if URL query param changes
  useEffect(() => {
    const cat = searchParams.get('cat') as Category;
    if (cat && CATEGORIES.includes(cat)) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedRegion !== 'All') {
      const regKeyword = selectedRegion.split(' ')[0].toLowerCase();
      result = result.filter(
        p =>
          (p.regionOrigin && p.regionOrigin.toLowerCase().includes(regKeyword)) ||
          p.seller.location.toLowerCase().includes(regKeyword)
      );
    }

    if (selectedCondition !== 'All') {
      result = result.filter(p => p.condition === selectedCondition);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.fabricType && p.fabricType.toLowerCase().includes(q)) ||
          p.seller.location.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'PriceLow') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'PriceHigh') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, selectedRegion, selectedCondition, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedRegion('All');
    setSelectedCondition('All');
    setSearchQuery('');
    setSortBy('Featured');
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedRegion !== 'All' || selectedCondition !== 'All' || searchQuery !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Shop Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-bold">Cameroonian Fashion Marketplace</span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-brand-primary">
          All Dressing Collections
        </h1>
        <p className="text-xs sm:text-sm text-brand-primary/60 max-w-xl mx-auto">
          Explore handmade Toghu, indigo Ndop, Sawa Kaba robes, modern Ankara evening gowns, and bespoke royal slippers.
        </p>
      </div>

      {/* Category Tabs Strip */}
      <div className="flex items-center justify-start md:justify-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              if (cat === 'All') {
                searchParams.delete('cat');
              } else {
                searchParams.set('cat', cat);
              }
              setSearchParams(searchParams);
            }}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand-primary text-brand-bg shadow-md scale-105'
                : 'bg-white border border-brand-primary/10 text-brand-primary/70 hover:border-brand-accent hover:text-brand-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Control Bar: Search, Filters & Sorting */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-brand-primary/10 shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-primary/40" size={18} />
          <input
            type="text"
            placeholder="Search by name, fabric (velvet, silk, cotton), or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-bg/50 border border-brand-primary/10 rounded-xl pl-10 pr-8 py-2.5 text-xs text-brand-primary focus:outline-none focus:border-brand-accent transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Region & Condition Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-brand-bg/50 border border-brand-primary/10 rounded-xl px-3 py-2.5 text-xs text-brand-primary focus:outline-none font-sans"
          >
            <option value="All">All Regions</option>
            <option value="North West">North West (Bamenda)</option>
            <option value="Littoral">Littoral (Douala/Limbe)</option>
            <option value="West">West (Bamileke/Bamum)</option>
            <option value="Far North">Far North (Maroua/Garoua)</option>
            <option value="Centre">Centre (Yaoundé)</option>
          </select>

          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="bg-brand-bg/50 border border-brand-primary/10 rounded-xl px-3 py-2.5 text-xs text-brand-primary focus:outline-none font-sans"
          >
            <option value="All">All Conditions</option>
            <option value="Tailor Made">Tailor Made</option>
            <option value="New">Brand New</option>
            <option value="Like New">Like New</option>
            <option value="Gently Used">Gently Used</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-brand-bg/50 border border-brand-primary/10 rounded-xl px-3 py-2.5 text-xs text-brand-primary focus:outline-none font-sans font-bold"
          >
            <option value="Featured">Sort: Featured</option>
            <option value="PriceLow">Price: Low to High</option>
            <option value="PriceHigh">Price: High to Low</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Status */}
      <div className="flex justify-between items-center text-xs text-brand-primary/60 px-1">
        <span>Showing <strong className="text-brand-primary">{filteredProducts.length}</strong> dressings in Cameroon</span>
        <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold">
          ⚡ Escrow Protected Purchase
        </span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center space-y-4 border border-brand-primary/10">
          <p className="font-serif text-3xl text-brand-primary italic">No dressings matched your criteria</p>
          <p className="text-xs text-brand-primary/60 max-w-sm mx-auto">
            Try adjusting your search terms, changing the region filter, or resetting all filters.
          </p>
          <button
            onClick={clearFilters}
            className="bg-brand-primary text-brand-bg px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-accent hover:text-brand-primary transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const wish = isWishlisted(product.id);
              return (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-brand-primary/10 hover:border-brand-accent/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image & Badges */}
                    <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                      <Link to={`/product/${product.id}`} className="block w-full h-full">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </Link>

                      {/* Wishlist Heart Toggle */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product.id);
                        }}
                        className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                          wish
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-brand-primary hover:text-red-500 hover:scale-110'
                        }`}
                        title={wish ? 'Remove from wishlist' : 'Save to wishlist'}
                      >
                        <Heart size={15} className={wish ? 'fill-white' : ''} />
                      </button>

                      {/* Condition Badge */}
                      <span className="absolute top-3.5 left-3.5 bg-brand-primary text-white text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded shadow-sm">
                        {product.condition}
                      </span>

                      {/* Region Tag */}
                      {product.regionOrigin && (
                        <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur text-white px-2 py-0.5 text-[9px] uppercase tracking-wider rounded flex items-center space-x-1">
                          <MapPin size={9} className="text-brand-accent" />
                          <span>{product.regionOrigin.split('(')[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="p-4 space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                        <span className="text-brand-accent font-bold">{product.category}</span>
                        <span className="text-brand-primary/50 truncate max-w-[120px]">
                          {product.seller.location.split(',')[0]}
                        </span>
                      </div>

                      <Link to={`/product/${product.id}`} className="block">
                        <h3 className="text-base font-serif font-bold text-brand-primary group-hover:text-brand-accent transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-brand-primary/60 line-clamp-2 font-light">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-brand-primary/40 block">Price</span>
                      <span className="text-base font-bold text-brand-primary">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <a
                      href={contactInfo.whatsappUrl(
                        `Hello! I am interested in buying "${product.name}" (${formatPrice(product.price)}) on KamerStyle.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 bg-brand-primary text-brand-bg hover:bg-brand-accent hover:text-brand-primary px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-wider font-bold transition-all shadow-xs"
                    >
                      <MessageCircle size={13} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Recently Viewed Shelf */}
      <RecentlyViewed />
    </div>
  );
}
