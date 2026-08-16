import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const POPULAR_TAGS = ['Toghu', 'Kaba Ngondo', 'Ndop', 'Bridal', 'Boubou', 'Ankara', 'Loafers', 'Velvet'];

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, products, formatPrice } = useStore();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.regionOrigin && p.regionOrigin.toLowerCase().includes(q)) ||
        (p.fabricType && p.fabricType.toLowerCase().includes(q)) ||
        p.seller.location.toLowerCase().includes(q)
    );
  }, [query, products]);

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-16 md:pt-24">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-brand-bg rounded-2xl shadow-2xl border border-brand-primary/15 overflow-hidden z-10"
        >
          {/* Search Header */}
          <div className="p-4 md:p-6 border-b border-brand-primary/10 flex items-center space-x-3 bg-white">
            <Search className="text-brand-accent flex-shrink-0" size={24} />
            <input
              type="text"
              autoFocus
              placeholder="Search Toghu, Kaba, Ankara gown, Bamenda velvet, loafers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-lg font-serif placeholder:font-sans placeholder:text-sm placeholder:opacity-40 focus:outline-none text-brand-primary"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-brand-primary/40 hover:text-brand-primary p-1"
              >
                <X size={18} />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-xs uppercase tracking-widest font-bold text-brand-primary/60 hover:text-brand-primary pl-2 border-l border-brand-primary/15"
            >
              Esc
            </button>
          </div>

          {/* Quick Filter Tags */}
          <div className="px-6 py-3 bg-brand-primary/5 border-b border-brand-primary/5 flex items-center space-x-2 overflow-x-auto text-xs">
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40 flex items-center">
              <Tag size={10} className="mr-1" /> Quick:
            </span>
            {POPULAR_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 rounded-full bg-white border border-brand-primary/10 hover:border-brand-accent hover:text-brand-accent text-[11px] whitespace-nowrap transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="p-4 md:p-6 max-h-[60vh] overflow-y-auto">
            {query.trim() === '' ? (
              <div className="text-center py-8 space-y-2 opacity-50">
                <p className="font-serif text-lg">Type any keyword, region, or dressing style</p>
                <p className="text-xs">Try searching by "Bamenda", "Toghu", "Silk", "Bridal", or "Loafers"</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <p className="font-serif text-2xl text-brand-primary">No dressings found for "{query}"</p>
                <p className="text-xs opacity-60">Try searching for other terms or browse our full catalog.</p>
                <Link
                  to="/shop"
                  onClick={() => setIsSearchOpen(false)}
                  className="inline-block mt-3 text-xs uppercase tracking-widest font-bold text-brand-accent hover:underline"
                >
                  View All Products &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/50">
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                </p>
                {searchResults.map(product => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center space-x-4 p-3 rounded-xl bg-white hover:bg-brand-accent/5 border border-brand-primary/10 hover:border-brand-accent/30 transition-all group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] uppercase tracking-widest font-bold text-brand-accent">
                          {product.category}
                        </span>
                        <span className="text-[9px] text-brand-primary/40">
                          • {product.condition}
                        </span>
                      </div>
                      <h4 className="font-serif font-semibold text-brand-primary truncate group-hover:text-brand-accent transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs font-semibold text-brand-primary">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <div className="flex items-center text-xs text-brand-primary/40 group-hover:text-brand-accent group-hover:translate-x-1 transition-all">
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
