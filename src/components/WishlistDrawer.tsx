import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2, MessageCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function WishlistDrawer() {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    wishlistProducts, 
    toggleWishlist, 
    formatPrice,
    contactInfo
  } = useStore();

  if (!isWishlistOpen) return null;

  const handleInquireAll = () => {
    if (wishlistProducts.length === 0) return;
    const itemList = wishlistProducts
      .map((p, idx) => `${idx + 1}. ${p.name} (${formatPrice(p.price)})`)
      .join('%0A');
    const msg = `Hello KamerStyle! I am interested in these saved dressings from my Wishlist:%0A%0A${itemList}%0A%0APlease let me know availability, fitting sizes, and nationwide delivery details.`;
    window.open(contactInfo.whatsappUrl(decodeURIComponent(msg)), '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsWishlistOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-brand-bg shadow-2xl flex flex-col border-l border-brand-primary/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-brand-primary/10 flex items-center justify-between bg-brand-primary text-brand-bg">
              <div className="flex items-center space-x-2">
                <Heart className="text-brand-accent fill-brand-accent" size={20} />
                <div>
                  <h2 className="font-serif text-lg tracking-wide text-white">Your Saved Wishlist</h2>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest font-sans">
                    {wishlistProducts.length} {wishlistProducts.length === 1 ? 'Dressing Saved' : 'Dressings Saved'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wishlistProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary/30">
                    <Heart size={32} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl text-brand-primary">Your wishlist is empty</h3>
                    <p className="text-xs text-brand-primary/60 max-w-xs">
                      Explore our handcrafted Toghu, Ankara dresses, Sawa robes, and Ndop pieces to save your favorites.
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    onClick={() => setIsWishlistOpen(false)}
                    className="mt-4 inline-flex items-center space-x-2 bg-brand-accent text-brand-primary px-6 py-3 rounded-md text-xs uppercase tracking-widest font-bold hover:bg-brand-accent/90 transition-all"
                  >
                    <span>Browse Collection</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                wishlistProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex space-x-4 p-3 bg-white rounded-xl border border-brand-primary/10 hover:border-brand-accent/40 transition-all shadow-xs"
                  >
                    <Link
                      to={`/product/${product.id}`}
                      onClick={() => setIsWishlistOpen(false)}
                      className="w-20 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-brand-accent font-bold">
                          {product.category}
                        </span>
                        <Link
                          to={`/product/${product.id}`}
                          onClick={() => setIsWishlistOpen(false)}
                          className="block font-serif text-sm font-semibold text-brand-primary truncate hover:text-brand-accent transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs font-semibold text-brand-primary mt-0.5">
                          {formatPrice(product.price)}
                        </p>
                        <p className="text-[10px] text-brand-primary/50 truncate">
                          📍 {product.seller.location}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <a
                          href={contactInfo.whatsappUrl(
                            `Hello! I saved "${product.name}" (${formatPrice(product.price)}) from KamerStyle and want to order it now.`
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-[10px] uppercase font-bold text-green-700 hover:text-green-800"
                        >
                          <MessageCircle size={12} />
                          <span>Buy on WhatsApp</span>
                        </a>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Batch Actions */}
            {wishlistProducts.length > 0 && (
              <div className="p-6 border-t border-brand-primary/10 bg-white space-y-3">
                <button
                  onClick={handleInquireAll}
                  className="w-full bg-brand-primary hover:bg-brand-primary/95 text-white py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>Inquire All via WhatsApp</span>
                </button>
                <div className="flex justify-between items-center text-[10px] text-brand-primary/50 uppercase tracking-widest">
                  <span>Direct Support: {contactInfo.phone}</span>
                  <Link
                    to="/shop"
                    onClick={() => setIsWishlistOpen(false)}
                    className="text-brand-accent hover:underline"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
