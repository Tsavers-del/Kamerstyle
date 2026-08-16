import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Plus, 
  CheckCircle2, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  Image as ImageIcon, 
  ArrowLeft, 
  Upload,
  User,
  Info
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Category, Condition } from '../types';

type Step = 'Basic' | 'Details' | 'Images' | 'Success';

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1549037173-e3b717902c57?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80',
];

export default function Sell() {
  const navigate = useNavigate();
  const { user, addProduct, formatPrice, contactInfo } = useStore();

  const [currentStep, setCurrentStep] = useState<Step>('Basic');
  const [createdProductId, setCreatedProductId] = useState<string>('');

  // Form State
  const [category, setCategory] = useState<Exclude<Category, 'All'>>('Traditional');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [regionOrigin, setRegionOrigin] = useState('North West (Bamenda)');
  const [fabricType, setFabricType] = useState('Royal Toghu Velvet');
  const [condition, setCondition] = useState<Condition>('Tailor Made');
  const [price, setPrice] = useState<number>(65000);
  const [sizes, setSizes] = useState<string>('S, M, L, XL, Custom Fitted');

  // Seller Details (Default to logged-in user if available, otherwise empty for the seller to fill)
  const [sellerName, setSellerName] = useState(user ? user.name : '');
  const [sellerPhone, setSellerPhone] = useState(user?.phone || '');
  const [sellerEmail, setSellerEmail] = useState(user?.email || '');
  const [sellerLocation, setSellerLocation] = useState(user?.location || 'Douala / Yaoundé, Cameroon');

  // Images State (Preset, custom URL, or uploaded base64 data)
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0]);
  const [customUrl, setCustomUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const nextStep = (step: Step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinishListing = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine final display image
    const finalImage = uploadedImage || (customUrl.trim() ? customUrl.trim() : imageUrl);
    const parsedSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);

    const newProduct = addProduct({
      name: name.trim() || 'Handcrafted Cameroonian Dressing',
      price: Number(price) || 50000,
      category,
      description: description.trim() || 'Authentic Cameroonian dressing crafted with high-grade fabric and traditional motifs.',
      image: finalImage,
      condition,
      sizes: parsedSizes.length > 0 ? parsedSizes : ['Standard Fit'],
      regionOrigin,
      fabricType,
      seller: {
        name: sellerName.trim() || 'Cameroon Fashion Designer',
        location: sellerLocation.trim() || 'Douala / Yaoundé',
        phone: sellerPhone.trim() || '+237 650 000 000',
        email: sellerEmail.trim() || '',
        rating: 5.0,
        salesCount: 1,
        verified: true
      },
      featured: true
    });

    setCreatedProductId(newProduct.id);
    nextStep('Success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Step Indicator */}
      <div className="mb-12 max-w-xl mx-auto">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-brand-primary/15 -z-10" />
          
          {(['Basic', 'Details', 'Images'] as const).map((s, i) => {
            const isActive = currentStep === s;
            const isDone = (currentStep === 'Details' && i === 0) || (currentStep === 'Images' && i <= 1) || currentStep === 'Success';
            return (
              <div key={s} className="flex flex-col items-center space-y-2 bg-brand-bg px-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  isActive 
                    ? 'bg-brand-primary text-brand-bg ring-4 ring-brand-accent/30 scale-110' 
                    : isDone
                    ? 'bg-brand-accent text-brand-primary font-extrabold'
                    : 'bg-brand-primary/10 text-brand-primary/40'
                }`}>
                  {isDone ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-bold ${
                  isActive ? 'text-brand-primary' : 'text-brand-primary/40'
                }`}>
                  {s}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: BASIC INFORMATION */}
        {currentStep === 'Basic' && (
          <motion.div
            key="basic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-6 md:p-10 border border-brand-primary/10 shadow-sm space-y-8"
          >
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-accent font-bold">Step 1 of 3</span>
              <h1 className="text-3xl md:text-4xl font-serif text-brand-primary">What Dressing Are You Selling?</h1>
              <p className="text-xs text-brand-primary/60 max-w-md mx-auto">
                Select your fashion category and region of Cameroonian heritage.
              </p>
            </div>

            <div className="space-y-6">
              {/* Category Picker */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">
                  Dressing Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(['Traditional', 'Modern', 'Bridal', 'Bespoke Men', 'Accessories', 'Shoes'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all text-center cursor-pointer ${
                        category === cat
                          ? 'border-brand-primary bg-brand-primary text-white shadow-md'
                          : 'border-brand-primary/15 bg-brand-bg/50 hover:border-brand-accent text-brand-primary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">
                  Dressing Title / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Bamenda Gold-Embroidered Toghu Velvet Gown"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-bg/50 border border-brand-primary/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-accent text-brand-primary font-medium"
                />
              </div>

              {/* Regional Origin & Fabric */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">
                    Cameroonian Cultural Region
                  </label>
                  <select
                    value={regionOrigin}
                    onChange={(e) => setRegionOrigin(e.target.value)}
                    className="w-full bg-brand-bg/50 border border-brand-primary/15 rounded-xl px-4 py-3 text-xs text-brand-primary focus:outline-none"
                  >
                    <option value="North West (Bamenda)">North West (Bamenda Toghu)</option>
                    <option value="Littoral (Douala/Limbe)">Littoral (Sawa Kaba Ngondo)</option>
                    <option value="West (Bamileke/Bamum)">West (Bamileke / Ndop Cloth)</option>
                    <option value="Far North (Maroua/Garoua)">Far North & North (Grand Boubou/Sahel)</option>
                    <option value="Centre (Yaoundé)">Centre (Yaoundé Modern Ateliers)</option>
                    <option value="Pan-Cameroon">Pan-Cameroon Modern Haute Couture</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">
                    Fabric / Material Composition
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Velvet, Indigo Ndop, Pure Silk Satin"
                    value={fabricType}
                    onChange={(e) => setFabricType(e.target.value)}
                    className="w-full bg-brand-bg/50 border border-brand-primary/15 rounded-xl px-4 py-3 text-xs text-brand-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">
                  Item Condition
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Tailor Made', 'New', 'Like New', 'Gently Used'] as Condition[]).map(cond => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setCondition(cond)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                        condition === cond
                          ? 'border-brand-accent bg-brand-accent/15 text-brand-primary font-bold'
                          : 'border-brand-primary/15 bg-white text-brand-primary/70 hover:border-brand-primary'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!name.trim()) {
                      alert("Please provide a name for your dressing.");
                      return;
                    }
                    nextStep('Details');
                  }}
                  className="w-full bg-brand-primary text-brand-bg py-4 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-primary/90 flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Proceed to Pricing & Seller Info</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: DETAILS, PRICING & SELLER CONTACT */}
        {currentStep === 'Details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-6 md:p-10 border border-brand-primary/10 shadow-sm space-y-8"
          >
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-accent font-bold">Step 2 of 3</span>
              <h1 className="text-3xl md:text-4xl font-serif text-brand-primary">Pricing & Your Seller Contact</h1>
              <p className="text-xs text-brand-primary/60 max-w-md mx-auto">
                Set your price in FCFA and enter your personal or boutique contact details so buyers reach you directly.
              </p>
            </div>

            <div className="space-y-6">
              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">
                  Asking Price in Cameroon (FCFA) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-brand-bg/50 border border-brand-primary/15 rounded-xl pl-4 pr-24 py-3.5 text-xl font-serif font-bold text-brand-primary focus:outline-none focus:border-brand-accent"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-primary/60 uppercase">
                    FCFA (XAF)
                  </span>
                </div>
                <p className="text-[11px] text-brand-primary/50">
                  Live international preview: <strong>{formatPrice(price)}</strong>
                </p>
              </div>

              {/* Sizes Available */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">
                  Sizes Available (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. S, M, L, XL, Custom Measurements"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  className="w-full bg-brand-bg/50 border border-brand-primary/15 rounded-xl px-4 py-3 text-xs text-brand-primary focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">
                  Description & Fitting Guidance
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the embroidery details, occasion suitability (weddings, galas, cultural days), and care instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-brand-bg/50 border border-brand-primary/15 rounded-xl p-4 text-xs text-brand-primary focus:outline-none"
                />
              </div>

              {/* SELLER'S OWN CONTACT INFO (Dynamic, not hardcoded!) */}
              <div className="bg-brand-bg/80 p-5 rounded-2xl border border-brand-primary/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-brand-primary flex items-center space-x-2">
                    <User size={16} className="text-brand-accent" />
                    <span>Your Seller / Atelier Profile</span>
                  </h3>
                  <span className="text-[10px] text-brand-primary/50 italic">
                    Buyers will contact this number
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">
                      Your Name or Boutique Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sawa Glamour Atelier or Kaba Designs"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      className="w-full bg-white border border-brand-primary/15 rounded-xl p-3 text-xs text-brand-primary focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">
                      Your WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+237 6xx xxx xxx"
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value)}
                      className="w-full bg-white border border-brand-primary/15 rounded-xl p-3 text-xs text-brand-primary font-mono focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">
                      Your Contact Email
                    </label>
                    <input
                      type="email"
                      placeholder="yourname@gmail.com"
                      value={sellerEmail}
                      onChange={(e) => setSellerEmail(e.target.value)}
                      className="w-full bg-white border border-brand-primary/15 rounded-xl p-3 text-xs text-brand-primary focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">
                      Your City / Region in Cameroon *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Akwa, Douala or Bastos, Yaoundé"
                      value={sellerLocation}
                      onChange={(e) => setSellerLocation(e.target.value)}
                      className="w-full bg-white border border-brand-primary/15 rounded-xl p-3 text-xs text-brand-primary focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => nextStep('Basic')}
                  className="w-1/3 border border-brand-primary/20 text-brand-primary py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-primary/5 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!sellerName.trim() || !sellerPhone.trim()) {
                      alert("Please provide your seller name and WhatsApp contact number so buyers can reach you.");
                      return;
                    }
                    nextStep('Images');
                  }}
                  className="w-2/3 bg-brand-primary text-brand-bg py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-primary/90 flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                >
                  <span>Proceed to Clothes Photo</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: PHOTO SELECTION & SUBMISSION */}
        {currentStep === 'Images' && (
          <motion.div
            key="images"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-6 md:p-10 border border-brand-primary/10 shadow-sm space-y-8"
          >
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-accent font-bold">Step 3 of 3</span>
              <h1 className="text-3xl md:text-4xl font-serif text-brand-primary">Upload Clothes / Accessories Photo</h1>
              <p className="text-xs text-brand-primary/60 max-w-md mx-auto">
                Upload a real photo from your device, paste an image URL, or choose a Cameroonian dressing template.
              </p>
            </div>

            <div className="space-y-6">
              {/* Real File Upload from Device */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60 flex items-center">
                  <Upload size={14} className="mr-1.5 text-brand-accent" />
                  Upload Photo from Device (Phone / Computer)
                </label>
                
                <div className="border-2 border-dashed border-brand-primary/20 hover:border-brand-accent rounded-2xl p-6 text-center bg-brand-bg/30 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center space-y-2 pointer-events-none">
                    <Camera size={28} className="text-brand-accent" />
                    <p className="text-xs font-bold text-brand-primary">
                      {uploadedImage ? 'Photo uploaded! Click or drop to replace' : 'Click to select photo or drag and drop'}
                    </p>
                    <p className="text-[10px] text-brand-primary/50">
                      Supports JPG, PNG, WEBP from your phone camera or gallery
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo presets if user doesn't have a photo */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">
                  Or Pick a Curated Cameroonian Fashion Template
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {SAMPLE_IMAGES.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setImageUrl(img);
                        setCustomUrl('');
                        setUploadedImage(null);
                      }}
                      className={`aspect-[3/4] rounded-xl overflow-hidden cursor-pointer relative border-2 transition-all ${
                        imageUrl === img && !customUrl && !uploadedImage
                          ? 'border-brand-accent ring-2 ring-brand-accent/50 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Or paste Custom URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60 flex items-center">
                  <ImageIcon size={13} className="mr-1" /> Or Paste Web Image Link
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                    setUploadedImage(null);
                  }}
                  className="w-full bg-brand-bg/50 border border-brand-primary/15 rounded-xl px-4 py-3 text-xs text-brand-primary focus:outline-none"
                />
              </div>

              {/* Live Preview Summary Card */}
              <div className="p-4 bg-brand-bg/60 rounded-2xl border border-brand-primary/10 flex items-center space-x-4">
                <img
                  src={uploadedImage || customUrl || imageUrl}
                  alt="Preview"
                  className="w-16 h-20 rounded-lg object-cover bg-gray-200 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[9px] uppercase tracking-wider text-brand-accent font-bold">
                    {category} • {regionOrigin.split('(')[0]}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-brand-primary truncate">{name || 'Your Dressing'}</h4>
                  <p className="text-xs font-bold text-brand-primary">{formatPrice(price)}</p>
                  <p className="text-[10px] text-brand-primary/60">
                    Seller: <span className="font-semibold">{sellerName || 'Verified Seller'}</span> ({sellerPhone})
                  </p>
                </div>
              </div>

              {/* Finish Actions */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => nextStep('Details')}
                  className="w-1/3 border border-brand-primary/20 text-brand-primary py-4 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-primary/5 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinishListing}
                  className="w-2/3 bg-brand-accent text-brand-primary py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-bold hover:bg-brand-accent/90 shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>Publish Dressing Live</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {currentStep === 'Success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 md:p-14 border border-brand-primary/10 shadow-xl text-center space-y-6 max-w-lg mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={44} />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-green-700 font-bold">
                Listed on KamerStyle
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-brand-primary font-bold">
                Dressing is Now Live!
              </h2>
              <p className="text-xs text-brand-primary/70 leading-relaxed max-w-sm mx-auto">
                Your dressing has been registered under <strong>{sellerName}</strong>. Buyers in Cameroon and worldwide can now message you via in-app chat or WhatsApp at <span className="font-bold text-brand-primary">{sellerPhone}</span>.
              </p>
            </div>

            <div className="pt-4 flex flex-col space-y-3">
              {createdProductId && (
                <Link
                  to={`/product/${createdProductId}`}
                  className="w-full bg-brand-primary text-brand-bg py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-accent hover:text-brand-primary transition-all shadow-md"
                >
                  View My Live Listing
                </Link>
              )}
              <Link
                to="/shop"
                className="w-full border border-brand-primary/20 text-brand-primary py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-brand-primary/5 transition-all"
              >
                Browse Marketplace
              </Link>
              <button
                type="button"
                onClick={() => {
                  setName('');
                  setDescription('');
                  setPrice(50000);
                  setUploadedImage(null);
                  setCustomUrl('');
                  nextStep('Basic');
                }}
                className="text-[10px] uppercase tracking-widest font-bold text-brand-accent hover:underline pt-2 cursor-pointer"
              >
                + List Another Dressing
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
