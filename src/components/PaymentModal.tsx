import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Truck, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  MessageSquare, 
  Printer, 
  Sparkles,
  Phone,
  AlertCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, Order } from '../types';

export default function PaymentModal() {
  const { 
    isPaymentModalOpen, 
    closeCheckout, 
    checkoutProduct, 
    checkoutSize, 
    formatPrice, 
    convertPrice,
    currency,
    user, 
    createOrder,
    openChatForProduct,
    contactInfo
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mtn_momo');

  // Customer Delivery Info
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '+237 ');
  const [buyerCity, setBuyerCity] = useState(user?.location || 'Douala (Akwa Hub)');
  const [deliveryAddress, setDeliveryAddress] = useState('Boulevard de la Liberté / Home Delivery');
  const [deliveryAgency, setDeliveryAgency] = useState('Buca Voyages Express Agency');
  const [notes, setNotes] = useState('');
  const [sizeChoice, setSizeChoice] = useState(checkoutSize || 'Standard');

  // Payment Form Inputs
  const [momoNumber, setMomoNumber] = useState(user?.phone || '+237 670 123 456');
  const [omNumber, setOmNumber] = useState(user?.phone || '+237 690 123 456');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState(user?.name || 'SIMON TANGU');

  // Processing state
  const [processingStatus, setProcessingStatus] = useState<string>('Initiating secure Cameroon banking channel...');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isPaymentModalOpen || !checkoutProduct) return null;

  const cameroonCities = [
    'Douala (Akwa / Bonanjo Hub)',
    'Yaoundé (Bastos / Centre Hub)',
    'Bamenda (Commercial Ave / Up Station)',
    'Bafoussam (Marché A / Centre)',
    'Limbe & Buea (Fako Coastal Hub)',
    'Kribi (Ocean Resort Hub)',
    'Garoua & Maroua (Sahelian Hub)',
    'Ngaoundéré (Adamaoua Depot)',
    'Ebolowa & Bertoua',
    'International Diaspora (DHL / FedEx Express)'
  ];

  const travelAgencies = [
    'Buca Voyages Express Agency',
    'Finexs Voyages Agency',
    'Touristiqu Express VIP',
    'General Express Voyages',
    'Amour Mezam Travel (Bamenda)',
    'Moghamo Express Travel',
    'Guaranti Express',
    'Local Courier Home Delivery (City-Specific)',
    'DHL / FedEx Worldwide Air Courier'
  ];

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      setErrorMsg('Please enter your full recipient name.');
      return;
    }
    if (!buyerPhone.trim() || buyerPhone.length < 8) {
      setErrorMsg('Please provide a valid Cameroon phone number for courier notifications.');
      return;
    }
    setErrorMsg('');
    setStep('payment');
  };

  const handleExecutePayment = async () => {
    setErrorMsg('');
    setStep('processing');
    setProcessingStatus(
      selectedMethod === 'mtn_momo'
        ? 'Sending USSD approval prompt (*126#) to your MTN Mobile Money device...'
        : selectedMethod === 'orange_money'
        ? 'Connecting with Orange Money Cameroon server for authorization...'
        : selectedMethod === 'card'
        ? 'Processing 3D-Secure Visa/Mastercard payment gateway...'
        : 'Generating Escrow Bank Wire reference...'
    );

    // Simulate realistic mobile money / card network handshake
    setTimeout(async () => {
      setProcessingStatus('Verifying Escrow deposit & locking funds safely...');
      
      setTimeout(async () => {
        try {
          const paymentPhoneOrCard = 
            selectedMethod === 'mtn_momo' 
              ? momoNumber 
              : selectedMethod === 'orange_money' 
              ? omNumber 
              : selectedMethod === 'card' 
              ? `Visa ending in ${cardNumber.slice(-4)}` 
              : 'Direct Wire Reference';

          const newOrder = await createOrder({
            product: checkoutProduct,
            buyerName,
            buyerEmail: buyerEmail || 'customer@kamerstyle.com',
            buyerPhone,
            buyerCity,
            deliveryAddress,
            deliveryAgency,
            size: sizeChoice || checkoutSize || 'Standard',
            notes,
            paymentMethod: selectedMethod,
            paymentPhoneOrCard
          });

          setCreatedOrder(newOrder);
          setStep('success');
        } catch (err) {
          console.error('Order creation error:', err);
          setErrorMsg('An error occurred while confirming transaction. Please try again.');
          setStep('payment');
        }
      }, 1500);
    }, 1800);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-brand-bg w-full max-w-3xl rounded-3xl shadow-2xl border border-brand-primary/15 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="bg-brand-primary text-white p-5 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-accent text-brand-primary flex items-center justify-center font-bold text-lg font-serif">
              KS
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif font-bold text-base sm:text-lg">KamerStyle Escrow Checkout</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  100% Escrow Protected
                </span>
              </div>
              <p className="text-[11px] text-white/70">
                Cameroon Mobile Money (MoMo / OM) & Global Card Payment Gateway
              </p>
            </div>
          </div>

          <button
            onClick={closeCheckout}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Product Snapshot Bar */}
        <div className="bg-white px-6 py-3.5 border-b border-brand-primary/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <img
              src={checkoutProduct.image}
              alt={checkoutProduct.name}
              className="w-12 h-14 object-cover rounded-lg border border-brand-primary/10"
            />
            <div>
              <h4 className="font-serif font-bold text-sm text-brand-primary line-clamp-1">
                {checkoutProduct.name}
              </h4>
              <p className="text-[11px] text-brand-primary/60 flex items-center space-x-2">
                <span>Category: {checkoutProduct.category}</span>
                <span>•</span>
                <span>Atelier: {checkoutProduct.seller.name}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-widest text-brand-primary/50 block">
              Total Amount ({currency})
            </span>
            <span className="font-serif font-extrabold text-lg text-brand-primary">
              {formatPrice(checkoutProduct.price)}
            </span>
          </div>
        </div>

        {/* Body Steps Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: DELIVERY & MEASUREMENT DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-brand-primary/10">
                <span className="text-xs uppercase tracking-widest font-bold text-brand-primary flex items-center space-x-1.5">
                  <Truck size={14} className="text-brand-accent" />
                  <span>Step 1: Recipient & Delivery Logistics</span>
                </span>
                <span className="text-[11px] text-brand-primary/60 font-semibold">1 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Marie Claire Fotso"
                    className="w-full bg-white border border-brand-primary/15 rounded-xl px-3.5 py-2.5 text-sm focus:border-brand-accent focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                    WhatsApp Phone for Courier Dispatch *
                  </label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+237 6XX XXX XXX"
                    className="w-full bg-white border border-brand-primary/15 rounded-xl px-3.5 py-2.5 text-sm focus:border-brand-accent focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                    Email Address (For PDF Receipt)
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-white border border-brand-primary/15 rounded-xl px-3.5 py-2.5 text-sm focus:border-brand-accent focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                    Destination Region / City *
                  </label>
                  <select
                    value={buyerCity}
                    onChange={(e) => setBuyerCity(e.target.value)}
                    className="w-full bg-white border border-brand-primary/15 rounded-xl px-3.5 py-2.5 text-sm focus:border-brand-accent focus:outline-hidden"
                  >
                    {cameroonCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                    Preferred Inter-City Agency / Courier
                  </label>
                  <select
                    value={deliveryAgency}
                    onChange={(e) => setDeliveryAgency(e.target.value)}
                    className="w-full bg-white border border-brand-primary/15 rounded-xl px-3.5 py-2.5 text-sm focus:border-brand-accent focus:outline-hidden"
                  >
                    {travelAgencies.map((agency) => (
                      <option key={agency} value={agency}>{agency}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                    Delivery Address / Drop-Off Point
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. Bastos behind embassy, or Pick-up at Bucavoyages Agency"
                    className="w-full bg-white border border-brand-primary/15 rounded-xl px-3.5 py-2.5 text-sm focus:border-brand-accent focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Sizing & Custom tailoring note */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                    Selected Size / Fit
                  </label>
                  <select
                    value={sizeChoice}
                    onChange={(e) => setSizeChoice(e.target.value)}
                    className="w-full bg-white border border-brand-primary/15 rounded-xl px-3.5 py-2.5 text-sm focus:border-brand-accent focus:outline-hidden"
                  >
                    {(checkoutProduct.sizes || ['S', 'M', 'L', 'XL', 'Custom Fitted']).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                    Custom Fitting Measurements / Special Request
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Chest: 104cm, Waist: 86cm, Height: 180cm, Traditional Wedding"
                    className="w-full bg-white border border-brand-primary/15 rounded-xl px-3.5 py-2.5 text-sm focus:border-brand-accent focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Escrow Guarantee note */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-xs text-emerald-900">
                <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">100% KamerStyle Escrow Buyer Protection</span>
                  <p className="text-emerald-800/80 text-[11px] leading-relaxed">
                    Your payment will be securely held in our escrow vault. The designer ({checkoutProduct.seller.name}) will only receive their payout after you receive and inspect your outfit.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold shadow-lg flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight size={15} className="text-brand-accent" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD & EXECUTION */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-brand-primary/10">
                <span className="text-xs uppercase tracking-widest font-bold text-brand-primary flex items-center space-x-1.5">
                  <CreditCard size={14} className="text-brand-accent" />
                  <span>Step 2: Select Cameroonian or Global Payment Gateway</span>
                </span>
                <button
                  onClick={() => setStep('details')}
                  className="text-xs text-brand-primary/60 hover:text-brand-primary underline cursor-pointer"
                >
                  &larr; Edit Delivery Info
                </button>
              </div>

              {/* Payment Method Selector Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* MTN MoMo */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('mtn_momo')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                    selectedMethod === 'mtn_momo'
                      ? 'border-yellow-500 bg-yellow-50/50 shadow-md ring-2 ring-yellow-400/20'
                      : 'border-brand-primary/10 bg-white hover:border-brand-primary/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-yellow-400 text-black rounded font-mono">
                      MTN MoMo
                    </span>
                    <Smartphone size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-brand-primary">MTN Mobile Money</h5>
                    <p className="text-[10px] text-brand-primary/60">*126# USSD Prompt</p>
                  </div>
                </button>

                {/* Orange Money */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('orange_money')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                    selectedMethod === 'orange_money'
                      ? 'border-orange-500 bg-orange-50/50 shadow-md ring-2 ring-orange-400/20'
                      : 'border-brand-primary/10 bg-white hover:border-brand-primary/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-orange-500 text-white rounded font-mono">
                      Orange Money
                    </span>
                    <Smartphone size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-brand-primary">Orange Money</h5>
                    <p className="text-[10px] text-brand-primary/60">#150# Code / App</p>
                  </div>
                </button>

                {/* Visa / MasterCard */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                    selectedMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                      : 'border-brand-primary/10 bg-white hover:border-brand-primary/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-900 text-white rounded font-mono">
                      Visa / MC
                    </span>
                    <CreditCard size={16} className="text-blue-700" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-brand-primary">Credit / Debit Card</h5>
                    <p className="text-[10px] text-brand-primary/60">International 3DS</p>
                  </div>
                </button>

                {/* Diaspora Wire Transfer */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('bank_transfer')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                    selectedMethod === 'bank_transfer'
                      ? 'border-brand-accent bg-brand-accent/10 shadow-md ring-2 ring-brand-accent/20'
                      : 'border-brand-primary/10 bg-white hover:border-brand-primary/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-brand-primary text-white rounded font-mono">
                      Bank Wire
                    </span>
                    <Building2 size={16} className="text-brand-primary" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-brand-primary">Bank / Diaspora Wire</h5>
                    <p className="text-[10px] text-brand-primary/60">UBA / Afriland / RIA</p>
                  </div>
                </button>
              </div>

              {/* Dynamic Payment Details Input Box */}
              <div className="bg-white p-5 rounded-2xl border border-brand-primary/10 space-y-4">
                {selectedMethod === 'mtn_momo' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-bold text-yellow-800">
                      <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                      <span>MTN Mobile Money Cameroon Instant Checkout</span>
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                        MTN MoMo Number (67X XXX XXX)
                      </label>
                      <input
                        type="tel"
                        value={momoNumber}
                        onChange={(e) => setMomoNumber(e.target.value)}
                        placeholder="+237 670 123 456"
                        className="w-full bg-brand-bg/50 border border-brand-primary/15 rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-brand-primary focus:border-brand-accent focus:outline-hidden"
                      />
                    </div>
                    <p className="text-[11px] text-brand-primary/60">
                      A USSD prompt will pop up on your MTN handset asking you to enter your 4-digit PIN to authorize payment of <strong className="text-brand-primary">{formatPrice(checkoutProduct.price)}</strong> into KamerStyle Escrow.
                    </p>
                  </div>
                )}

                {selectedMethod === 'orange_money' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-bold text-orange-800">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <span>Orange Money Cameroon Instant Checkout</span>
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                        Orange Money Number (69X XXX XXX / 65X)
                      </label>
                      <input
                        type="tel"
                        value={omNumber}
                        onChange={(e) => setOmNumber(e.target.value)}
                        placeholder="+237 690 123 456"
                        className="w-full bg-brand-bg/50 border border-brand-primary/15 rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-brand-primary focus:border-brand-accent focus:outline-hidden"
                      />
                    </div>
                    <p className="text-[11px] text-brand-primary/60">
                      You will receive a push notification to authorize the transaction of <strong className="text-brand-primary">{formatPrice(checkoutProduct.price)}</strong> with your Orange Money secret code.
                    </p>
                  </div>
                )}

                {selectedMethod === 'card' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
                      <Lock size={13} />
                      <span>256-Bit SSL Encrypted International Visa / MasterCard Gateway</span>
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-brand-bg/50 border border-brand-primary/15 rounded-xl px-3.5 py-2 text-sm uppercase"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-brand-bg/50 border border-brand-primary/15 rounded-xl px-3.5 py-2 text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-widest font-bold text-brand-primary/60 block mb-1">
                          Expiry / CVV
                        </label>
                        <div className="flex space-x-1.5">
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-1/2 bg-brand-bg/50 border border-brand-primary/15 rounded-xl px-2 py-2 text-xs text-center font-mono"
                          />
                          <input
                            type="text"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-1/2 bg-brand-bg/50 border border-brand-primary/15 rounded-xl px-2 py-2 text-xs text-center font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'bank_transfer' && (
                  <div className="space-y-2 text-xs text-brand-primary/80">
                    <h6 className="font-bold text-brand-primary">Cameroon Commercial Banking Escrow Treasury:</h6>
                    <div className="p-3 bg-brand-bg rounded-xl font-mono text-[11px] space-y-1">
                      <p><strong>Bank:</strong> United Bank for Africa (UBA) Cameroon / Afriland First Bank</p>
                      <p><strong>Account Name:</strong> KamerStyle Fashion Escrow Services Ltd</p>
                      <p><strong>RIB / Account:</strong> 10033 05210 09842104921 44</p>
                      <p><strong>Swift / BIC:</strong> UNAFCMRX (Douala Hub)</p>
                    </div>
                    <p className="text-[11px] opacity-70">
                      Funds deposited via Bank Wire are immediately locked in Escrow. Proof of transfer can be messaged to Admin Simon Tangu (+237650135276).
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 pt-2">
                <div className="text-xs text-brand-primary/70">
                  <span>Payable Now: </span>
                  <strong className="font-serif text-base text-brand-primary">
                    {formatPrice(checkoutProduct.price)}
                  </strong>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-brand-primary/20 text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleExecutePayment}
                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Lock size={14} />
                    <span>Authorize Payment ({formatPrice(checkoutProduct.price)})</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING SCREEN */}
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-brand-accent border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-brand-primary font-bold">
                  <ShieldCheck size={32} className="text-brand-accent animate-pulse" />
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <h4 className="font-serif font-bold text-xl text-brand-primary">
                  Authorizing Escrow Deposit
                </h4>
                <p className="text-xs text-brand-primary/70 font-mono animate-pulse">
                  {processingStatus}
                </p>
              </div>

              <div className="p-3 bg-white border border-brand-primary/10 rounded-xl max-w-sm text-[11px] text-brand-primary/60">
                Please do not close this window. Your transaction reference is being registered with Cameroon telecom gateways and KamerStyle Escrow.
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT SUCCESS & RECEIPT */}
          {step === 'success' && createdOrder && (
            <div className="space-y-6" id="printable-receipt">
              {/* Success Badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-2xl text-emerald-950">
                    Payment Secured in Escrow!
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1">
                    Order <strong>#{createdOrder.orderNumber}</strong> has been registered. The designer has received your order and is preparing fulfillment.
                  </p>
                </div>
              </div>

              {/* Escrow Progress Timeline */}
              <div className="bg-white p-5 rounded-2xl border border-brand-primary/10 space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-bold text-brand-primary flex items-center space-x-1.5">
                  <Sparkles size={14} className="text-brand-accent" />
                  <span>Escrow Tracking & Delivery Lifecycle</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 bg-emerald-100/80 border border-emerald-300 rounded-xl text-emerald-900">
                    <span className="text-[10px] font-bold block uppercase tracking-wider">Step 1</span>
                    <strong className="block">Funds in Escrow</strong>
                    <span className="text-[9px] text-emerald-700">Payment Secured ✓</span>
                  </div>

                  <div className="p-3 bg-brand-bg rounded-xl border border-brand-primary/10 text-brand-primary">
                    <span className="text-[10px] font-bold block uppercase tracking-wider text-brand-primary/50">Step 2</span>
                    <strong className="block">Atelier Fitting</strong>
                    <span className="text-[9px] text-brand-primary/60">{createdOrder.sellerName}</span>
                  </div>

                  <div className="p-3 bg-brand-bg rounded-xl border border-brand-primary/10 text-brand-primary">
                    <span className="text-[10px] font-bold block uppercase tracking-wider text-brand-primary/50">Step 3</span>
                    <strong className="block">Bus Agency / Courier</strong>
                    <span className="text-[9px] text-brand-primary/60">{createdOrder.deliveryAgency}</span>
                  </div>

                  <div className="p-3 bg-brand-bg rounded-xl border border-brand-primary/10 text-brand-primary">
                    <span className="text-[10px] font-bold block uppercase tracking-wider text-brand-primary/50">Step 4</span>
                    <strong className="block">Delivery & Payout</strong>
                    <span className="text-[9px] text-brand-primary/60">Inspect & Confirm</span>
                  </div>
                </div>
              </div>

              {/* Receipt Summary Table */}
              <div className="bg-white p-5 rounded-2xl border border-brand-primary/10 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="font-bold text-brand-primary">Official Escrow Receipt</span>
                  <span className="font-mono text-brand-accent font-bold">Ref: {createdOrder.paymentRef}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-brand-primary/80">
                  <div>
                    <span className="text-[10px] uppercase text-brand-primary/50 block">Dressing Item</span>
                    <strong>{createdOrder.productName} ({createdOrder.size})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-brand-primary/50 block">Amount Paid</span>
                    <strong className="text-brand-primary">{formatPrice(createdOrder.amountPaidFcfa)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-brand-primary/50 block">Payment Method</span>
                    <strong className="uppercase">{createdOrder.paymentMethod.replace('_', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-brand-primary/50 block">Recipient</span>
                    <strong>{createdOrder.buyerName} ({createdOrder.buyerPhone})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-brand-primary/50 block">Destination</span>
                    <strong>{createdOrder.buyerCity}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-brand-primary/50 block">Designer Atelier</span>
                    <strong>{createdOrder.sellerName}</strong>
                  </div>
                </div>
              </div>

              {/* Next Steps CTA actions */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                <button
                  onClick={handlePrintReceipt}
                  className="p-3 border border-brand-primary/20 hover:bg-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Printer size={15} />
                  <span>Print Receipt</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      closeCheckout();
                      openChatForProduct(checkoutProduct, `Hello! I have placed order #${createdOrder.orderNumber} for "${createdOrder.productName}". Please confirm receipt in escrow and package for ${createdOrder.buyerCity}.`);
                    }}
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white px-5 py-3 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <MessageSquare size={14} className="text-brand-accent" />
                    <span>Message Designer</span>
                  </button>

                  <a
                    href={`https://wa.me/${(createdOrder.sellerPhone || contactInfo.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello! I have completed payment for Order #${createdOrder.orderNumber} ("${createdOrder.productName}" - ${formatPrice(createdOrder.amountPaidFcfa)}) on KamerStyle.%0A%0ARecipient: ${createdOrder.buyerName}%0ACity: ${createdOrder.buyerCity}%0AAgency: ${createdOrder.deliveryAgency}%0A%0APlease confirm dispatch!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm"
                  >
                    <Phone size={14} />
                    <span>WhatsApp Seller</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
