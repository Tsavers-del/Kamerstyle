import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  ArrowLeft, 
  Share2, 
  Heart, 
  Check, 
  Phone, 
  Mail, 
  Sparkles, 
  Truck, 
  Ruler, 
  Award,
  MessageSquare,
  Sparkle,
  Lock,
  CreditCard
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import RecentlyViewed from '../components/RecentlyViewed';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    products, 
    formatPrice, 
    isWishlisted, 
    toggleWishlist, 
    addRecentlyViewed, 
    contactInfo,
    openChatForProduct,
    openAiSupportChat,
    openCheckout
  } = useStore();

  const product = products.find(p => p.id === id);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Track Recently Viewed & set default selected image
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      setSelectedImage(product.image);
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <h2 className="text-3xl font-serif text-brand-primary italic">Dressing Not Found</h2>
        <p className="text-xs text-brand-primary/60 max-w-sm">
          This fashion listing may have been sold or removed by the designer.
        </p>
        <Link 
          to="/shop" 
          className="bg-brand-primary text-brand-bg px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-accent hover:text-brand-primary transition-all"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const wish = isWishlisted(product.id);
  const allImages = [product.image, ...(product.additionalImages || [])];
  const targetPhone = product.seller.phone || contactInfo.phone;

  const handleWhatsApp = () => {
    const sizeText = selectedSize ? ` (Selected Size: ${selectedSize})` : '';
    const message = `Hello! I would like to inquire about "${product.name}"${sizeText} priced at ${formatPrice(product.price)} listed on KamerStyle.%0A%0AOrigin: ${product.regionOrigin || product.seller.location}%0APlease confirm availability, custom sizing, and nationwide delivery.`;
    const url = `https://wa.me/${targetPhone.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(url, '_blank');
  };

  const handleInAppChat = () => {
    openChatForProduct(product);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this authentic Cameroonian dressing on KamerStyle: ${product.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-16">
      {/* Back Button & Breadcrumbs */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-brand-primary/60 hover:text-brand-primary transition-colors group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Collection</span>
        </button>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={handleShare}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-brand-primary/10 hover:bg-white text-brand-primary transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-600" />
                <span className="text-green-600 font-bold">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>Share Dressing</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left Column: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Selected Image */}
          <div className="aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden relative shadow-md border border-brand-primary/10">
            <img 
              src={selectedImage || product.image} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />

            {/* Wishlist Toggle Button */}
            <button 
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-5 right-5 p-3.5 rounded-full backdrop-blur-md transition-all shadow-lg cursor-pointer ${
                wish 
                  ? 'bg-red-500 text-white scale-110' 
                  : 'bg-white/90 text-brand-primary hover:text-red-500 hover:scale-110'
              }`}
              title={wish ? 'Saved in Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={20} className={wish ? 'fill-white' : ''} />
            </button>

            {/* Verification Badge */}
            <div className="absolute bottom-5 left-5 bg-brand-primary/80 backdrop-blur text-white px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-lg flex items-center space-x-1.5">
              <ShieldCheck size={14} className="text-green-400" />
              <span>Authentic KamerStyle Verified Dressing</span>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                    selectedImage === img ? 'border-brand-accent scale-102' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[11px] uppercase tracking-widest font-bold">
                <span className="text-brand-accent">{product.category}</span>
                <span className="text-brand-primary/30">•</span>
                <span className="text-brand-primary/60">{product.condition}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-brand-primary font-bold leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price Box with Currency Switcher note */}
            <div className="bg-white p-5 rounded-2xl border border-brand-primary/10 shadow-xs flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand-primary/50 block">Marketplace Price</span>
                <span className="text-3xl font-serif font-bold text-brand-primary">{formatPrice(product.price)}</span>
              </div>
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                In Stock & Ready
              </span>
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60 flex items-center">
                    <Ruler size={13} className="mr-1 text-brand-accent" /> Select Sizing:
                  </label>
                  <span className="text-[10px] text-brand-primary/50">Custom tailoring available</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-brand-primary text-brand-bg shadow-sm scale-105'
                          : 'bg-white border border-brand-primary/15 text-brand-primary hover:border-brand-accent'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/50">Dressing Story & Details</h3>
              <p className="text-sm text-brand-primary/80 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Specification Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-brand-bg rounded-xl border border-brand-primary/5">
                <span className="text-[9px] uppercase tracking-widest text-brand-primary/50 block">Region Origin</span>
                <span className="font-semibold text-brand-primary">{product.regionOrigin || 'Cameroon'}</span>
              </div>
              <div className="p-3 bg-brand-bg rounded-xl border border-brand-primary/5">
                <span className="text-[9px] uppercase tracking-widest text-brand-primary/50 block">Fabric Type</span>
                <span className="font-semibold text-brand-primary truncate block">{product.fabricType || 'Traditional Textile'}</span>
              </div>
            </div>

            {/* Delivery timeline strip */}
            <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-brand-primary/10 text-xs text-brand-primary/70">
              <Truck size={18} className="text-brand-accent flex-shrink-0" />
              <span>
                <strong>Nationwide Bus & Courier:</strong> Douala / Yaoundé / Bamenda in 24h. Diaspora shipping via DHL/FedEx.
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3.5 pt-4 border-t border-brand-primary/10">
            {/* Primary Action: Direct Escrow Checkout */}
            <button 
              onClick={() => openCheckout(product, selectedSize)}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-4 px-6 rounded-2xl text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center space-x-2.5 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer"
            >
              <Lock size={16} className="text-emerald-300" />
              <span>Buy Now (Escrow Protected: MoMo / OM / Card)</span>
            </button>

            {/* In-App Chat with Seller */}
            <button 
              onClick={handleInAppChat}
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-brand-bg py-3.5 px-6 rounded-2xl text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <MessageSquare size={16} className="text-brand-accent" />
              <span>Chat with Designer (In-App)</span>
            </button>

            {/* Secondary Action: Order via WhatsApp */}
            <button 
              onClick={handleWhatsApp}
              className="w-full bg-emerald-600/90 hover:bg-emerald-600 text-white py-3.5 px-6 rounded-2xl text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <MessageCircle size={16} className="fill-white" />
              <span>Inquire on WhatsApp ({targetPhone})</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${targetPhone}`}
                className="py-3 px-4 rounded-xl border border-brand-primary/20 text-brand-primary text-center text-xs uppercase tracking-wider font-bold hover:bg-white transition-all flex items-center justify-center space-x-1.5"
              >
                <Phone size={14} className="text-brand-accent" />
                <span>Call Designer</span>
              </a>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`py-3 px-4 rounded-xl border text-center text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  wish
                    ? 'border-red-300 bg-red-50 text-red-600'
                    : 'border-brand-primary/20 text-brand-primary hover:bg-white'
                }`}
              >
                <Heart size={14} className={wish ? 'fill-red-600' : ''} />
                <span>{wish ? 'Saved' : 'Wishlist'}</span>
              </button>
            </div>

            {/* Seller Contact Card */}
            <div className="bg-white p-5 rounded-2xl border border-brand-primary/10 space-y-3 shadow-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-brand-primary text-brand-accent flex items-center justify-center font-serif text-lg font-bold">
                    {product.seller.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-brand-primary">{product.seller.name}</h4>
                    <p className="text-[10px] text-brand-primary/60 flex items-center">
                      <MapPin size={10} className="mr-1 text-brand-accent" />
                      {product.seller.location}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] uppercase tracking-wider bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold">
                  Verified Atelier
                </span>
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] text-brand-primary/60">
                <span>Phone: {product.seller.phone}</span>
                <button 
                  onClick={openAiSupportChat}
                  className="text-brand-accent font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Sparkles size={11} />
                  <span>Ask AI Concierge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Shelf */}
      <RecentlyViewed currentProductId={product.id} />
    </div>
  );
}
