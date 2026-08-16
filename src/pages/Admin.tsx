import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Package, 
  Users, 
  MessageSquare, 
  DollarSign, 
  TrendingUp, 
  Trash2, 
  Edit3, 
  Check, 
  Sparkles, 
  Search, 
  Filter, 
  PlusCircle, 
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export default function Admin() {
  const { 
    products, 
    deleteProduct, 
    updateProduct, 
    resetToInitialProducts, 
    formatPrice, 
    user, 
    isAdmin, 
    setAdminUser,
    threads,
    openChatForProduct,
    openAiSupportChat,
    contactInfo 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'listings' | 'sellers' | 'messages' | 'analytics'>('listings');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editName, setEditName] = useState<string>('');

  // Calculate platform metrics
  const totalCatalogValue = products.reduce((sum, p) => sum + p.price, 0);
  const totalListings = products.length;
  const uniqueSellers = Array.from(new Set(products.map(p => p.seller.name)));
  const totalInquiries = threads.length;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.regionOrigin && p.regionOrigin.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleStartEdit = (p: Product) => {
    setEditingProduct(p);
    setEditPrice(p.price);
    setEditName(p.name);
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      name: editName.trim() || editingProduct.name,
      price: Number(editPrice) || editingProduct.price
    });
    setEditingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-brand-primary via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-brand-accent/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-brand-accent text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={18} />
              <span>Executive Master Administration</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              KamerStyle Marketplace Control Center
            </h1>
            <p className="text-xs text-white/70 max-w-xl">
              Administrator: <strong>Simon Tangu</strong> ({contactInfo.phone} / {contactInfo.email}).
              Manage all Cameroon fashion listings, monitor buyer-seller chats, and verify designer ateliers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isAdmin ? (
              <button
                onClick={setAdminUser}
                className="bg-brand-accent text-brand-primary px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md hover:bg-brand-accent/90 transition-all cursor-pointer"
              >
                Switch to Simon Tangu (Admin Mode)
              </button>
            ) : (
              <div className="bg-white/10 px-4 py-2 rounded-xl text-xs text-brand-accent font-bold flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Admin Mode Active</span>
              </div>
            )}

            <button
              onClick={resetToInitialProducts}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
              title="Reset initial catalog items"
            >
              <RefreshCw size={14} />
              <span>Reset Demo Catalog</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-brand-primary/10 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-brand-primary/60">
            <span className="text-[10px] uppercase tracking-widest font-bold">Catalog Value</span>
            <DollarSign size={18} className="text-brand-accent" />
          </div>
          <p className="text-2xl font-serif font-bold text-brand-primary">{formatPrice(totalCatalogValue)}</p>
          <span className="text-[10px] text-green-600 font-bold">● Active Cameroonian Dressings</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-primary/10 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-brand-primary/60">
            <span className="text-[10px] uppercase tracking-widest font-bold">Total Listings</span>
            <Package size={18} className="text-brand-accent" />
          </div>
          <p className="text-2xl font-serif font-bold text-brand-primary">{totalListings}</p>
          <span className="text-[10px] text-brand-primary/60">Across 6 Fashion Categories</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-primary/10 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-brand-primary/60">
            <span className="text-[10px] uppercase tracking-widest font-bold">Verified Designers</span>
            <Users size={18} className="text-brand-accent" />
          </div>
          <p className="text-2xl font-serif font-bold text-brand-primary">{uniqueSellers.length}</p>
          <span className="text-[10px] text-brand-primary/60">Douala, Bamenda, Yaoundé, Maroua</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-primary/10 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-brand-primary/60">
            <span className="text-[10px] uppercase tracking-widest font-bold">Chat Threads</span>
            <MessageSquare size={18} className="text-brand-accent" />
          </div>
          <p className="text-2xl font-serif font-bold text-brand-primary">{totalInquiries}</p>
          <span className="text-[10px] text-green-600 font-bold">● In-App & AI Support Threads</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex space-x-2 border-b border-brand-primary/10 pb-2">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
            activeTab === 'listings'
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-brand-primary/60 hover:text-brand-primary hover:bg-brand-bg'
          }`}
        >
          All Listings ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('sellers')}
          className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
            activeTab === 'sellers'
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-brand-primary/60 hover:text-brand-primary hover:bg-brand-bg'
          }`}
        >
          Designers & Ateliers ({uniqueSellers.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
            activeTab === 'messages'
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-brand-primary/60 hover:text-brand-primary hover:bg-brand-bg'
          }`}
        >
          Chat Threads ({threads.length})
        </button>
      </div>

      {/* TAB 1: LISTINGS MANAGEMENT */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-brand-primary/10 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-primary/40" />
              <input
                type="text"
                placeholder="Search dressing title, designer, region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-brand-bg/50 border border-brand-primary/15 rounded-xl pl-10 pr-4 py-2 text-xs text-brand-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-brand-bg/50 border border-brand-primary/15 rounded-xl px-3 py-2 text-xs text-brand-primary focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Traditional">Traditional</option>
                <option value="Modern">Modern</option>
                <option value="Bridal">Bridal</option>
                <option value="Bespoke Men">Bespoke Men</option>
                <option value="Accessories">Accessories</option>
                <option value="Shoes">Shoes</option>
              </select>

              <Link
                to="/sell"
                className="bg-brand-accent hover:bg-brand-accent/90 text-brand-primary px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center space-x-1.5 shadow-xs whitespace-nowrap"
              >
                <PlusCircle size={14} />
                <span>+ Add Dressing</span>
              </Link>
            </div>
          </div>

          {/* Edit Modal (if editing) */}
          {editingProduct && (
            <div className="bg-brand-bg/90 border-2 border-brand-accent p-5 rounded-2xl space-y-4 shadow-lg">
              <h4 className="font-serif font-bold text-sm text-brand-primary">
                Quick Edit: {editingProduct.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">Title</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white border border-brand-primary/20 rounded-lg p-2 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">Price (FCFA)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full bg-white border border-brand-primary/20 rounded-lg p-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>
              <div className="flex space-x-2 justify-end">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-3 py-1.5 text-xs text-brand-primary/60 hover:text-brand-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-brand-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-accent hover:text-brand-primary transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Listings Table */}
          <div className="bg-white rounded-2xl border border-brand-primary/10 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-bg/80 border-b border-brand-primary/10 text-brand-primary/60 uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Dressing</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price (FCFA)</th>
                    <th className="py-3.5 px-4">Seller / Atelier</th>
                    <th className="py-3.5 px-4">Region</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-primary/5">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-brand-bg/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-11 h-14 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-brand-primary truncate max-w-[200px]">{p.name}</p>
                            <span className="text-[10px] text-brand-primary/50">{p.condition}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="bg-brand-bg px-2 py-0.5 rounded text-[10px] font-bold text-brand-primary border border-brand-primary/10">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-serif font-bold text-brand-primary">
                        {formatPrice(p.price)}
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-brand-primary">{p.seller.name}</p>
                          <a
                            href={`https://wa.me/${p.seller.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-green-700 font-mono hover:underline block"
                          >
                            {p.seller.phone}
                          </a>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-brand-primary/70 text-[11px]">
                        {p.regionOrigin || p.seller.location}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/product/${p.id}`}
                            className="p-1.5 text-brand-primary/60 hover:text-brand-primary hover:bg-brand-bg rounded-lg"
                            title="View Dressing"
                          >
                            <Eye size={15} />
                          </Link>
                          <button
                            onClick={() => handleStartEdit(p)}
                            className="p-1.5 text-brand-primary/60 hover:text-brand-accent hover:bg-brand-bg rounded-lg cursor-pointer"
                            title="Edit Price & Name"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-brand-primary/60 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete Listing"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DESIGNERS & SELLERS DIRECTORY */}
      {activeTab === 'sellers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from(new Set(products.map((p) => p.seller.name))).map((sellerName: string) => {
            const sellerProducts = products.filter(p => p.seller.name === sellerName);
            const sample = sellerProducts[0]?.seller || {
              name: sellerName,
              location: 'Cameroon',
              phone: contactInfo.phone,
              email: contactInfo.email,
              rating: 5.0,
              salesCount: 1,
              verified: true
            };
            const totalSellerValue = sellerProducts.reduce((sum, p) => sum + p.price, 0);

            return (
              <div key={sellerName} className="bg-white p-6 rounded-2xl border border-brand-primary/10 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-primary text-brand-accent flex items-center justify-center font-serif text-lg font-bold">
                      {(sellerName || 'S').charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm text-brand-primary">{sellerName}</h3>
                      <p className="text-[10px] text-brand-primary/60 flex items-center">
                        <MapPin size={10} className="mr-1 text-brand-accent" />
                        {sample.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>

                <div className="space-y-1 text-xs text-brand-primary/80 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Phone size={13} className="text-brand-accent" />
                    <span className="font-mono">{sample.phone}</span>
                  </div>
                  {sample.email && (
                    <div className="flex items-center space-x-2">
                      <Mail size={13} className="text-brand-accent" />
                      <span className="truncate">{sample.email}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-between items-center text-xs font-semibold text-brand-primary">
                  <span>{sellerProducts.length} Live Dressings</span>
                  <span className="font-serif text-brand-accent">{formatPrice(totalSellerValue)}</span>
                </div>

                <a
                  href={`https://wa.me/${sample.phone.replace(/[^0-9]/g, '')}?text=Hello!%20This%20is%20Simon%20Tangu%20from%20KamerStyle%20Administration.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Phone size={13} />
                  <span>Contact Designer WhatsApp</span>
                </a>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: CHAT THREADS & INQUIRIES */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-brand-primary/10 shadow-xs divide-y divide-brand-primary/5">
            {threads.map((thread) => (
              <div key={thread.id} className="p-4 flex items-center justify-between hover:bg-brand-bg/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary text-brand-accent flex items-center justify-center font-bold text-xs">
                    {(thread.participantName || 'K').charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-primary">{thread.participantName}</h4>
                    <p className="text-[11px] text-brand-primary/60">{thread.lastMessage || 'Active channel'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (thread.productId) {
                        const targetProd = products.find(p => p.id === thread.productId);
                        if (targetProd) openChatForProduct(targetProd);
                      } else {
                        openAiSupportChat();
                      }
                    }}
                    className="px-3 py-1.5 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-accent hover:text-brand-primary transition-all cursor-pointer"
                  >
                    Open Thread
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
