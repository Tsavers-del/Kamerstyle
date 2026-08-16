import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  Menu, 
  X, 
  Heart, 
  PlusCircle, 
  Phone, 
  Mail, 
  Globe, 
  Shield, 
  Sparkles, 
  LogOut,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { Currency } from '../types';

export default function Navbar() {
  const navigate = useNavigate();
  const { 
    wishlist, 
    setIsWishlistOpen, 
    setIsSearchOpen, 
    currency, 
    setCurrency, 
    user, 
    openAuthModal, 
    logout,
    contactInfo,
    unreadMessagesCount,
    setIsChatOpen,
    openAiSupportChat,
    isAdmin
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const currencies: Currency[] = ['FCFA', 'USD', 'EUR', 'GBP'];

  return (
    <>
      {/* Top Announcement & Verified Contact Strip */}
      <div className="bg-brand-primary text-brand-bg text-[11px] py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-1 md:space-y-0">
          <div className="flex items-center space-x-4 text-brand-bg/80">
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping mr-1" />
              <span className="font-semibold text-brand-accent">Executive Admin:</span>
              <span className="text-white font-medium">Simon Tangu</span>
              <span className="opacity-40">|</span>
              <a href={`tel:${contactInfo.phone}`} className="hover:text-white font-mono">{contactInfo.phone}</a>
            </span>
            <span className="hidden sm:inline opacity-30">|</span>
            <span className="hidden sm:flex items-center space-x-1">
              <Mail size={12} className="text-brand-accent" />
              <a href={`mailto:${contactInfo.email}`} className="hover:text-white">{contactInfo.email}</a>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={openAiSupportChat}
              className="flex items-center space-x-1 text-brand-accent hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
            >
              <Sparkles size={12} />
              <span>AI Fashion Concierge</span>
            </button>

            <span className="hidden lg:inline text-brand-bg/40 opacity-30">|</span>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center space-x-1 text-white bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Globe size={11} className="text-brand-accent mr-1" />
                <span>{currency}</span>
              </button>

              <AnimatePresence>
                {isCurrencyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 top-full mt-1 bg-brand-primary text-white border border-white/20 rounded-xl shadow-xl py-1 z-50 min-w-[110px]"
                  >
                    {currencies.map((curr) => (
                      <button
                        key={curr}
                        onClick={() => {
                          setCurrency(curr);
                          setIsCurrencyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 flex items-center justify-between cursor-pointer ${
                          currency === curr ? 'text-brand-accent font-bold bg-white/5' : 'text-white/80'
                        }`}
                      >
                        <span>{curr}</span>
                        {currency === curr && <span className="text-[10px]">✓</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-md border-b border-brand-primary/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-lg bg-brand-primary text-brand-accent flex items-center justify-center font-serif text-xl font-bold shadow-md group-hover:scale-105 transition-transform">
                KS
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-serif tracking-widest uppercase font-bold text-brand-primary">
                  KAMERSTYLE
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-brand-accent font-bold font-sans">
                  Cameroon Dressing Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-7">
              <Link to="/shop" className="text-xs uppercase tracking-widest font-bold text-brand-primary hover:text-brand-accent transition-colors">
                All Dressings
              </Link>
              <Link to="/shop?cat=Traditional" className="text-xs uppercase tracking-widest font-bold text-brand-primary hover:text-brand-accent transition-colors">
                Traditional Toghu & Ndop
              </Link>
              <Link to="/shop?cat=Modern" className="text-xs uppercase tracking-widest font-bold text-brand-primary hover:text-brand-accent transition-colors">
                Modern Ankara
              </Link>
              <Link to="/shop?cat=Bridal" className="text-xs uppercase tracking-widest font-bold text-brand-primary hover:text-brand-accent transition-colors flex items-center">
                <span>Bridal</span>
                <span className="ml-1 text-[8px] bg-brand-accent/20 text-brand-primary px-1.5 py-0.2 rounded font-sans font-bold">New</span>
              </Link>
              <Link to="/shop?cat=Accessories" className="text-xs uppercase tracking-widest font-bold text-brand-primary hover:text-brand-accent transition-colors">
                Accessories
              </Link>
              <Link 
                to="/admin" 
                className="text-xs uppercase tracking-widest font-bold text-brand-accent hover:text-brand-primary transition-colors flex items-center space-x-1"
                title="Admin Control Center"
              >
                <Shield size={13} />
                <span>Admin</span>
              </Link>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2.5 sm:space-x-4">
              {/* Search trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-brand-primary hover:text-brand-accent hover:bg-brand-primary/5 rounded-full transition-all cursor-pointer"
                title="Search Dressings"
              >
                <Search size={19} />
              </button>

              {/* In-App Chat Trigger with Unread Count Badge */}
              <button
                onClick={() => setIsChatOpen(true)}
                className="relative p-2 text-brand-primary hover:text-brand-accent hover:bg-brand-primary/5 rounded-full transition-all cursor-pointer"
                title="Open Messaging & AI Support"
              >
                <MessageSquare size={19} />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-accent text-brand-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold font-sans animate-bounce shadow-xs">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              {/* Wishlist Button with Counter */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 text-brand-primary hover:text-brand-accent hover:bg-brand-primary/5 rounded-full transition-all cursor-pointer"
                title="View Wishlist"
              >
                <Heart size={19} className={wishlist.length > 0 ? 'text-red-500 fill-red-500' : ''} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-sans">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Sell a Dressing CTA */}
              <Link
                to="/sell"
                className="hidden sm:inline-flex items-center space-x-1.5 bg-brand-accent hover:bg-brand-accent/90 text-brand-primary px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider font-bold shadow-xs transition-all hover:scale-102"
              >
                <PlusCircle size={14} />
                <span>Sell Item</span>
              </Link>

              {/* User Account / Auth Dropdown */}
              <div className="relative">
                {user ? (
                  <div>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center space-x-2 p-1.5 rounded-full border border-brand-primary/20 hover:border-brand-accent transition-all bg-white cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-full bg-brand-primary text-brand-accent flex items-center justify-center text-xs font-bold font-serif">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden md:inline text-xs font-bold text-brand-primary max-w-[90px] truncate pr-1">
                        {user.name.split(' ')[0]}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute right-0 top-full mt-2 w-64 bg-brand-bg rounded-2xl shadow-2xl border border-brand-primary/10 p-3 z-50"
                        >
                          <div className="p-2 border-b border-brand-primary/10">
                            <p className="text-xs font-bold text-brand-primary">{user.name}</p>
                            <p className="text-[10px] text-brand-primary/60 truncate">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-[9px] uppercase tracking-wider bg-brand-accent/20 text-brand-primary px-2 py-0.5 rounded font-bold">
                                {user.role}
                              </span>
                              {user.isAdmin && (
                                <span className="text-[9px] uppercase tracking-wider bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold">
                                  Admin
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="py-2 space-y-1">
                            <Link
                              to="/account"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="w-full text-left px-3 py-2 text-xs text-brand-primary hover:bg-brand-primary/5 rounded-lg flex items-center space-x-2"
                            >
                              <UserIcon size={14} className="text-brand-accent" />
                              <span>My Account & Listings</span>
                            </Link>
                            <Link
                              to="/admin"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="w-full text-left px-3 py-2 text-xs text-brand-primary hover:bg-brand-primary/5 rounded-lg flex items-center space-x-2 font-bold"
                            >
                              <Shield size={14} className="text-brand-accent" />
                              <span>Admin Control Center</span>
                            </Link>
                            <button
                              onClick={() => {
                                setIsUserDropdownOpen(false);
                                setIsChatOpen(true);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-brand-primary hover:bg-brand-primary/5 rounded-lg flex items-center space-x-2 cursor-pointer"
                            >
                              <MessageSquare size={14} className="text-brand-accent" />
                              <span>Messages & Inquiries</span>
                            </button>
                            <button
                              onClick={() => {
                                setIsUserDropdownOpen(false);
                                setIsWishlistOpen(true);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-brand-primary hover:bg-brand-primary/5 rounded-lg flex items-center space-x-2 cursor-pointer"
                            >
                              <Heart size={14} className="text-brand-accent" />
                              <span>Saved Wishlist ({wishlist.length})</span>
                            </button>
                            <Link
                              to="/sell"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="w-full text-left px-3 py-2 text-xs text-brand-primary hover:bg-brand-primary/5 rounded-lg flex items-center space-x-2"
                            >
                              <PlusCircle size={14} className="text-brand-accent" />
                              <span>List New Dressing</span>
                            </Link>
                          </div>

                          <div className="pt-2 border-t border-brand-primary/10">
                            <button
                              onClick={() => {
                                logout();
                                setIsUserDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2 font-semibold cursor-pointer"
                            >
                              <LogOut size={14} />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center space-x-1.5 border border-brand-primary/20 hover:border-brand-primary text-brand-primary px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all bg-white cursor-pointer"
                  >
                    <UserIcon size={14} />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>
                )}
              </div>

              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-brand-primary hover:bg-brand-primary/5 rounded-lg cursor-pointer"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-brand-primary/10 bg-brand-bg px-6 py-6 space-y-6 overflow-hidden"
            >
              <div className="flex flex-col space-y-4 text-center">
                <Link
                  to="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-serif uppercase tracking-widest font-semibold py-1 hover:text-brand-accent"
                >
                  All Dressings
                </Link>
                <Link
                  to="/shop?cat=Traditional"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-serif uppercase tracking-widest font-semibold py-1 hover:text-brand-accent"
                >
                  Traditional Toghu & Ndop
                </Link>
                <Link
                  to="/shop?cat=Modern"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-serif uppercase tracking-widest font-semibold py-1 hover:text-brand-accent"
                >
                  Modern Ankara Gowns
                </Link>
                <Link
                  to="/shop?cat=Bridal"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-serif uppercase tracking-widest font-semibold py-1 hover:text-brand-accent"
                >
                  African Bridal Wear
                </Link>
                <Link
                  to="/shop?cat=Accessories"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-serif uppercase tracking-widest font-semibold py-1 hover:text-brand-accent"
                >
                  Royal Accessories & Shoes
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-serif uppercase tracking-widest font-bold py-1 text-brand-accent"
                >
                  🛡️ Admin Control Center
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsChatOpen(true);
                  }}
                  className="w-full bg-brand-primary text-white py-3 rounded-xl text-xs uppercase tracking-widest font-bold shadow-md flex items-center justify-center space-x-2"
                >
                  <MessageSquare size={16} className="text-brand-accent" />
                  <span>Open In-App Messaging & AI</span>
                </button>
                <Link
                  to="/sell"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-block bg-brand-accent text-brand-primary py-3 rounded-xl text-xs uppercase tracking-widest font-bold shadow-md"
                >
                  + Sell a Dressing in Cameroon
                </Link>
              </div>

              <div className="pt-4 border-t border-brand-primary/10 flex flex-col items-center space-y-3 text-xs text-brand-primary/70">
                <div className="flex items-center space-x-2">
                  <Phone size={14} className="text-brand-accent" />
                  <span>Admin: {contactInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={14} className="text-brand-accent" />
                  <span>{contactInfo.email}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
