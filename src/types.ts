export type Category = 
  | 'All'
  | 'Traditional'
  | 'Modern'
  | 'Bridal'
  | 'Accessories'
  | 'Shoes'
  | 'Bespoke Men';

export type Condition = 'New' | 'Like New' | 'Gently Used' | 'Tailor Made';

export type Currency = 'FCFA' | 'USD' | 'EUR' | 'GBP';

export interface Seller {
  name: string;
  location: string;
  phone: string;
  email?: string;
  rating?: number;
  salesCount?: number;
  verified?: boolean;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number; // Stored in FCFA (XAF)
  category: Exclude<Category, 'All'>;
  description: string;
  image: string;
  additionalImages?: string[];
  seller: Seller;
  condition: Condition;
  sizes?: string[];
  regionOrigin?: string; // e.g. "North West (Bamenda)", "Littoral (Sawa)", "West (Bamileke)", "Far North"
  fabricType?: string;   // e.g. "Royal Toghu Velvet", "Authentic Bamileke Ndop", "100% Cotton Ankara Wax"
  featured?: boolean;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: 'buyer' | 'seller' | 'admin';
  isAdmin?: boolean;
  avatar?: string;
  verified: boolean;
  savedAddresses?: string[];
  joinedDate: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'seller' | 'ai' | 'admin';
  text: string;
  timestamp: string;
  isAi?: boolean;
  productId?: string;
  productSnapshot?: {
    name: string;
    price: number;
    image: string;
  };
  attachments?: string[];
}

export interface ChatThread {
  id: string;
  type: 'seller' | 'ai_support' | 'admin_support';
  participantName: string;
  participantRole: 'seller' | 'ai' | 'admin';
  participantPhone?: string;
  participantEmail?: string;
  participantLocation?: string;
  participantAvatar?: string;
  productId?: string;
  productName?: string;
  productPrice?: number;
  productImage?: string;
  lastMessage?: string;
  lastTimestamp?: string;
  unreadCount?: number;
}

export type OrderStatus = 'escrow_held' | 'dispatched' | 'delivered' | 'escrow_released' | 'cancelled';
export type PaymentMethod = 'mtn_momo' | 'orange_money' | 'card' | 'bank_transfer';

export interface Order {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productCategory: string;
  sellerName: string;
  sellerPhone: string;
  sellerLocation: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerCity: string;
  deliveryAddress: string;
  deliveryAgency?: string;
  trackingNumber?: string;
  size?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  paymentRef: string;
  paymentPhoneOrCard?: string;
  currency: Currency;
  amountPaidFcfa: number;
  escrowStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  payoutReleasedAt?: string;
}

export interface Payout {
  id: string;
  sellerName: string;
  amountFcfa: number;
  method: 'mtn_momo' | 'orange_money' | 'bank_transfer';
  accountNumber: string;
  accountName: string;
  status: 'completed' | 'processing';
  reference: string;
  createdAt: string;
}

