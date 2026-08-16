import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import WishlistDrawer from './components/WishlistDrawer';
import SearchModal from './components/SearchModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ChatDrawer from './components/ChatDrawer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Sell from './pages/Sell';
import ProductDetail from './pages/ProductDetail';
import Account from './pages/Account';
import Admin from './pages/Admin';

import { Phone, Mail, MapPin, ShieldCheck, Heart, Sparkles, MessageCircle, Shield } from 'lucide-react';

function AppLayout() {
  const { contactInfo, wishlist, setIsWishlistOpen, openAuthModal, user, openAiSupportChat, setIsChatOpen } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-primary font-sans selection:bg-brand-accent selection:text-brand-primary">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<Admin />} />
          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Modals & Overlays */}
      <AuthModal />
      <WishlistDrawer />
      <SearchModal />
      <ChatDrawer />
      <FloatingWhatsApp />

      {/* Comprehensive Cameroon Luxury Fashion Footer */}
      <footer className="bg-brand-primary text-brand-bg pt-16 pb-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            {/* Brand Intro & Lead */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-accent text-brand-primary flex items-center justify-center font-serif text-2xl font-bold shadow-md">
                  KS
                </div>
                <div>
                  <span className="text-2xl font-serif tracking-widest uppercase font-bold text-white block">
                    KAMERSTYLE
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold">
                    Haute Couture & Heritage Marketplace
                  </span>
                </div>
              </div>

              <p className="text-xs text-brand-bg/70 max-w-md leading-relaxed font-light">
                Cameroon's premier curated fashion exchange. Empowering local weavers, royal Toghu embroiderers, Sawa silk couturiers, and modern African designers to reach fashion lovers across Cameroon and the global diaspora.
              </p>

              {/* Simon Tangu Direct Contact Badge */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 max-w-md">
                <div className="flex items-center space-x-2 text-xs font-bold text-brand-accent">
                  <ShieldCheck size={16} />
                  <span>Platform Executive Administrator</span>
                </div>
                <div className="space-y-1 text-xs text-brand-bg/80">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">Simon Tangu:</span>
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-white font-mono font-bold">
                      {contactInfo.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail size={13} className="text-brand-accent" />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-white">
                      {contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] opacity-70">
                    <MapPin size={13} className="text-brand-accent" />
                    <span>Commercial Ave, Bamenda & Akwa, Douala</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Collections Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-bold text-brand-accent">
                Dressing Collections
              </h4>
              <ul className="space-y-2 text-xs text-brand-bg/70 font-light">
                <li>
                  <Link to="/shop?cat=Traditional" className="hover:text-white transition-colors">
                    Royal Bamenda Toghu
                  </Link>
                </li>
                <li>
                  <Link to="/shop?cat=Traditional" className="hover:text-white transition-colors">
                    Sawa Kaba Ngondo Robes
                  </Link>
                </li>
                <li>
                  <Link to="/shop?cat=Traditional" className="hover:text-white transition-colors">
                    Grassfields Indigo Ndop
                  </Link>
                </li>
                <li>
                  <Link to="/shop?cat=Modern" className="hover:text-white transition-colors">
                    Modern Ankara Gala Dresses
                  </Link>
                </li>
                <li>
                  <Link to="/shop?cat=Bridal" className="hover:text-white transition-colors">
                    African Luxury Bridal Wear
                  </Link>
                </li>
                <li>
                  <Link to="/shop?cat=Bespoke Men" className="hover:text-white transition-colors">
                    Northern Grand Boubou & Suits
                  </Link>
                </li>
                <li>
                  <Link to="/shop?cat=Accessories" className="hover:text-white transition-colors">
                    Royal Beaded Headdresses
                  </Link>
                </li>
                <li>
                  <Link to="/shop?cat=Shoes" className="hover:text-white transition-colors">
                    Maroua Leather Loafers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Services & Regional Centers */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-bold text-brand-accent">
                Cameroon Hubs & Escrow
              </h4>
              <ul className="space-y-2 text-xs text-brand-bg/70 font-light">
                <li><span className="text-white font-medium">Douala:</span> Akwa / Bonanjo Hub</li>
                <li><span className="text-white font-medium">Yaoundé:</span> Bastos / Centre Hub</li>
                <li><span className="text-white font-medium">Bamenda:</span> Commercial Ave Ateliers</li>
                <li><span className="text-white font-medium">Bafoussam:</span> Grassfield Craft Depot</li>
                <li><span className="text-white font-medium">Limbe & Buea:</span> Coastal Express</li>
                <li><span className="text-white font-medium">Garoua & Maroua:</span> Sahelian Leather</li>
                <li className="pt-2 text-[11px] text-green-400 flex items-center space-x-1">
                  <ShieldCheck size={13} />
                  <span>Escrow-Protected Payouts</span>
                </li>
              </ul>
            </div>

            {/* Customer & Designer Portal */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-bold text-brand-accent">
                Services & Messaging
              </h4>
              <ul className="space-y-2 text-xs text-brand-bg/70 font-light">
                <li>
                  <button 
                    onClick={openAiSupportChat}
                    className="hover:text-white transition-colors text-left flex items-center space-x-1.5 font-bold text-brand-accent cursor-pointer"
                  >
                    <Sparkles size={13} />
                    <span>AI Fashion Concierge</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="hover:text-white transition-colors text-left flex items-center space-x-1.5 cursor-pointer"
                  >
                    <MessageCircle size={13} />
                    <span>In-App Messages</span>
                  </button>
                </li>
                <li>
                  <Link to="/sell" className="hover:text-white font-semibold transition-colors">
                    + Sell Clothes / Accessories
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="hover:text-white transition-colors flex items-center space-x-1">
                    <Shield size={12} className="text-brand-accent" />
                    <span>Admin Control Center</span>
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="hover:text-white transition-colors">
                    {user ? 'My Account' : 'Sign In / Register'}
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => setIsWishlistOpen(true)}
                    className="hover:text-white transition-colors text-left flex items-center space-x-1 cursor-pointer"
                  >
                    <span>My Wishlist</span>
                    <span className="text-[10px] bg-brand-accent/20 px-1.5 rounded text-brand-accent font-bold">
                      {wishlist.length}
                    </span>
                  </button>
                </li>
              </ul>

              {/* Accepted Mobile Money and Payment Methods */}
              <div className="pt-3">
                <span className="text-[10px] uppercase tracking-widest text-brand-bg/50 block mb-1">
                  Accepted Payments:
                </span>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-white/90">
                  <span className="bg-yellow-500 text-black px-2 py-0.5 rounded">MTN MoMo</span>
                  <span className="bg-orange-500 text-white px-2 py-0.5 rounded">Orange Money</span>
                  <span className="bg-blue-900 text-white px-2 py-0.5 rounded">Visa/Card</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Guarantee */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-brand-bg/50 uppercase tracking-widest space-y-3 sm:space-y-0">
            <p>© 2026 KamerStyle. Managed & Monitored by Simon Tangu (+237 650 135 276). All Rights Reserved.</p>
            <div className="flex space-x-6">
              <span>Authentic Toghu & Ndop Guild</span>
              <span>100% Cameroon Escrow Protection</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <StoreProvider>
        <AppLayout />
      </StoreProvider>
    </Router>
  );
}
