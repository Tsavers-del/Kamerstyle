import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Heart, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

interface RecentlyViewedProps {
  currentProductId?: string;
  title?: string;
  subtitle?: string;
}

export default function RecentlyViewed({
  currentProductId,
  title = "Recently Viewed Dressings",
  subtitle = "Items you've browsed during this shopping session"
}: RecentlyViewedProps) {
  const { recentlyViewedProducts, formatPrice, isWishlisted, toggleWishlist } = useStore();

  const items = recentlyViewedProducts.filter(p => p.id !== currentProductId);

  if (items.length === 0) return null;

  return (
    <div className="py-12 border-t border-brand-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-brand-accent">
              <Clock size={16} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Shopping History</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-brand-primary">{title}</h2>
            <p className="text-xs text-brand-primary/60">{subtitle}</p>
          </div>
          <Link
            to="/shop"
            className="text-[11px] uppercase tracking-widest font-bold text-brand-primary hover:text-brand-accent transition-colors flex items-center space-x-1"
          >
            <span>Explore More</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {items.slice(0, 5).map((product) => {
            const wish = isWishlisted(product.id);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white rounded-xl overflow-hidden border border-brand-primary/10 hover:border-brand-accent/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                      wish
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-brand-primary hover:text-red-500'
                    }`}
                    title={wish ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart size={14} className={wish ? 'fill-white' : ''} />
                  </button>
                  <span className="absolute bottom-2 left-2 text-[9px] uppercase tracking-widest bg-brand-primary/80 text-white px-2 py-0.5 rounded font-sans font-bold">
                    {product.condition}
                  </span>
                </div>

                <div className="p-3 space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-brand-accent font-bold">
                    {product.category}
                  </span>
                  <Link
                    to={`/product/${product.id}`}
                    className="block font-serif text-sm font-semibold text-brand-primary truncate group-hover:text-brand-accent transition-colors"
                  >
                    {product.name}
                  </Link>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs font-bold text-brand-primary">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-[10px] text-brand-primary/50 truncate max-w-[80px]">
                      {product.seller.location.split(',')[0]}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
