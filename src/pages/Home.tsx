import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Zap, Heart, MessageCircle, Sparkles, MapPin, CheckCircle2, Phone, Mail, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import RecentlyViewed from '../components/RecentlyViewed';

export default function Home() {
  const { products, formatPrice, isWishlisted, toggleWishlist, contactInfo, openAuthModal, user } = useStore();

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="space-y-20 md:space-y-28 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-brand-primary">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1549037173-e3b717902c57?auto=format&fit=crop&q=80" 
            alt="Cameroonian Haute Couture Heritage" 
            className="w-full h-full object-cover brightness-[0.38] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-brand-bg w-full py-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6"
          >
            <div className="inline-flex items-center space-x-2 bg-brand-accent/20 border border-brand-accent/40 backdrop-blur-md px-3.5 py-1 rounded-full">
              <Sparkles size={13} className="text-brand-accent animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-accent">
                Cameroon's #1 Dressing Marketplace
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif leading-[0.95] tracking-tight text-white">
              Wear Your <br />
              <span className="italic text-brand-accent font-normal">Heritage.</span>
            </h1>

            <p className="text-base sm:text-lg opacity-85 font-light max-w-lg leading-relaxed text-gray-200">
              Buy and sell authentic Cameroonian dressings: royal Bamenda Toghu, Bamileke Ndop, Sawa Kaba Ngondo, luxury African bridal gowns, and bespoke modern Ankara attire.
            </p>

            {/* Quick Hero Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link 
                to="/shop" 
                className="bg-brand-accent text-brand-primary px-8 py-4 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-accent/90 transition-all flex items-center group shadow-xl hover:scale-102"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </Link>
              
              <Link 
                to="/sell" 
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-8 py-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all"
              >
                + Sell a Dressing
              </Link>
            </div>

            {/* Verified Support Tag */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-white/70">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck size={16} className="text-green-400" />
                <span>Escrow Guarantee</span>
              </div>
              <span className="opacity-30">•</span>
              <div className="flex items-center space-x-1.5">
                <Phone size={14} className="text-brand-accent" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-white">{contactInfo.phone}</a>
              </div>
              <span className="opacity-30">•</span>
              <div className="flex items-center space-x-1.5">
                <Mail size={14} className="text-brand-accent" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-white">{contactInfo.email}</a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Regional Fashion Heritage Categories Bento */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-accent font-bold">Cameroon Cultural Regions</span>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-primary">Iconic Dressings By Region</h2>
          <p className="text-xs md:text-sm text-brand-primary/60">
            From the royal grassfields of Bamenda to the coastal elegance of Douala and the Sahelian grandeur of Garoua.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[550px]">
          {/* Toghu North West */}
          <Link 
            to="/shop?cat=Traditional&region=Bamenda" 
            className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-2xl shadow-md min-h-[280px]"
          >
            <img 
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80" 
              alt="Royal Bamenda Toghu" 
              className="w-full h-full object-cover brightness-[0.65] group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 md:p-8 flex flex-col justify-end text-white">
              <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold">North West Grassfields</span>
              <h3 className="text-2xl md:text-3xl font-serif font-bold">Royal Toghu Velvet</h3>
              <p className="text-xs text-white/80 max-w-xs mt-1">Hand-embroidered heavy velvet robes, tunics, caps, and wedding regalia.</p>
              <div className="mt-3 flex items-center space-x-1 text-xs font-bold text-brand-accent">
                <span>View Collection</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Sawa Kaba Ngondo */}
          <Link 
            to="/shop?cat=Traditional&region=Littoral" 
            className="md:col-span-2 relative group overflow-hidden rounded-2xl shadow-md min-h-[220px]"
          >
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80" 
              alt="Sawa Kaba Ngondo" 
              className="w-full h-full object-cover brightness-[0.65] group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold">Littoral Coastal Heritage</span>
              <h3 className="text-xl md:text-2xl font-serif font-bold">Sawa Kaba Ngondo</h3>
              <p className="text-xs text-white/80 max-w-sm">Elegantly flowing pure silk, satin, and organza traditional ceremonial gowns.</p>
            </div>
          </Link>

          {/* West Region Ndop */}
          <Link 
            to="/shop?cat=Traditional&region=West" 
            className="relative group overflow-hidden rounded-2xl shadow-md min-h-[220px]"
          >
            <img 
              src="https://images.unsplash.com/photo-1549037173-e3b717902c57?auto=format&fit=crop&q=80" 
              alt="Bamileke Ndop" 
              className="w-full h-full object-cover brightness-[0.65] group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[9px] uppercase tracking-widest text-brand-accent font-bold">West Bamileke / Bamum</span>
              <h3 className="text-lg font-serif font-bold">Indigo Ndop</h3>
            </div>
          </Link>

          {/* African Bridal & Modern Ankara */}
          <Link 
            to="/shop?cat=Bridal" 
            className="relative group overflow-hidden rounded-2xl shadow-md min-h-[220px]"
          >
            <img 
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" 
              alt="African Bridal Luxury" 
              className="w-full h-full object-cover brightness-[0.65] group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
              <span className="text-[9px] uppercase tracking-widest text-brand-accent font-bold">Pan-Cameroon</span>
              <h3 className="text-lg font-serif font-bold">Luxury Bridal</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Trending Dressings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold">Curated Masterpieces</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-brand-primary">Trending Cameroon Dressings</h2>
          </div>
          <Link 
            to="/shop" 
            className="text-xs uppercase tracking-widest font-bold text-brand-primary hover:text-brand-accent transition-colors flex items-center space-x-1"
          >
            <span>View All ({products.length})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => {
            const wish = isWishlisted(product.id);
            return (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl overflow-hidden border border-brand-primary/10 hover:border-brand-accent/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative">
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
                      className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                        wish
                          ? 'bg-red-500 text-white'
                          : 'bg-white/90 text-brand-primary hover:text-red-500 hover:scale-110'
                      }`}
                      title={wish ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart size={16} className={wish ? 'fill-white' : ''} />
                    </button>

                    {/* Condition badge */}
                    <div className="absolute top-4 left-4 bg-brand-primary/90 text-white px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold rounded">
                      {product.condition}
                    </div>

                    {/* Region Pill */}
                    {product.regionOrigin && (
                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur text-white px-2.5 py-1 text-[9px] uppercase tracking-wider rounded flex items-center space-x-1">
                        <MapPin size={10} className="text-brand-accent" />
                        <span>{product.regionOrigin.split('(')[0]}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                      <span className="text-brand-accent font-bold">{product.category}</span>
                      <span className="text-brand-primary/50">📍 {product.seller.location.split(',')[0]}</span>
                    </div>

                    <Link to={`/product/${product.id}`} className="block">
                      <h3 className="text-xl font-serif font-bold text-brand-primary group-hover:text-brand-accent transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-brand-primary/60 line-clamp-2 leading-relaxed font-light">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-100 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[10px] text-brand-primary/40 uppercase tracking-widest block">Price</span>
                    <span className="text-lg font-bold text-brand-primary">{formatPrice(product.price)}</span>
                  </div>

                  <a
                    href={contactInfo.whatsappUrl(`Hello! I would like to buy the "${product.name}" (${formatPrice(product.price)}) from KamerStyle.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 bg-brand-primary text-brand-bg hover:bg-brand-accent hover:text-brand-primary px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all shadow-xs"
                  >
                    <MessageCircle size={13} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trust & Guarantee Section */}
      <section className="bg-brand-primary text-brand-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent mx-auto md:mx-0">
                <Award size={24} />
              </div>
              <h3 className="text-2xl font-serif text-white">Authentic Cameroonian Craft</h3>
              <p className="text-xs text-brand-bg/70 leading-relaxed">
                Hand-embroidered Toghus from Bamenda, royal Bamileke Ndop cloths, and tailor-made Ankara gowns verified for authenticity and fabric quality.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent mx-auto md:mx-0">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-2xl font-serif text-white">Buyer & Seller Escrow Protection</h3>
              <p className="text-xs text-brand-bg/70 leading-relaxed">
                Pay safely via MTN Mobile Money, Orange Money, or Card. Funds are securely held until you receive and verify the fitting of your dressing.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent mx-auto md:mx-0">
                <MessageCircle size={24} />
              </div>
              <h3 className="text-2xl font-serif text-white">Instant WhatsApp Concierge</h3>
              <p className="text-xs text-brand-bg/70 leading-relaxed">
                Direct contact with verified designers or our executive team at <span className="text-brand-accent font-bold font-mono">{contactInfo.phone}</span> for custom fitting and nationwide bus delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Contact & Sell CTA Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-50 to-brand-bg rounded-3xl p-8 md:p-14 border border-brand-accent/30 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-accent font-bold">Designer & Seller Hub</span>
              <h2 className="text-3xl md:text-5xl font-serif text-brand-primary">
                Are you a Tailor, Designer, or Selling Your Dressing?
              </h2>
              <p className="text-sm text-brand-primary/70 leading-relaxed">
                Reach thousands of fashion lovers across Douala, Yaoundé, Bamenda, Bafoussam, and the Cameroonian diaspora in Europe and America.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/sell"
                  className="bg-brand-primary text-brand-bg px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-accent hover:text-brand-primary transition-all shadow-md"
                >
                  Start Selling Dressings Free
                </Link>
                <a
                  href={contactInfo.whatsappUrl('Hello Simon Tangu! I am a Cameroonian designer / seller wanting to list my fashion collection on KamerStyle.')}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-brand-primary/20 text-brand-primary px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-white transition-all flex items-center space-x-2"
                >
                  <MessageCircle size={15} />
                  <span>Partner With Concierge</span>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-brand-primary/10 shadow-sm space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-brand-primary text-brand-accent flex items-center justify-center font-serif text-xl font-bold">
                  ST
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-brand-primary">Simon Tangu</h4>
                  <p className="text-xs text-brand-primary/60">Executive Lead & Head of Concierge</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-brand-primary/80">
                <div className="flex items-center space-x-3">
                  <Phone size={15} className="text-brand-accent flex-shrink-0" />
                  <span className="font-mono font-semibold">{contactInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={15} className="text-brand-accent flex-shrink-0" />
                  <span className="font-semibold">{contactInfo.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={15} className="text-brand-accent flex-shrink-0" />
                  <span>Bamenda Commercial Ave & Douala Akwa Fashion Quarter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Shelf */}
      <RecentlyViewed />
    </div>
  );
}
