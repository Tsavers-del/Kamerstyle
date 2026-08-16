import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Lock, Mail, Phone, MapPin, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalMode, openAuthModal, login, signup } = useStore();
  const [tab, setTab] = useState<'login' | 'signup'>(authModalMode);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Douala');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync tab with store state when opened
  React.useEffect(() => {
    setTab(authModalMode);
    setErrorMsg('');
    setSuccessMsg('');
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    const res = await login(loginEmail, loginPassword);
    setIsLoading(false);
    if (!res.success) {
      setErrorMsg(res.message || 'Login failed');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    const res = await signup({
      name,
      email,
      phone: phone.startsWith('+237') ? phone : `+237${phone}`,
      location,
      role,
      password
    });
    setIsLoading(false);
    if (!res.success) {
      setErrorMsg(res.message || 'Signup failed');
    }
  };

  const fillDemoAdmin = () => {
    setLoginEmail('simontangu317@gmail.com');
    setLoginPassword('password123');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAuthModalOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-brand-bg rounded-2xl shadow-2xl border border-brand-primary/10 overflow-hidden z-10"
        >
          {/* Header decoration */}
          <div className="bg-brand-primary text-brand-bg px-6 py-5 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="text-brand-accent" size={20} />
              <div>
                <h3 className="font-serif tracking-wide text-lg text-white font-medium">KamerStyle Secure Gateway</h3>
                <p className="text-[10px] text-brand-bg/60 uppercase tracking-widest font-sans">Verified Authentication & Escrow Protection</p>
              </div>
            </div>
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-brand-primary/10 bg-brand-primary/5">
            <button
              onClick={() => { setTab('login'); setErrorMsg(''); }}
              className={`flex-1 py-3 text-xs uppercase tracking-widest font-bold transition-all ${
                tab === 'login' 
                  ? 'bg-brand-bg text-brand-primary border-t-2 border-brand-accent' 
                  : 'text-brand-primary/50 hover:text-brand-primary'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setErrorMsg(''); }}
              className={`flex-1 py-3 text-xs uppercase tracking-widest font-bold transition-all ${
                tab === 'signup' 
                  ? 'bg-brand-bg text-brand-primary border-t-2 border-brand-accent' 
                  : 'text-brand-primary/50 hover:text-brand-primary'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center space-x-2">
                <span>⚠️ {errorMsg}</span>
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60 flex items-center">
                    <Mail size={12} className="mr-1.5" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. simontangu317@gmail.com"
                    className="w-full bg-white border border-brand-primary/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-accent transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60 flex items-center">
                      <Lock size={12} className="mr-1.5" /> Password
                    </label>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert("Use Simon Tangu demo login or enter any email."); }} className="text-[10px] text-brand-accent hover:underline">Forgot?</a>
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-brand-primary/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-accent transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-primary text-white hover:bg-brand-primary/90 font-bold py-3.5 px-4 rounded-lg text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-block animate-spin">⏳</span>
                  ) : (
                    <>
                      <span>Secure Sign In</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                {/* 1-Click Quick Demo for Simon Tangu */}
                <div className="pt-2 border-t border-brand-primary/10">
                  <button
                    type="button"
                    onClick={fillDemoAdmin}
                    className="w-full text-left p-3 rounded-lg bg-brand-accent/10 border border-brand-accent/20 hover:bg-brand-accent/20 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Sparkles size={16} className="text-brand-accent" />
                      <div>
                        <p className="text-xs font-semibold text-brand-primary">Demo Creator Login (Simon Tangu)</p>
                        <p className="text-[10px] text-brand-primary/60">simontangu317@gmail.com (+237650135276)</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-brand-accent bg-white px-2 py-0.5 rounded shadow-sm">Fill</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60 flex items-center">
                    <User size={12} className="mr-1.5" /> Full Name / Boutique Brand
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Simon Tangu"
                    className="w-full bg-white border border-brand-primary/15 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-accent transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60 flex items-center">
                      <Mail size={12} className="mr-1.5" /> Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full bg-white border border-brand-primary/15 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60 flex items-center">
                      <Phone size={12} className="mr-1.5" /> WhatsApp Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="650135276"
                      className="w-full bg-white border border-brand-primary/15 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60 flex items-center">
                      <MapPin size={12} className="mr-1.5" /> Primary City
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white border border-brand-primary/15 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-accent transition-colors"
                    >
                      <option value="Douala">Douala (Littoral)</option>
                      <option value="Yaoundé">Yaoundé (Centre)</option>
                      <option value="Bamenda">Bamenda (North West)</option>
                      <option value="Bafoussam">Bafoussam (West)</option>
                      <option value="Limbe">Limbe (South West)</option>
                      <option value="Garoua">Garoua (North)</option>
                      <option value="Maroua">Maroua (Far North)</option>
                      <option value="Buea">Buea (South West)</option>
                      <option value="International">International Diaspora</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60 flex items-center">
                      <Lock size={12} className="mr-1.5" /> Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-white border border-brand-primary/15 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">
                    I want to use KamerStyle as:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                        role === 'buyer'
                          ? 'border-brand-accent bg-brand-accent/10 font-semibold text-brand-primary'
                          : 'border-brand-primary/15 bg-white text-brand-primary/70'
                      }`}
                    >
                      🛍️ Fashion Buyer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('seller')}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                        role === 'seller'
                          ? 'border-brand-accent bg-brand-accent/10 font-semibold text-brand-primary'
                          : 'border-brand-primary/15 bg-white text-brand-primary/70'
                      }`}
                    >
                      👑 Seller / Designer
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-accent text-brand-primary hover:bg-brand-accent/90 font-bold py-3.5 px-4 rounded-lg text-xs uppercase tracking-widest transition-all shadow-md mt-2 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-block animate-spin">⏳</span>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <CheckCircle2 size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Security Guarantee */}
            <div className="mt-6 pt-4 border-t border-brand-primary/10 flex items-center justify-center space-x-2 text-[10px] text-brand-primary/50 uppercase tracking-widest">
              <ShieldCheck size={12} className="text-green-600" />
              <span>Verified Cameroon Escrow & Safe WhatsApp Connect</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
