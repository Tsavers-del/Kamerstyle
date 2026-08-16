import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Heart, 
  PlusCircle, 
  CheckCircle2, 
  Key, 
  LogOut, 
  ShoppingBag, 
  Store, 
  Truck, 
  Clock,
  Printer
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import RecentlyViewed from '../components/RecentlyViewed';

export default function Account() {
  const { 
    user, 
    logout, 
    openAuthModal, 
    products, 
    orders,
    formatPrice, 
    wishlist, 
    contactInfo, 
    updateUser,
    updateOrderStatus 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'listings'>('orders');

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center text-brand-accent">
          <ShieldCheck size={40} />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-3xl md:text-4xl font-serif text-brand-primary">Sign in to KamerStyle Account</h1>
          <p className="text-sm text-brand-primary/60">
            Access your saved Cameroonian dressings, track orders in escrow, manage atelier sales, and enjoy full buyer protection.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => openAuthModal('login')}
            className="bg-brand-primary text-brand-bg px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold shadow-lg hover:bg-brand-primary/90 transition-all cursor-pointer"
          >
            Sign In to Account
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="border border-brand-primary/20 text-brand-primary px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-primary/5 transition-all cursor-pointer"
          >
            Create Free Account
          </button>
        </div>
      </div>
    );
  }

  // Filter orders placed by this user (or show all demo buyer orders if matching)
  const myPurchases = orders.filter(
    o => o.buyerEmail === user.email || o.buyerPhone === user.phone || o.buyerId === user.id || user.role === 'buyer'
  );

  // Filter listings belonging to this user or demo owner
  const myListings = products.filter(
    p => p.seller.phone === user.phone || p.seller.email === user.email || (user.email === contactInfo.email && p.seller.phone === contactInfo.phone)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Top Profile Summary Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-brand-primary/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-brand-primary text-brand-accent flex items-center justify-center font-serif text-3xl font-bold shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-primary">{user.name}</h1>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <CheckCircle2 size={12} />
                <span>Verified {user.role}</span>
              </span>
            </div>
            <p className="text-xs text-brand-primary/60 flex items-center space-x-2">
              <span>{user.email}</span>
              <span>•</span>
              <span>{user.phone}</span>
              <span>•</span>
              <span>📍 {user.location}</span>
            </p>
            <p className="text-[10px] text-brand-primary/40 uppercase tracking-widest">
              Member since {user.joinedDate} • Escrow Protected
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Link
            to="/seller-dashboard"
            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-5 py-3 rounded-xl text-xs uppercase tracking-wider font-bold shadow-sm transition-all flex items-center justify-center space-x-1.5"
          >
            <Store size={15} className="text-brand-accent" />
            <span>Open Seller Dashboard</span>
          </Link>
          <Link
            to="/sell"
            className="bg-brand-accent hover:bg-brand-accent/90 text-brand-primary px-5 py-3 rounded-xl text-xs uppercase tracking-wider font-bold shadow-sm transition-all flex items-center justify-center space-x-1.5"
          >
            <PlusCircle size={15} />
            <span>+ Sell Item</span>
          </Link>
          <button
            onClick={logout}
            className="p-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex border-b border-brand-primary/10 space-x-8 text-xs uppercase tracking-widest font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 transition-all relative cursor-pointer ${
            activeTab === 'orders'
              ? 'text-brand-primary font-extrabold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-accent'
              : 'text-brand-primary/40 hover:text-brand-primary'
          }`}
        >
          My Orders & Escrow ({myPurchases.length})
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-4 transition-all relative cursor-pointer ${
            activeTab === 'listings'
              ? 'text-brand-primary font-extrabold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-accent'
              : 'text-brand-primary/40 hover:text-brand-primary'
          }`}
        >
          My Listed Dressings ({myListings.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 transition-all relative cursor-pointer ${
            activeTab === 'profile'
              ? 'text-brand-primary font-extrabold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-accent'
              : 'text-brand-primary/40 hover:text-brand-primary'
          }`}
        >
          Profile & Security
        </button>
      </div>

      {/* Tab 1: Orders & Escrow */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-xs text-emerald-900">
              <ShieldCheck size={24} className="text-emerald-600 flex-shrink-0" />
              <div>
                <strong className="block">Escrow Protection on All Orders</strong>
                <span className="text-[11px] text-emerald-800/80">
                  Your payments are safely held until you confirm package arrival and verify size fitting.
                </span>
              </div>
            </div>
            <Link
              to="/shop"
              className="bg-brand-primary text-white text-[11px] uppercase tracking-wider font-bold px-4 py-2 rounded-xl whitespace-nowrap"
            >
              Explore Shop
            </Link>
          </div>

          {myPurchases.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-brand-primary/10">
              <div className="w-16 h-16 rounded-full bg-brand-primary/5 mx-auto flex items-center justify-center text-brand-primary/30">
                <ShoppingBag size={32} />
              </div>
              <h3 className="font-serif text-2xl text-brand-primary">No orders placed yet</h3>
              <p className="text-xs text-brand-primary/60 max-w-sm mx-auto">
                Explore our authentic Toghu, Ndop, and Kaba collections and checkout securely with MTN MoMo or Orange Money.
              </p>
              <Link
                to="/shop"
                className="inline-block bg-brand-primary text-white px-8 py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-primary/90 transition-all"
              >
                Browse Collections
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myPurchases.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 border border-brand-primary/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={order.productImage}
                      alt={order.productName}
                      className="w-16 h-20 object-cover rounded-xl border border-brand-primary/10"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-brand-primary">
                          #{order.orderNumber}
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          order.escrowStatus === 'escrow_held' ? 'bg-amber-100 text-amber-800' :
                          order.escrowStatus === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                          order.escrowStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {order.escrowStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-brand-primary">
                        {order.productName}
                      </h4>
                      <p className="text-[11px] text-brand-primary/60">
                        Atelier: <strong>{order.sellerName}</strong> • Size: {order.size || 'Standard'}
                      </p>
                      <p className="text-[10px] text-brand-primary/50 font-mono">
                        Destination: {order.buyerCity} • Courier: {order.deliveryAgency || 'Buca Voyages'}
                        {order.trackingNumber && ` • Tracking: ${order.trackingNumber}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                    <span className="font-serif font-extrabold text-base text-brand-primary">
                      {formatPrice(order.amountPaidFcfa)}
                    </span>
                    <div className="flex items-center space-x-2">
                      {order.escrowStatus === 'dispatched' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Confirm Received
                        </button>
                      )}
                      <a
                        href={`https://wa.me/${(order.sellerPhone || contactInfo.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${order.sellerName}! Inquiring on my order #${order.orderNumber} (${order.productName}).`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center space-x-1"
                      >
                        <Phone size={13} />
                        <span>WhatsApp Seller</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Profile & Security */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-brand-primary/10 space-y-4">
              <h3 className="font-serif text-lg text-brand-primary font-semibold">Personal & Business Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/50 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => updateUser({ name: e.target.value })}
                    className="w-full bg-brand-bg/50 border border-brand-primary/10 rounded-xl p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/50 block mb-1">Primary WhatsApp Phone</label>
                  <input
                    type="text"
                    value={user.phone}
                    onChange={(e) => updateUser({ phone: e.target.value })}
                    className="w-full bg-brand-bg/50 border border-brand-primary/10 rounded-xl p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/50 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => updateUser({ email: e.target.value })}
                    className="w-full bg-brand-bg/50 border border-brand-primary/10 rounded-xl p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/50 block mb-1">Region / City</label>
                  <input
                    type="text"
                    value={user.location}
                    onChange={(e) => updateUser({ location: e.target.value })}
                    className="w-full bg-brand-bg/50 border border-brand-primary/10 rounded-xl p-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => alert("Profile updated successfully!")}
                  className="bg-brand-primary text-brand-bg px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-primary/90 transition-all cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-800 font-serif font-bold text-base">
                <ShieldCheck size={20} />
                <span>Security & Escrow Guarantee</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed font-light">
                All transactions facilitated through KamerStyle are protected under our Cameroonian Buyer & Seller Escrow Protection. Sellers receive funds only after buyers verify authenticity and condition upon nationwide delivery.
              </p>
              <div className="text-[10px] uppercase tracking-widest text-emerald-800 font-bold">
                256-bit Encrypted Identity Verification Active
              </div>
            </div>
          </div>

          {/* Quick Metrics & Support sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-brand-primary/10 space-y-4">
              <h3 className="font-serif text-lg text-brand-primary font-semibold">Account Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 text-xs">
                  <span className="text-brand-primary/60">Wishlist Items</span>
                  <span className="font-bold text-brand-primary">{wishlist.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 text-xs">
                  <span className="text-brand-primary/60">Orders In Escrow</span>
                  <span className="font-bold text-brand-primary">{myPurchases.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 text-xs">
                  <span className="text-brand-primary/60">Active Listings</span>
                  <span className="font-bold text-brand-primary">{myListings.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 text-xs">
                  <span className="text-brand-primary/60">Trust Score</span>
                  <span className="font-bold text-green-600">100% Verified</span>
                </div>
              </div>
            </div>

            <div className="bg-brand-primary text-brand-bg p-6 rounded-3xl space-y-3">
              <h4 className="font-serif text-lg">Need Direct Assistance?</h4>
              <p className="text-xs opacity-70 leading-relaxed">
                Connect directly with Executive Simon Tangu for custom tailoring inquiries or dispute mediation.
              </p>
              <a
                href={contactInfo.whatsappUrl(`Hello Simon Tangu! I am contacting you from my verified KamerStyle account (${user.name}).`)}
                target="_blank"
                rel="noreferrer"
                className="inline-block w-full text-center bg-brand-accent text-brand-primary py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-accent/90 transition-all"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: My Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-lg text-brand-primary">
              My Listed Fashion Items ({myListings.length})
            </h3>
            <Link
              to="/seller-dashboard"
              className="text-xs font-bold text-brand-accent hover:underline flex items-center space-x-1"
            >
              <span>Open Full Seller Dashboard &rarr;</span>
            </Link>
          </div>

          {myListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-brand-primary/10">
              <div className="w-16 h-16 rounded-full bg-brand-primary/5 mx-auto flex items-center justify-center text-brand-primary/30">
                <Package size={32} />
              </div>
              <h3 className="font-serif text-2xl text-brand-primary">No dressings listed yet</h3>
              <p className="text-xs text-brand-primary/60 max-w-sm mx-auto">
                Start selling your Cameroonian traditional outfits, Ankara gowns, wedding dressings, or shoes to buyers across Cameroon.
              </p>
              <Link
                to="/sell"
                className="inline-block bg-brand-accent text-brand-primary px-8 py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-accent/90 transition-all"
              >
                + List Your First Dressing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden border border-brand-primary/10 shadow-xs flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 bg-brand-primary text-white text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded">
                      {product.condition}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[9px] uppercase tracking-widest text-brand-accent font-bold">
                      {product.category}
                    </span>
                    <h4 className="font-serif font-bold text-brand-primary">{product.name}</h4>
                    <p className="text-sm font-semibold text-brand-primary">{formatPrice(product.price)}</p>
                    <p className="text-[10px] text-brand-primary/60">📍 {product.seller.location}</p>
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                      <Link
                        to={`/product/${product.id}`}
                        className="text-[10px] uppercase tracking-wider font-bold text-brand-accent hover:underline"
                      >
                        View Public Page &rarr;
                      </Link>
                      <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded">
                        Active Live
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recently Viewed Shelf */}
      <RecentlyViewed />
    </div>
  );
}
