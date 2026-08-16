import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, Mail, X, ShieldCheck, Sparkles, MessageSquare, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function FloatingWhatsApp() {
  const { contactInfo, openAiSupportChat, setIsChatOpen, unreadMessagesCount } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Quick Contact Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-84 bg-white rounded-3xl shadow-2xl border border-brand-primary/15 overflow-hidden text-brand-primary"
          >
            <div className="bg-gradient-to-r from-brand-primary via-slate-900 to-emerald-950 p-4 text-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center font-serif text-lg font-bold">
                    ST
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm">Simon Tangu</h4>
                    <p className="text-[10px] text-green-300 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-1.5" />
                      Executive Administrator Active
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white p-1 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-white/80 mt-2 font-light">
                Cameroon Marketplace Help Desk, Escrow Protection & AI Concierge.
              </p>
            </div>

            <div className="p-4 space-y-2.5 bg-brand-bg/50">
              {/* Option 1: In-App AI Support & Messages */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  openAiSupportChat();
                }}
                className="w-full flex items-center space-x-3 p-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm group cursor-pointer"
              >
                <Sparkles size={18} className="text-brand-accent" />
                <span className="flex-1 text-left">In-App Chat & AI Support</span>
                <span className="text-[9px] bg-brand-accent text-brand-primary px-1.5 py-0.5 rounded font-bold">
                  24/7 AI
                </span>
              </button>

              {/* Option 2: Direct WhatsApp to Simon Tangu */}
              <a
                href={contactInfo.whatsappUrl('Hello Simon Tangu! I am on KamerStyle and would like to ask some questions regarding Cameroonian dressings.')}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-3 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm group"
              >
                <MessageCircle size={18} className="fill-white" />
                <span>WhatsApp Simon ({contactInfo.phone})</span>
              </a>

              {/* Option 3: Phone & Email */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center justify-center space-x-1.5 p-2 bg-white hover:bg-brand-primary/5 border border-brand-primary/10 rounded-xl text-xs font-semibold text-brand-primary transition-all"
                >
                  <Phone size={14} className="text-brand-accent" />
                  <span>Call Admin</span>
                </a>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-1.5 p-2 bg-white hover:bg-brand-primary/5 border border-brand-primary/10 rounded-xl text-xs font-semibold text-brand-primary transition-all"
                >
                  <Shield size={14} className="text-brand-accent" />
                  <span>Admin Panel</span>
                </Link>
              </div>

              <div className="pt-2 border-t border-brand-primary/10 flex items-center justify-center space-x-1.5 text-[9px] text-brand-primary/50 uppercase tracking-widest">
                <ShieldCheck size={12} className="text-green-600" />
                <span>Verified KamerStyle Concierge Service</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center space-x-2 bg-gradient-to-r from-brand-primary to-slate-900 hover:from-slate-900 hover:to-black text-white p-3.5 md:px-5 md:py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer border border-brand-accent/30"
        aria-label="Contact Concierge WhatsApp or Chat"
      >
        <MessageCircle size={22} className="text-brand-accent fill-brand-accent" />
        <span className="hidden md:inline font-sans text-xs font-bold uppercase tracking-wider">
          Chat & AI Support ({contactInfo.phone})
        </span>

        {unreadMessagesCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-brand-accent text-brand-primary text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-extrabold shadow-md animate-bounce">
            {unreadMessagesCount}
          </span>
        )}
      </button>
    </div>
  );
}
