import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  DollarSign, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ArrowUpRight, 
  Download, 
  Smartphone, 
  Building2, 
  MessageSquare, 
  Phone, 
  Edit, 
  Trash2, 
  Eye, 
  Filter, 
  Search, 
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Order, Payout, OrderStatus } from '../types';

interface SellerDashboardProps {
  onNavigateToProduct?: (productId: string) => void;
  onNavigateToSell?: () => void;
}

export default function SellerDashboard({ onNavigateToProduct, onNavigateToSell }: SellerDashboardProps) {
  const { 
    products, 
    orders, 
    payouts, 
    user, 
    isAdmin, 
    formatPrice, 
    deleteProduct, 
    updateProduct, 
    updateOrderStatus, 
    requestPayout, 
    openChatForProduct,
    contactInfo,
    activeSellerFilter,
    setActiveSellerFilter
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'payouts' | 'settings'>('overview');

  // Extract all distinct sellers from products & orders
  const allSellerNames = useMemo(() => {
    const names = new Set<string>();
    products.forEach(p => names.add(p.seller.name));
    orders.forEach(o => names.add(o.sellerName));
    if (user?.name) names.add(user.name);
    return Array.from(names);
  }, [products, orders, user]);

  // Determine current active atelier context
  const currentSellerName = activeSellerFilter === 'All' 
    ? (user?.role === 'seller' || isAdmin ? user.name : allSellerNames[0] || 'Simon Tangu Heritage Ateliers')
    : activeSellerFilter;

  // Filter listings and orders for this seller (or all if admin desires)
  const isGlobalView = activeSellerFilter === 'All' && isAdmin;

  const sellerProducts = useMemo(() => {
    if (isGlobalView) return products;
    return products.filter(p => 
      p.seller.name.toLowerCase().includes(currentSellerName.toLowerCase()) || 
      (user?.email && p.seller.email === user.email) ||
      (user?.phone && p.seller.phone === user.phone)
    );
  }, [products, currentSellerName, isGlobalView, user]);

  const sellerOrders = useMemo(() => {
    if (isGlobalView) return orders;
    return orders.filter(o => 
      o.sellerName.toLowerCase().includes(currentSellerName.toLowerCase()) ||
      (user?.phone && o.sellerPhone === user.phone)
    );
  }, [orders, currentSellerName, isGlobalView, user]);

  const sellerPayouts = useMemo(() => {
    if (isGlobalView) return payouts;
    return payouts.filter(p => p.sellerName.toLowerCase().includes(currentSellerName.toLowerCase()));
  }, [payouts, currentSellerName, isGlobalView]);

  // Financial calculations
  const totalGrossSales = sellerOrders.reduce((sum, o) => sum + o.amountPaidFcfa, 0);
  
  const escrowAvailableForPayout = sellerOrders
    .filter(o => o.escrowStatus === 'delivered')
    .reduce((sum, o) => sum + o.amountPaidFcfa, 0);

  const escrowPendingDelivery = sellerOrders
    .filter(o => o.escrowStatus === 'escrow_held' || o.escrowStatus === 'dispatched')
    .reduce((sum, o) => sum + o.amountPaidFcfa, 0);

  const totalPaidOut = sellerPayouts.reduce((sum, p) => sum + p.amountFcfa, 0);

  // Dispatch modal state
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<Order | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [agencyInput, setAgencyInput] = useState('');

  // Payout withdrawal modal state
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<'mtn_momo' | 'orange_money' | 'bank_transfer'>('mtn_momo');
  const [payoutAmount, setPayoutAmount] = useState<number>(escrowAvailableForPayout || 50000);
  const [payoutAccount, setPayoutAccount] = useState<string>(user?.phone || '+237 650 135 276');
  const [payoutAccountName, setPayoutAccountName] = useState<string>(user?.name || currentSellerName);
  const [payoutSuccessMessage, setPayoutSuccessMessage] = useState<string>('');

  // Search & Filter in tables
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Filtered Orders List
  const filteredOrders = useMemo(() => {
    return sellerOrders.filter(o => {
      const matchSearch = 
        o.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.productName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.buyerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.buyerCity.toLowerCase().includes(orderSearchQuery.toLowerCase());
      
      const matchStatus = orderStatusFilter === 'all' || o.escrowStatus === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [sellerOrders, orderSearchQuery, orderStatusFilter]);

  // Handle Dispatch Submission
  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForDispatch) return;

    updateOrderStatus(selectedOrderForDispatch.id, 'dispatched', {
      trackingNumber: trackingNumberInput || `BUCA-CMR-${Math.floor(10000 + Math.random() * 90000)}`,
      deliveryAgency: agencyInput || selectedOrderForDispatch.deliveryAgency || 'Inter-City Express Agency'
    });

    setSelectedOrderForDispatch(null);
    setTrackingNumberInput('');
  };

  // Handle Payout Request
  const handleExecutePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount <= 0) return;

    try {
      const res = await requestPayout({
        sellerName: currentSellerName,
        amountFcfa: payoutAmount,
        method: payoutMethod,
        accountNumber: payoutAccount,
        accountName: payoutAccountName
      });

      setPayoutSuccessMessage(`🎉 Payout of ${formatPrice(res.amountFcfa)} successfully routed to ${res.accountNumber} (${res.reference}).`);
      setTimeout(() => {
        setIsPayoutModalOpen(false);
        setPayoutSuccessMessage('');
      }, 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner & Atelier Switcher */}
      <div className="bg-gradient-to-r from-brand-primary via-[#241913] to-brand-primary text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-accent/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent font-serif font-bold text-xl">
                <Store size={26} />
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h1 className="font-serif font-bold text-xl sm:text-2xl text-white">
                    {currentSellerName}
                  </h1>
                  <span className="bg-brand-accent/20 text-brand-accent border border-brand-accent/40 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center space-x-1">
                    <ShieldCheck size={12} />
                    <span>Verified Atelier</span>
                  </span>
                </div>
                <p className="text-xs text-white/70">
                  KamerStyle Merchant Dashboard • Escrow Protected Sales & Payout Portal
                </p>
              </div>
            </div>
          </div>

          {/* Atelier Context Switcher & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 flex items-center space-x-2 text-xs">
              <span className="text-white/60 text-[11px] uppercase tracking-wider font-semibold">Atelier:</span>
              <select
                value={activeSellerFilter}
                onChange={(e) => setActiveSellerFilter(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="All" className="bg-brand-primary text-white">
                  {isAdmin ? '👑 Global View (All Cameroon Ateliers)' : 'My Atelier Account'}
                </option>
                {allSellerNames.map(name => (
                  <option key={name} value={name} className="bg-brand-primary text-white">
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onNavigateToSell ? onNavigateToSell() : null}
              className="bg-brand-accent hover:bg-brand-accent/90 text-brand-primary px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>+ List Dressing</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-brand-primary/10 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60">
              Total Gross Sales
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-serif font-extrabold text-2xl text-brand-primary">
              {formatPrice(totalGrossSales)}
            </h3>
            <p className="text-[11px] text-brand-primary/60 mt-1 flex items-center space-x-1">
              <span className="text-emerald-600 font-semibold">{sellerOrders.length} total orders</span>
              <span>across Cameroon</span>
            </p>
          </div>
        </div>

        {/* Ready for Payout (Delivered) */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-500/30 shadow-sm bg-gradient-to-b from-white to-emerald-50/30 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-800">
              Available for Payout
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-serif font-extrabold text-2xl text-emerald-950">
              {formatPrice(escrowAvailableForPayout)}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-emerald-700 font-medium">Escrow cleared</span>
              <button
                onClick={() => {
                  setPayoutAmount(escrowAvailableForPayout > 0 ? escrowAvailableForPayout : 50000);
                  setIsPayoutModalOpen(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Withdraw &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Locked In Escrow (Held / In Transit) */}
        <div className="bg-white p-5 rounded-2xl border border-brand-primary/10 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60">
              In Escrow Hold
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-serif font-extrabold text-2xl text-amber-950">
              {formatPrice(escrowPendingDelivery)}
            </h3>
            <p className="text-[11px] text-amber-800/80 mt-1">
              Held until buyer confirms reception
            </p>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-5 rounded-2xl border border-brand-primary/10 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60">
              Published Catalog
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-primary/5 text-brand-primary flex items-center justify-center">
              <Package size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-serif font-extrabold text-2xl text-brand-primary">
              {sellerProducts.length} <span className="text-sm font-normal text-brand-primary/60">Dressings</span>
            </h3>
            <p className="text-[11px] text-brand-primary/60 mt-1">
              Toghu, Ndop, Kaba & Accessories
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-brand-primary/15 gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 font-serif text-sm sm:text-base font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'border-b-2 border-brand-accent text-brand-primary'
              : 'text-brand-primary/50 hover:text-brand-primary'
          }`}
        >
          Atelier Overview
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 font-serif text-sm sm:text-base font-bold transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'border-b-2 border-brand-accent text-brand-primary'
              : 'text-brand-primary/50 hover:text-brand-primary'
          }`}
        >
          <span>Orders & Fulfillment</span>
          <span className="bg-brand-accent/20 text-brand-primary text-[10px] px-2 py-0.5 rounded-full font-sans font-bold">
            {sellerOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 font-serif text-sm sm:text-base font-bold transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-b-2 border-brand-accent text-brand-primary'
              : 'text-brand-primary/50 hover:text-brand-primary'
          }`}
        >
          <span>Dressing Inventory</span>
          <span className="bg-brand-primary/10 text-brand-primary text-[10px] px-2 py-0.5 rounded-full font-sans font-bold">
            {sellerProducts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`pb-3 font-serif text-sm sm:text-base font-bold transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
            activeTab === 'payouts'
              ? 'border-b-2 border-brand-accent text-brand-primary'
              : 'text-brand-primary/50 hover:text-brand-primary'
          }`}
        >
          <span>Payouts & MoMo Withdrawals</span>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-sans font-bold">
            {sellerPayouts.length}
          </span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Action & Escrow Notice */}
          <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-emerald-800/80 rounded-2xl border border-emerald-700 text-emerald-300">
                <ShieldCheck size={28} />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-white">
                  KamerStyle Escrow Protection Guarantee
                </h4>
                <p className="text-xs text-white/80 max-w-2xl leading-relaxed">
                  When clients order your traditional Toghu or ceremonial Ndop robes, funds are locked in Escrow. Once you dispatch the outfit via Bucavoyages, Finexs, or local courier and the buyer inspects the fit, funds unlock instantly to your MTN MoMo / Orange Money account.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 w-full md:w-auto">
              <button
                onClick={() => {
                  setPayoutAmount(escrowAvailableForPayout > 0 ? escrowAvailableForPayout : 50000);
                  setIsPayoutModalOpen(true);
                }}
                className="w-full md:w-auto bg-brand-accent hover:bg-brand-accent/90 text-brand-primary px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Smartphone size={15} />
                <span>Withdraw Payout</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders Stream */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-brand-primary/10 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-brand-primary/10">
                <h4 className="font-serif font-bold text-base text-brand-primary flex items-center space-x-2">
                  <ShoppingBag size={18} className="text-brand-accent" />
                  <span>Recent Client Orders & Escrow Status</span>
                </h4>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-brand-accent hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>View All ({sellerOrders.length})</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {sellerOrders.length === 0 ? (
                <div className="py-12 text-center text-brand-primary/60 text-xs">
                  No orders recorded yet for this atelier. New orders will appear here automatically.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 space-y-3">
                  {sellerOrders.slice(0, 4).map((order) => (
                    <div key={order.id} className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          className="w-12 h-14 object-cover rounded-xl border border-brand-primary/10"
                        />
                        <div>
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
                          <h5 className="font-serif font-bold text-xs text-brand-primary mt-0.5">
                            {order.productName}
                          </h5>
                          <p className="text-[11px] text-brand-primary/60">
                            Client: {order.buyerName} • {order.buyerCity}
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                        <span className="font-serif font-bold text-sm text-brand-primary">
                          {formatPrice(order.amountPaidFcfa)}
                        </span>
                        <div className="flex items-center space-x-1.5">
                          {order.escrowStatus === 'escrow_held' && (
                            <button
                              onClick={() => {
                                setSelectedOrderForDispatch(order);
                                setAgencyInput(order.deliveryAgency || 'Buca Voyages Express Agency');
                              }}
                              className="text-[10px] bg-brand-primary hover:bg-brand-primary/90 text-white font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              Dispatch Order
                            </button>
                          )}
                          {order.escrowStatus === 'dispatched' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              Confirm Delivered
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Atelier Performance & Fast Contacts */}
            <div className="space-y-6">
              {/* Atelier Card */}
              <div className="bg-white p-6 rounded-3xl border border-brand-primary/10 shadow-sm space-y-4">
                <h4 className="font-serif font-bold text-base text-brand-primary">
                  Atelier Verification & Rating
                </h4>

                <div className="p-4 bg-brand-bg rounded-2xl space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-primary/60">Quality Rating:</span>
                    <span className="font-bold text-amber-600">4.9 / 5.0 ★★★★★</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-primary/60">On-Time Dispatch:</span>
                    <span className="font-bold text-emerald-700">98.4%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-primary/60">Escrow Dispute Rate:</span>
                    <span className="font-bold text-emerald-700">0.0% (Zero Disputes)</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/50 block">
                    Atelier Support Contacts
                  </span>
                  <div className="flex items-center space-x-2 text-xs text-brand-primary/80">
                    <Phone size={14} className="text-brand-accent" />
                    <span>Executive Concierge: {contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-brand-primary/80">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Admin Supervision: Simon Tangu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS & FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-3xl border border-brand-primary/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-primary/10">
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-primary">
                Customer Orders & Escrow Tracking
              </h3>
              <p className="text-xs text-brand-primary/60">
                Manage inter-city dispatch, enter waybill tracking numbers, and trigger escrow releases.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary/40" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search order #, client, city..."
                  className="w-full bg-brand-bg border border-brand-primary/15 rounded-xl pl-8 pr-3 py-2 text-xs focus:border-brand-accent focus:outline-hidden"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-brand-bg border border-brand-primary/15 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="escrow_held">Escrow Held</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
                <option value="escrow_released">Payout Released</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-brand-primary/60 text-xs">
              No orders matched your search criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-brand-primary">
                <thead className="bg-brand-bg text-[10px] uppercase tracking-wider text-brand-primary/60 font-bold border-b border-brand-primary/10">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Order & Product</th>
                    <th className="p-3.5">Client & Destination</th>
                    <th className="p-3.5">Amount & Gateway</th>
                    <th className="p-3.5">Escrow Status</th>
                    <th className="p-3.5">Courier & Tracking</th>
                    <th className="p-3.5 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-brand-bg/40 transition-colors">
                      {/* Order info */}
                      <td className="p-3.5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={order.productImage}
                            alt={order.productName}
                            className="w-10 h-12 object-cover rounded-lg border border-brand-primary/10"
                          />
                          <div>
                            <span className="font-mono font-bold text-xs text-brand-primary block">
                              #{order.orderNumber}
                            </span>
                            <span className="font-serif font-bold text-xs line-clamp-1 max-w-[180px]">
                              {order.productName}
                            </span>
                            <span className="text-[10px] text-brand-primary/50">
                              Size: {order.size || 'Standard'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Buyer info */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <strong className="block">{order.buyerName}</strong>
                          <span className="text-[11px] text-brand-primary/70 block">{order.buyerCity}</span>
                          <span className="text-[10px] font-mono text-brand-primary/50 block">{order.buyerPhone}</span>
                        </div>
                      </td>

                      {/* Price & Gateway */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <strong className="font-serif text-sm text-brand-primary block">
                            {formatPrice(order.amountPaidFcfa)}
                          </strong>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 bg-gray-100 rounded font-bold inline-block">
                            {order.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                      </td>

                      {/* Escrow Status Badge */}
                      <td className="p-3.5">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center space-x-1 ${
                          order.escrowStatus === 'escrow_held' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          order.escrowStatus === 'dispatched' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                          order.escrowStatus === 'delivered' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          'bg-purple-100 text-purple-900 border border-purple-300'
                        }`}>
                          <span>{order.escrowStatus.replace('_', ' ')}</span>
                        </span>
                      </td>

                      {/* Logistics details */}
                      <td className="p-3.5">
                        <div className="space-y-0.5 max-w-[180px]">
                          <span className="text-[11px] font-medium block truncate">
                            {order.deliveryAgency || 'Inter-City Courier'}
                          </span>
                          {order.trackingNumber ? (
                            <span className="font-mono text-[10px] text-brand-accent font-bold block">
                              Waybill: {order.trackingNumber}
                            </span>
                          ) : (
                            <span className="text-[10px] text-brand-primary/40 italic">
                              Pending dispatch
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {order.escrowStatus === 'escrow_held' && (
                            <button
                              onClick={() => {
                                setSelectedOrderForDispatch(order);
                                setAgencyInput(order.deliveryAgency || 'Buca Voyages Express Agency');
                              }}
                              className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                            >
                              <Truck size={12} />
                              <span>Dispatch</span>
                            </button>
                          )}

                          {order.escrowStatus === 'dispatched' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                            >
                              <CheckCircle2 size={12} />
                              <span>Mark Delivered</span>
                            </button>
                          )}

                          <a
                            href={`https://wa.me/${(order.buyerPhone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${order.buyerName}! This is ${order.sellerName} regarding your KamerStyle order #${order.orderNumber} for ${order.productName}.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                            title="WhatsApp Buyer"
                          >
                            <Phone size={14} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INVENTORY & LISTINGS */}
      {activeTab === 'inventory' && (
        <div className="bg-white p-6 rounded-3xl border border-brand-primary/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-primary/10">
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-primary">
                Atelier Dressing Inventory
              </h3>
              <p className="text-xs text-brand-primary/60">
                Manage your authentic Cameroonian dressings, sizes, asking prices, and fabric details.
              </p>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary/40" />
                <input
                  type="text"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  placeholder="Search dressing name..."
                  className="w-full bg-brand-bg border border-brand-primary/15 rounded-xl pl-8 pr-3 py-2 text-xs focus:border-brand-accent focus:outline-hidden"
                />
              </div>

              <button
                onClick={() => onNavigateToSell ? onNavigateToSell() : null}
                className="bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
              >
                <Plus size={14} className="text-brand-accent" />
                <span>Add Dressing</span>
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sellerProducts
              .filter(p => p.name.toLowerCase().includes(productSearchQuery.toLowerCase()))
              .map((product) => (
                <div 
                  key={product.id} 
                  className="bg-brand-bg/60 rounded-2xl border border-brand-primary/10 overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative aspect-4/5 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h5 className="font-serif font-bold text-xs text-brand-primary line-clamp-2">
                        {product.name}
                      </h5>
                      <span className="font-serif font-extrabold text-sm text-brand-primary block mt-1">
                        {formatPrice(product.price)}
                      </span>
                      <p className="text-[10px] text-brand-primary/60 line-clamp-1 mt-0.5">
                        Region: {product.regionOrigin || 'Cameroon'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-brand-primary/10 flex items-center justify-between">
                      <button
                        onClick={() => onNavigateToProduct ? onNavigateToProduct(product.id) : null}
                        className="text-xs font-bold text-brand-accent hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove "${product.name}" from your catalog?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Dressing"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: PAYOUTS & WITHDRAWALS */}
      {activeTab === 'payouts' && (
        <div className="space-y-6">
          {/* Withdrawal Trigger Box */}
          <div className="bg-white p-6 rounded-3xl border border-brand-primary/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60 block">
                Available Escrow Settlement Balance
              </span>
              <h2 className="font-serif font-extrabold text-3xl text-emerald-950 mt-1">
                {formatPrice(escrowAvailableForPayout)}
              </h2>
              <p className="text-xs text-brand-primary/70 mt-1">
                Funds released immediately upon delivery confirmation. Direct payout to MTN MoMo, Orange Money, or Cameroon bank accounts.
              </p>
            </div>

            <button
              onClick={() => {
                setPayoutAmount(escrowAvailableForPayout > 0 ? escrowAvailableForPayout : 50000);
                setIsPayoutModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Smartphone size={16} />
              <span>Initiate Instant MoMo / OM Payout</span>
            </button>
          </div>

          {/* Payout History Logs */}
          <div className="bg-white p-6 rounded-3xl border border-brand-primary/10 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-base text-brand-primary">
              Payout & Settlement Records
            </h4>

            {sellerPayouts.length === 0 ? (
              <div className="py-12 text-center text-brand-primary/60 text-xs">
                No past payout records found. Withdrawals will log here with automated telecom reference codes.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-brand-primary">
                  <thead className="bg-brand-bg text-[10px] uppercase tracking-wider text-brand-primary/60 font-bold border-b border-brand-primary/10">
                    <tr>
                      <th className="p-3.5 rounded-l-xl">Payout Reference</th>
                      <th className="p-3.5">Destination Account</th>
                      <th className="p-3.5">Method</th>
                      <th className="p-3.5">Amount (FCFA)</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 rounded-r-xl">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sellerPayouts.map((payout) => (
                      <tr key={payout.id}>
                        <td className="p-3.5 font-mono font-bold text-brand-accent">
                          {payout.reference}
                        </td>
                        <td className="p-3.5">
                          <strong className="block">{payout.accountName}</strong>
                          <span className="font-mono text-[11px] text-brand-primary/60">{payout.accountNumber}</span>
                        </td>
                        <td className="p-3.5 uppercase font-bold text-[10px]">
                          {payout.method.replace('_', ' ')}
                        </td>
                        <td className="p-3.5 font-serif font-bold text-sm text-emerald-900">
                          {formatPrice(payout.amountFcfa)}
                        </td>
                        <td className="p-3.5">
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase">
                            {payout.status} ✓
                          </span>
                        </td>
                        <td className="p-3.5 text-brand-primary/60">
                          {payout.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DISPATCH LOGISTICS MODAL */}
      <AnimatePresence>
        {selectedOrderForDispatch && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-brand-primary/15 space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-brand-primary/10">
                <h3 className="font-serif font-bold text-base text-brand-primary flex items-center space-x-2">
                  <Truck size={18} className="text-brand-accent" />
                  <span>Dispatch Order #{selectedOrderForDispatch.orderNumber}</span>
                </h3>
                <button
                  onClick={() => setSelectedOrderForDispatch(null)}
                  className="text-brand-primary/60 hover:text-brand-primary p-1 rounded-full cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleConfirmDispatch} className="space-y-4 text-xs">
                <div>
                  <label className="uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                    Inter-City Travel Agency / Courier
                  </label>
                  <input
                    type="text"
                    required
                    value={agencyInput}
                    onChange={(e) => setAgencyInput(e.target.value)}
                    placeholder="e.g. Buca Voyages Express / Finexs / Amour Mezam"
                    className="w-full bg-brand-bg border border-brand-primary/15 rounded-xl px-3 py-2.5 font-medium focus:border-brand-accent focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                    Waybill Tracking / Agency Slip Number
                  </label>
                  <input
                    type="text"
                    required
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    placeholder="e.g. BUCA-DLA-84920"
                    className="w-full bg-brand-bg border border-brand-primary/15 rounded-xl px-3 py-2.5 font-mono font-bold focus:border-brand-accent focus:outline-hidden"
                  />
                </div>

                <div className="p-3 bg-brand-bg rounded-xl text-[11px] text-brand-primary/70">
                  Destination: <strong>{selectedOrderForDispatch.buyerCity}</strong> ({selectedOrderForDispatch.buyerName})
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForDispatch(null)}
                    className="px-4 py-2 rounded-xl border border-brand-primary/20 font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white px-5 py-2 rounded-xl font-bold uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
                  >
                    <Truck size={14} className="text-brand-accent" />
                    <span>Confirm Dispatch</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WITHDRAWAL / PAYOUT MODAL */}
      <AnimatePresence>
        {isPayoutModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-brand-primary/15 space-y-5"
            >
              <div className="flex justify-between items-center pb-2 border-b border-brand-primary/10">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-brand-primary">
                      Request Escrow Settlement Payout
                    </h3>
                    <p className="text-[10px] text-brand-primary/60">
                      Instant disbursement to Cameroon telecom & bank channels
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="text-brand-primary/60 hover:text-brand-primary p-1 rounded-full cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {payoutSuccessMessage ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                  <h4 className="font-serif font-bold text-emerald-950 text-base">
                    Disbursement Executed!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    {payoutSuccessMessage}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleExecutePayout} className="space-y-4 text-xs">
                  {/* Method Selection */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('mtn_momo')}
                      className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        payoutMethod === 'mtn_momo'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-900 ring-2 ring-yellow-400/20'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      MTN MoMo
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayoutMethod('orange_money')}
                      className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        payoutMethod === 'orange_money'
                          ? 'border-orange-500 bg-orange-50 text-orange-900 ring-2 ring-orange-400/20'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Orange Money
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayoutMethod('bank_transfer')}
                      className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        payoutMethod === 'bank_transfer'
                          ? 'border-brand-accent bg-brand-accent/10 text-brand-primary ring-2 ring-brand-accent/20'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      Bank / UBA
                    </button>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                      Withdrawal Amount in FCFA
                    </label>
                    <input
                      type="number"
                      required
                      min={5000}
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(Number(e.target.value))}
                      className="w-full bg-brand-bg border border-brand-primary/15 rounded-xl px-3.5 py-2.5 font-serif font-extrabold text-lg text-brand-primary focus:border-brand-accent focus:outline-hidden"
                    />
                  </div>

                  {/* Account number */}
                  <div>
                    <label className="uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                      {payoutMethod === 'bank_transfer' ? 'RIB / Bank Account Number' : 'Mobile Money Phone (+237)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={payoutAccount}
                      onChange={(e) => setPayoutAccount(e.target.value)}
                      placeholder="+237 6XX XXX XXX"
                      className="w-full bg-brand-bg border border-brand-primary/15 rounded-xl px-3.5 py-2.5 font-mono font-bold focus:border-brand-accent focus:outline-hidden"
                    />
                  </div>

                  {/* Account Name */}
                  <div>
                    <label className="uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                      Account Registered Name (For Verification)
                    </label>
                    <input
                      type="text"
                      required
                      value={payoutAccountName}
                      onChange={(e) => setPayoutAccountName(e.target.value)}
                      placeholder="e.g. Simon Tangu"
                      className="w-full bg-brand-bg border border-brand-primary/15 rounded-xl px-3.5 py-2.5 font-medium focus:border-brand-accent focus:outline-hidden"
                    />
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-900 flex items-center space-x-2">
                    <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>0% transaction fee. Payout is processed instantly to your Cameroon mobile wallet.</span>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPayoutModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-brand-primary/20 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-md cursor-pointer"
                    >
                      <CheckCircle2 size={15} />
                      <span>Confirm & Disburse</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
