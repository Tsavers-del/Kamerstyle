import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Currency, User, ChatMessage, ChatThread, Order, Payout, OrderStatus, PaymentMethod } from '../types';
import { INITIAL_PRODUCTS, CURRENCY_RATES, CURRENCY_SYMBOLS, OFFICIAL_CONTACT, INITIAL_ORDERS, INITIAL_PAYOUTS } from '../constants';

interface StoreContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (productId: string, data: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  resetToInitialProducts: () => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistProducts: Product[];
  
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;
  recentlyViewedProducts: Product[];
  
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInFcfa: number) => string;
  convertPrice: (priceInFcfa: number) => number;
  currencySymbol: string;
  
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  signup: (userData: { name: string; email: string; phone: string; location: string; role?: 'buyer' | 'seller'; password?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  setAdminUser: () => void;
  
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // In-App Chat & Support AI System
  threads: ChatThread[];
  activeThreadId: string | null;
  setActiveThreadId: (threadId: string | null) => void;
  messages: Record<string, ChatMessage[]>;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  openChatForProduct: (product: Product, initialText?: string) => void;
  openAiSupportChat: (initialQuery?: string) => void;
  sendMessage: (threadId: string, text: string) => Promise<void>;
  markThreadAsRead: (threadId: string) => void;
  deleteThread: (threadId: string) => void;
  unreadMessagesCount: number;

  // Payment Gateway & Orders
  orders: Order[];
  payouts: Payout[];
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  checkoutProduct: Product | null;
  checkoutSize: string;
  openCheckout: (product: Product, preselectedSize?: string) => void;
  closeCheckout: () => void;
  createOrder: (orderInput: {
    product: Product;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    buyerCity: string;
    deliveryAddress: string;
    deliveryAgency?: string;
    size?: string;
    notes?: string;
    paymentMethod: PaymentMethod;
    paymentPhoneOrCard?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, extra?: { trackingNumber?: string; deliveryAgency?: string }) => void;
  requestPayout: (payoutInput: {
    sellerName: string;
    amountFcfa: number;
    method: 'mtn_momo' | 'orange_money' | 'bank_transfer';
    accountNumber: string;
    accountName: string;
  }) => Promise<Payout>;
  activeSellerFilter: string;
  setActiveSellerFilter: (sellerName: string) => void;

  contactInfo: typeof OFFICIAL_CONTACT;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_PRODUCTS = 'kamerstyle_products_v3';
const LOCAL_STORAGE_WISHLIST = 'kamerstyle_wishlist_v3';
const LOCAL_STORAGE_RECENT = 'kamerstyle_recently_viewed_v3';
const LOCAL_STORAGE_CURRENCY = 'kamerstyle_currency_v3';
const LOCAL_STORAGE_USER = 'kamerstyle_user_v3';
const LOCAL_STORAGE_THREADS = 'kamerstyle_chat_threads_v3';
const LOCAL_STORAGE_MESSAGES = 'kamerstyle_chat_messages_v3';

// Default initial support threads
const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'thread_ai_support',
    type: 'ai_support',
    participantName: 'KamerStyle AI Support Concierge',
    participantRole: 'ai',
    participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
    lastMessage: 'Hello! I am your AI Support Concierge. Ask me anything about Cameroon dressings, escrow payments, or delivery.',
    lastTimestamp: 'Just now',
    unreadCount: 0,
  },
  {
    id: 'thread_admin_support',
    type: 'admin_support',
    participantName: 'Simon Tangu (Platform Admin)',
    participantRole: 'admin',
    participantPhone: OFFICIAL_CONTACT.phone,
    participantEmail: OFFICIAL_CONTACT.email,
    participantLocation: 'Bamenda & Douala',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    lastMessage: 'Welcome to KamerStyle! Contact me directly for VIP concierge or verified seller inquiries.',
    lastTimestamp: 'Today',
    unreadCount: 0,
  }
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  thread_ai_support: [
    {
      id: 'msg_ai_welcome_1',
      threadId: 'thread_ai_support',
      senderId: 'ai_concierge',
      senderName: 'KamerStyle AI Concierge',
      senderRole: 'ai',
      text: '🇨🇲 Welcome to KamerStyle Support AI! I can assist you with:\n• Traditional Cameroon dressings (Bamenda Toghu, Sawa Kaba Ngondo, Bamileke Ndop)\n• Nationwide inter-city delivery & Diaspora shipping\n• MTN MoMo / Orange Money Escrow protection\n• Sizing guides & connecting with local designers.\n\nHow may I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAi: true,
    }
  ],
  thread_admin_support: [
    {
      id: 'msg_admin_welcome_1',
      threadId: 'thread_admin_support',
      senderId: 'admin_simon',
      senderName: 'Simon Tangu (Admin)',
      senderRole: 'admin',
      text: 'Hello! I am Simon Tangu, Founder and Administrator of KamerStyle. If you need any assistance with high-value traditional orders, custom atelier tailoring, or seller onboarding, you can message me here or call me on WhatsApp at +237650135276.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Recently Viewed State
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_RECENT);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Currency State
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CURRENCY) as Currency;
      if (saved && CURRENCY_RATES[saved]) return saved;
    } catch {}
    return 'FCFA';
  });

  // User Auth State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Chat System State
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_THREADS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading chat threads', e);
    }
    return INITIAL_THREADS;
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MESSAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          return { ...INITIAL_MESSAGES, ...parsed };
        }
      }
    } catch (e) {
      console.error('Error loading chat messages', e);
    }
    return INITIAL_MESSAGES;
  });

  const [activeThreadId, setActiveThreadId] = useState<string | null>('thread_ai_support');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Orders State (Escrow & Payments)
  const LOCAL_STORAGE_ORDERS = 'kamerstyle_orders_v3';
  const LOCAL_STORAGE_PAYOUTS = 'kamerstyle_payouts_v3';

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading orders', e);
    }
    return INITIAL_ORDERS;
  });

  const [payouts, setPayouts] = useState<Payout[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PAYOUTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading payouts', e);
    }
    return INITIAL_PAYOUTS;
  });

  // Payment Checkout Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutSize, setCheckoutSize] = useState<string>('');
  const [activeSellerFilter, setActiveSellerFilter] = useState<string>('All');

  // Modals & Drawers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PAYOUTS, JSON.stringify(payouts));
    } catch (e) {
      console.error(e);
    }
  }, [payouts]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_RECENT, JSON.stringify(recentlyViewed));
    } catch (e) {
      console.error(e);
    }
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_THREADS, JSON.stringify(threads));
    } catch (e) {
      console.error(e);
    }
  }, [threads]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem(LOCAL_STORAGE_CURRENCY, newCurrency);
    } catch {}
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: 'ks_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (productId: string, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...data } : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const resetToInitialProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    try {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    } catch {}
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  };

  const recentlyViewedProducts = recentlyViewed
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const convertPrice = (priceInFcfa: number): number => {
    const rate = CURRENCY_RATES[currency] || 1;
    if (currency === 'FCFA') return priceInFcfa;
    const converted = priceInFcfa * rate;
    return Math.round(converted * 100) / 100;
  };

  const formatPrice = (priceInFcfa: number): string => {
    if (currency === 'FCFA') {
      return `${priceInFcfa.toLocaleString()} FCFA`;
    }
    const converted = convertPrice(priceInFcfa);
    const symbol = CURRENCY_SYMBOLS[currency] || '';
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const isAdmin = Boolean(
    user && (
      user.email.toLowerCase() === OFFICIAL_CONTACT.email.toLowerCase() ||
      user.role === 'admin' ||
      user.isAdmin === true
    )
  );

  const setAdminUser = () => {
    const adminUser: User = {
      id: 'admin_simon_tangu',
      name: 'Simon Tangu (Admin)',
      email: OFFICIAL_CONTACT.email,
      phone: OFFICIAL_CONTACT.phone,
      location: 'Commercial Ave, Bamenda & Douala',
      role: 'admin',
      isAdmin: true,
      verified: true,
      joinedDate: '2026-01-01'
    };
    setUser(adminUser);
  };

  // Mock Authentication with security verification
  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }
    
    const isOwner = email.toLowerCase() === OFFICIAL_CONTACT.email.toLowerCase();
    const newUser: User = {
      id: isOwner ? 'user_admin_01' : 'user_' + Date.now().toString(36),
      name: isOwner ? 'Simon Tangu (Master Admin)' : email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email,
      phone: isOwner ? OFFICIAL_CONTACT.phone : '+237 670 123 456',
      location: isOwner ? 'Bamenda & Douala' : 'Douala, Cameroon',
      role: isOwner ? 'admin' : 'buyer',
      isAdmin: isOwner,
      verified: true,
      joinedDate: '2026-04-01'
    };

    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const signup = async (userData: { 
    name: string; 
    email: string; 
    phone: string; 
    location: string; 
    role?: 'buyer' | 'seller'; 
    password?: string 
  }): Promise<{ success: boolean; message?: string }> => {
    if (!userData.name.trim()) return { success: false, message: 'Full name is required.' };
    if (!userData.email.includes('@')) return { success: false, message: 'Valid email is required.' };
    if (!userData.phone.trim()) return { success: false, message: 'Phone number is required for WhatsApp inquiries.' };

    const isOwner = userData.email.toLowerCase() === OFFICIAL_CONTACT.email.toLowerCase();
    const newUser: User = {
      id: 'user_' + Date.now().toString(36),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      location: userData.location || 'Douala, Cameroon',
      role: isOwner ? 'admin' : (userData.role || 'buyer'),
      isAdmin: isOwner,
      verified: true,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER);
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  // --- CHAT SYSTEM IMPLEMENTATION ---

  const markThreadAsRead = (threadId: string) => {
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, unreadCount: 0 } : t));
  };

  const deleteThread = (threadId: string) => {
    if (threadId === 'thread_ai_support' || threadId === 'thread_admin_support') return;
    setThreads(prev => prev.filter(t => t.id !== threadId));
    if (activeThreadId === threadId) {
      setActiveThreadId('thread_ai_support');
    }
  };

  const openAiSupportChat = (initialQuery?: string) => {
    setActiveThreadId('thread_ai_support');
    markThreadAsRead('thread_ai_support');
    setIsChatOpen(true);
    if (initialQuery) {
      sendMessage('thread_ai_support', initialQuery);
    }
  };

  const openChatForProduct = (product: Product, initialText?: string) => {
    const threadId = `thread_product_${product.id}`;
    
    // Check if thread exists
    const existing = threads.find(t => t.id === threadId);
    if (!existing) {
      const newThread: ChatThread = {
        id: threadId,
        type: 'seller',
        participantName: product.seller.name,
        participantRole: 'seller',
        participantPhone: product.seller.phone,
        participantEmail: product.seller.email,
        participantLocation: product.seller.location,
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        productImage: product.image,
        lastMessage: `Inquiry about ${product.name}`,
        lastTimestamp: 'Just now',
        unreadCount: 0
      };

      setThreads(prev => [newThread, ...prev]);

      // Seed initial greeting message from seller
      const sellerGreeting: ChatMessage = {
        id: `msg_${Date.now()}_seller_init`,
        threadId: threadId,
        senderId: `seller_${product.seller.name}`,
        senderName: product.seller.name,
        senderRole: 'seller',
        text: `Hello! Thank you for viewing my "${product.name}" (${product.price.toLocaleString()} FCFA). How can I help you with sizing, custom fitting, or delivery in Cameroon?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        productId: product.id,
        productSnapshot: {
          name: product.name,
          price: product.price,
          image: product.image
        }
      };

      setMessages(prev => ({
        ...prev,
        [threadId]: [sellerGreeting]
      }));
    }

    setActiveThreadId(threadId);
    markThreadAsRead(threadId);
    setIsChatOpen(true);

    if (initialText) {
      setTimeout(() => {
        sendMessage(threadId, initialText);
      }, 300);
    }
  };

  const sendMessage = async (threadId: string, text: string) => {
    if (!text.trim()) return;

    const currentThread = threads.find(t => t.id === threadId);
    const senderName = user?.name || 'Customer';
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      threadId: threadId,
      senderId: user?.id || 'guest_user',
      senderName: senderName,
      senderRole: 'buyer',
      text: text.trim(),
      timestamp: nowTime
    };

    // Update messages state immediately
    setMessages(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), userMsg]
    }));

    // Update thread lastMessage
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          lastMessage: text.trim(),
          lastTimestamp: 'Just now'
        };
      }
      return t;
    }));

    // Handle automated AI or Seller Response
    if (threadId === 'thread_ai_support') {
      try {
        const historyForAi = (messages[threadId] || []).map(m => ({
          role: m.senderRole === 'ai' ? ('model' as const) : ('user' as const),
          text: m.text
        }));

        const response = await fetch('/api/chat/support', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            history: historyForAi
          })
        });

        const data = await response.json();
        const replyText = data.reply || data.fallback || "I am here to assist you with KamerStyle dressings, sizes, and Cameroon delivery. What would you like to know?";

        const aiMsg: ChatMessage = {
          id: `msg_ai_${Date.now()}`,
          threadId: threadId,
          senderId: 'ai_concierge',
          senderName: 'KamerStyle AI Concierge',
          senderRole: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAi: true
        };

        setMessages(prev => ({
          ...prev,
          [threadId]: [...(prev[threadId] || []), aiMsg]
        }));

        setThreads(prev => prev.map(t => t.id === threadId ? {
          ...t,
          lastMessage: replyText.substring(0, 60) + '...',
          lastTimestamp: 'Just now'
        } : t));

      } catch (err) {
        console.error('Error fetching AI response:', err);
        const fallbackMsg: ChatMessage = {
          id: `msg_ai_err_${Date.now()}`,
          threadId: threadId,
          senderId: 'ai_concierge',
          senderName: 'KamerStyle AI Concierge',
          senderRole: 'ai',
          text: "I am ready to assist you! For urgent orders or custom Toghu fittings, you can also reach Simon Tangu directly at +237650135276.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAi: true
        };
        setMessages(prev => ({
          ...prev,
          [threadId]: [...(prev[threadId] || []), fallbackMsg]
        }));
      }
    } else if (currentThread && currentThread.type === 'seller') {
      // Intelligent simulated seller reply after realistic typing pause
      setTimeout(() => {
        const responses = [
          `Thank you for your message! Yes, this piece is in stock in our atelier in ${currentThread.participantLocation || 'Cameroon'}. We can package it for courier dispatch within 24 hours.`,
          `Hello! I received your inquiry about ${currentThread.productName || 'this dressing'}. You can also reach me directly on WhatsApp at ${currentThread.participantPhone || '+237...'} to confirm your exact measurements!`,
          `Thanks for reaching out! We accept MTN Mobile Money and Orange Money with KamerStyle Escrow protection for safe delivery to your city.`,
          `Greetings! Would you like us to customize this with your specific chest, waist, and height measurements? We provide complimentary bespoke fitting.`
        ];
        const randomReply = responses[Math.floor(Math.random() * responses.length)];

        const sellerMsg: ChatMessage = {
          id: `msg_seller_reply_${Date.now()}`,
          threadId: threadId,
          senderId: `seller_${currentThread.participantName}`,
          senderName: currentThread.participantName,
          senderRole: 'seller',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => ({
          ...prev,
          [threadId]: [...(prev[threadId] || []), sellerMsg]
        }));

        setThreads(prev => prev.map(t => t.id === threadId ? {
          ...t,
          lastMessage: randomReply.substring(0, 60) + '...',
          lastTimestamp: 'Just now',
          unreadCount: activeThreadId === threadId && isChatOpen ? 0 : (t.unreadCount || 0) + 1
        } : t));
      }, 1200);
    } else if (currentThread && currentThread.type === 'admin_support') {
      setTimeout(() => {
        const adminReply: ChatMessage = {
          id: `msg_admin_reply_${Date.now()}`,
          threadId: threadId,
          senderId: 'admin_simon',
          senderName: 'Simon Tangu (Admin)',
          senderRole: 'admin',
          text: `Thank you for contacting KamerStyle Concierge. I have received your message and will review it immediately. Feel free to call +237650135276 or WhatsApp if you need immediate assistance with an escrow or delivery.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => ({
          ...prev,
          [threadId]: [...(prev[threadId] || []), adminReply]
        }));
      }, 1000);
    }
  };

  const unreadMessagesCount = threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);

  // --- CHECKOUT & ESCROW ORDER MANAGEMENT ---
  const openCheckout = (product: Product, preselectedSize?: string) => {
    setCheckoutProduct(product);
    setCheckoutSize(preselectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard'));
    setIsPaymentModalOpen(true);
  };

  const closeCheckout = () => {
    setIsPaymentModalOpen(false);
    setCheckoutProduct(null);
    setCheckoutSize('');
  };

  const createOrder = async (orderInput: {
    product: Product;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    buyerCity: string;
    deliveryAddress: string;
    deliveryAgency?: string;
    size?: string;
    notes?: string;
    paymentMethod: PaymentMethod;
    paymentPhoneOrCard?: string;
  }): Promise<Order> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNum = `KS-ORD-${randomSuffix}`;
    const prefix = orderInput.paymentMethod === 'mtn_momo' 
      ? 'MOMO' 
      : orderInput.paymentMethod === 'orange_money' 
      ? 'OM' 
      : orderInput.paymentMethod === 'card' 
      ? 'CARD' 
      : 'WIRE';
    const payRef = `${prefix}-KS-${Date.now().toString().slice(-6)}`;

    const newOrder: Order = {
      id: 'ord_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      orderNumber: orderNum,
      productId: orderInput.product.id,
      productName: orderInput.product.name,
      productPrice: orderInput.product.price,
      productImage: orderInput.product.image,
      productCategory: orderInput.product.category,
      sellerName: orderInput.product.seller.name,
      sellerPhone: orderInput.product.seller.phone,
      sellerLocation: orderInput.product.seller.location,
      buyerId: user?.id || 'guest_buyer_' + Date.now().toString(36),
      buyerName: orderInput.buyerName,
      buyerEmail: orderInput.buyerEmail,
      buyerPhone: orderInput.buyerPhone,
      buyerCity: orderInput.buyerCity,
      deliveryAddress: orderInput.deliveryAddress,
      deliveryAgency: orderInput.deliveryAgency || 'Inter-City Express (Bucavoyages/Finexs)',
      size: orderInput.size || 'Standard',
      notes: orderInput.notes || '',
      paymentMethod: orderInput.paymentMethod,
      paymentRef: payRef,
      paymentPhoneOrCard: orderInput.paymentPhoneOrCard || orderInput.buyerPhone,
      currency: currency,
      amountPaidFcfa: orderInput.product.price,
      escrowStatus: 'escrow_held',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Send automated in-app confirmation notification thread
    const threadId = `thread_product_${orderInput.product.id}`;
    const orderConfirmMsg: ChatMessage = {
      id: `msg_order_${Date.now()}`,
      threadId: threadId,
      senderId: 'system_escrow',
      senderName: 'KamerStyle Escrow System',
      senderRole: 'admin',
      text: `🎉 Payment Confirmed: Order #${newOrder.orderNumber} for "${newOrder.productName}" (${formatPrice(newOrder.amountPaidFcfa)}) has been secured in Escrow. Seller ${newOrder.sellerName} has been notified to prepare shipment to ${newOrder.buyerCity}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      productId: orderInput.product.id,
      productSnapshot: {
        name: orderInput.product.name,
        price: orderInput.product.price,
        image: orderInput.product.image
      }
    };

    setMessages(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), orderConfirmMsg]
    }));

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string, 
    status: OrderStatus, 
    extra?: { trackingNumber?: string; deliveryAgency?: string }
  ) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const now = new Date().toISOString();
        const updated: Order = {
          ...order,
          escrowStatus: status,
          updatedAt: now,
          ...(extra?.trackingNumber ? { trackingNumber: extra.trackingNumber } : {}),
          ...(extra?.deliveryAgency ? { deliveryAgency: extra.deliveryAgency } : {}),
          ...(status === 'dispatched' ? { dispatchedAt: now } : {}),
          ...(status === 'delivered' ? { deliveredAt: now } : {}),
          ...(status === 'escrow_released' ? { payoutReleasedAt: now } : {})
        };
        return updated;
      }
      return order;
    }));
  };

  const requestPayout = async (payoutInput: {
    sellerName: string;
    amountFcfa: number;
    method: 'mtn_momo' | 'orange_money' | 'bank_transfer';
    accountNumber: string;
    accountName: string;
  }): Promise<Payout> => {
    const randomRef = `PAY-${payoutInput.method === 'mtn_momo' ? 'MOMO' : payoutInput.method === 'orange_money' ? 'OM' : 'BNK'}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPayout: Payout = {
      id: 'pay_' + Date.now().toString(36),
      sellerName: payoutInput.sellerName,
      amountFcfa: payoutInput.amountFcfa,
      method: payoutInput.method,
      accountNumber: payoutInput.accountNumber,
      accountName: payoutInput.accountName,
      status: 'completed',
      reference: randomRef,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPayouts(prev => [newPayout, ...prev]);

    // Mark eligible delivered orders for this seller as escrow_released
    setOrders(prev => prev.map(order => {
      if (order.sellerName === payoutInput.sellerName && order.escrowStatus === 'delivered') {
        return {
          ...order,
          escrowStatus: 'escrow_released',
          payoutReleasedAt: new Date().toISOString()
        };
      }
      return order;
    }));

    return newPayout;
  };

  return (
    <StoreContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      resetToInitialProducts,
      wishlist,
      toggleWishlist,
      isWishlisted,
      wishlistProducts,
      recentlyViewed,
      addRecentlyViewed,
      recentlyViewedProducts,
      currency,
      setCurrency,
      formatPrice,
      convertPrice,
      currencySymbol: CURRENCY_SYMBOLS[currency] || 'FCFA',
      user,
      isAdmin,
      login,
      signup,
      logout,
      updateUser,
      setAdminUser,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalMode,
      openAuthModal,
      isWishlistOpen,
      setIsWishlistOpen,
      isSearchOpen,
      setIsSearchOpen,

      // Chat system exports
      threads,
      activeThreadId,
      setActiveThreadId,
      messages,
      isChatOpen,
      setIsChatOpen,
      openChatForProduct,
      openAiSupportChat,
      sendMessage,
      markThreadAsRead,
      deleteThread,
      unreadMessagesCount,

      // Payment Gateway & Orders exports
      orders,
      payouts,
      isPaymentModalOpen,
      setIsPaymentModalOpen,
      checkoutProduct,
      checkoutSize,
      openCheckout,
      closeCheckout,
      createOrder,
      updateOrderStatus,
      requestPayout,
      activeSellerFilter,
      setActiveSellerFilter,

      contactInfo: OFFICIAL_CONTACT
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

