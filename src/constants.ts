import { Product } from './types';

export const OFFICIAL_CONTACT = {
  phone: '+237650135276',
  rawPhone: '237650135276',
  email: 'simontangu317@gmail.com',
  name: 'Simon Tangu | KamerStyle Executive Support',
  address: 'Commercial Avenue, Bamenda & Akwa Luxury Hub, Douala, Cameroon',
  whatsappUrl: (message?: string) => 
    `https://wa.me/237650135276?text=${encodeURIComponent(message || 'Hello KamerStyle! I am inquiring about Cameroonian dressing collections.')}`
};

export const CURRENCY_RATES = {
  FCFA: 1,
  USD: 0.00165, // 1 USD ~ 606 FCFA
  EUR: 0.00152, // 1 EUR ~ 655.96 FCFA
  GBP: 0.00130, // 1 GBP ~ 769 FCFA
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  FCFA: 'FCFA',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Royal Bamenda Hand-Embroidered Toghu Regalia',
    price: 185000,
    category: 'Traditional',
    description: 'Masterpiece 3-piece Toghu costume from the North West Grassfields. Intricately hand-embroidered with heavy silk-gold and crimson threads on thick midnight-black velvet. Includes matching royal necklace cap and sash.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'Simon Tangu Heritage Ateliers',
      location: 'Commercial Ave, Bamenda',
      phone: '+237650135276',
      email: 'simontangu317@gmail.com',
      rating: 4.9,
      salesCount: 48,
      verified: true
    },
    condition: 'Tailor Made',
    sizes: ['M', 'L', 'XL', 'Custom Fitted'],
    regionOrigin: 'North West (Bamenda)',
    fabricType: 'High-Density Royal Velvet & Gold Thread',
    featured: true,
    createdAt: '2026-04-10'
  },
  {
    id: '2',
    name: 'Sawa Kaba Ngondo Ceremonial Silk Robe',
    price: 65000,
    category: 'Traditional',
    description: 'Iconic Sawa aristocratic dressing celebrating the coastal heritage of Douala. Crafted from feather-light pure satin silk with hand-pleated shoulder wings and gold piping along the grand sweeping hem.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'Ngo Mbog Coastal Silks & Kaba',
      location: 'Bonanjo, Douala',
      phone: '+237677894210',
      email: 'ngombog.kaba@gmail.com',
      rating: 4.8,
      salesCount: 32,
      verified: true
    },
    condition: 'New',
    sizes: ['S', 'M', 'L', 'Free Size'],
    regionOrigin: 'Littoral (Douala/Limbe)',
    fabricType: 'Pure Satin Silk & Organza Accents',
    featured: true,
    createdAt: '2026-04-12'
  },
  {
    id: '3',
    name: 'Western Grassfields Ndop Royal Tunic & Wrapper',
    price: 140000,
    category: 'Traditional',
    description: 'Sacred indigo-dyed Bamileke & Bamun Ndop textile with ancestral geometric motifs. Historically reserved for nobles and palace ceremonies, tailored into a contemporary unisex ceremonial tunic.',
    image: 'https://images.unsplash.com/photo-1549037173-e3b717902c57?auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'Chefferie Bandjoun Ndop Guild',
      location: 'Bafoussam / Bandjoun, West',
      phone: '+237699120485',
      email: 'bandjoun.ndopcraft@gmail.com',
      rating: 5.0,
      salesCount: 61,
      verified: true
    },
    condition: 'New',
    sizes: ['M', 'L', 'XL'],
    regionOrigin: 'West (Bamileke / Bamum)',
    fabricType: 'Resist-Dyed Indigo Organic Cotton Ndop',
    featured: true,
    createdAt: '2026-04-15'
  },
  {
    id: '4',
    name: 'Asymmetrical High-Slit Ankara Gala Dress',
    price: 52000,
    category: 'Modern',
    description: 'Vibrant modern evening gown combining Dutch wax Ankara florals with structured boned corset bodice and dramatic side train. Perfect for gala nights, diplomatic dinners, and high-fashion soirees.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'Clarisse Modern Ankara Haute Couture',
      location: 'Bastos, Yaoundé',
      phone: '+237674338901',
      email: 'clarisse.couture@yahoo.fr',
      rating: 4.9,
      salesCount: 29,
      verified: true
    },
    condition: 'New',
    sizes: ['XS', 'S', 'M', 'L'],
    regionOrigin: 'Yaoundé Design District',
    fabricType: '100% Cotton Premium Wax Print',
    featured: true,
    createdAt: '2026-04-18'
  },
  {
    id: '5',
    name: 'Northern Cameroon Grand Boubou & Gandoura',
    price: 95000,
    category: 'Bespoke Men',
    description: 'Majestic 3-piece Northern Sahelian boubou crafted from shimmering Bazin Riche damask with dense, golden embroidery across the chest plate and sleeves. Comes with matching trousers and embroidered cap.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'El-Hadj Bello Sahelian Boubou House',
      location: 'Garoua & Maroua Central Market',
      phone: '+237691884521',
      email: 'garoua.boubou@gmail.com',
      rating: 4.8,
      salesCount: 40,
      verified: true
    },
    condition: 'New',
    sizes: ['L', 'XL', 'XXL', 'Custom Fitted'],
    regionOrigin: 'Far North & North (Garoua / Maroua)',
    fabricType: 'Getzner Superior Bazin Riche Damask',
    featured: false,
    createdAt: '2026-04-20'
  },
  {
    id: '6',
    name: 'Swarovski & Gold Thread African Bridal Gown',
    price: 320000,
    category: 'Bridal',
    description: 'Breathtaking bridal couture masterpiece featuring traditional Cameroon Toghu embroidery blended seamlessly with French chantilly lace, hand-set Swarovski crystals, and a cascading 2.5-meter cathedral train.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'Mama Forbah Luxury Bridal Atelier',
      location: 'Akwa Luxury Hub, Douala',
      phone: '+237672901144',
      email: 'mamaforbah.bridal@gmail.com',
      rating: 5.0,
      salesCount: 19,
      verified: true
    },
    condition: 'Tailor Made',
    sizes: ['Custom Fitted', 'S', 'M', 'L'],
    regionOrigin: 'Pan-Cameroon Luxury Bridal',
    fabricType: 'French Chantilly Lace & Beaded Toghu Velvet',
    featured: true,
    createdAt: '2026-04-22'
  },
  {
    id: '7',
    name: 'Contemporary Dashiki Tailored 2-Piece Suit',
    price: 78000,
    category: 'Bespoke Men',
    description: 'Sharp slim-fit two-piece jacket and tapered trousers with tailored mandarin collar and tonal monochrome Dashiki symmetry embroidery. Tailored for red carpets and modern business leaders.',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'Mboa Sartorial Men',
      location: 'Akwa, Douala',
      phone: '+237655029384',
      email: 'mboa.sartorial@gmail.com',
      rating: 4.9,
      salesCount: 52,
      verified: true
    },
    condition: 'New',
    sizes: ['38R', '40R', '42R', '44L'],
    regionOrigin: 'Douala Sartorial Quarter',
    fabricType: 'Tropical Italian Wool blend with Cotton Accents',
    featured: false,
    createdAt: '2026-04-23'
  },
  {
    id: '8',
    name: 'Bamileke Royal Beaded Headdress & Choker Set',
    price: 48000,
    category: 'Accessories',
    description: 'Museum-grade royal accessory set handcrafted with thousands of microscopic glass beads woven into serpent and chameleon motifs symbolizing wisdom and royal longevity.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'Foumban Royal Bead Artisans',
      location: 'Foumban / Bafoussam',
      phone: '+237678129033',
      email: 'foumban.beads@gmail.com',
      rating: 5.0,
      salesCount: 75,
      verified: true
    },
    condition: 'New',
    sizes: ['One Size Adjustable'],
    regionOrigin: 'West Region (Bandjoun/Foumban)',
    fabricType: 'Glass seed beads & Vegetable-tanned leather',
    featured: true,
    createdAt: '2026-04-24'
  },
  {
    id: '9',
    name: 'Handcrafted Cowrie Shell Statement Corset & Belt',
    price: 38000,
    category: 'Accessories',
    description: 'Statement couture corset belt embellished with hundreds of natural polished sea cowrie shells and antique brass coins. Perfect layering piece over crisp shirts or monochrome dresses.',
    image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'Limbe Coastline Artisans Guild',
      location: 'Limbe Beachfront, South West',
      phone: '+237671239845',
      email: 'limbe.artisans@yahoo.com',
      rating: 4.7,
      salesCount: 43,
      verified: true
    },
    condition: 'New',
    sizes: ['S/M', 'L/XL'],
    regionOrigin: 'South West (Limbe Coast)',
    fabricType: 'Natural Cowrie Shells & Genuine Suede',
    featured: false,
    createdAt: '2026-04-25'
  },
  {
    id: '10',
    name: 'Handmade Ndop Pattern Luxury Leather Loafers',
    price: 58000,
    category: 'Shoes',
    description: 'Artisanal driving loafers handcrafted in Maroua leather workshops. Features authentic Ndop woven canvas upper inserts, hand-stitched welt, and cushioned memory-foam leather insoles.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'Maroua Leathercraft Masters',
      location: 'Maroua / Douala Depot',
      phone: '+237694551209',
      email: 'maroua.leather@gmail.com',
      rating: 4.9,
      salesCount: 88,
      verified: true
    },
    condition: 'New',
    sizes: ['40', '41', '42', '43', '44', '45', '46'],
    regionOrigin: 'Far North (Maroua)',
    fabricType: 'Full-Grain Calf Leather & Indigo Ndop Cloth',
    featured: true,
    createdAt: '2026-04-26'
  },
  {
    id: '11',
    name: 'Modern Kente & Velvet Mermaid Reception Dress',
    price: 85000,
    category: 'Modern',
    description: 'Sculpted mermaid evening silhouette crafted from stretch black micro-velvet with hand-woven Kente inserts along the hourglass seams and sweetheart neckline.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'Bikutsi Chic Creations',
      location: 'Bastos, Yaoundé',
      phone: '+237679331044',
      email: 'bikutsi.chic@gmail.com',
      rating: 4.8,
      salesCount: 36,
      verified: true
    },
    condition: 'New',
    sizes: ['S', 'M', 'L'],
    regionOrigin: 'Yaoundé Bastos Chic',
    fabricType: 'Stretch Micro-Velvet & Woven Jacquard',
    featured: false,
    createdAt: '2026-04-27'
  },
  {
    id: '12',
    name: 'Authentic Royal Velvet Toghu Slippers & Mule',
    price: 32000,
    category: 'Shoes',
    description: 'Traditional slip-on mules with embroidered floral Toghu patterns on velvet with genuine leather sole. Worn by dignitaries at traditional weddings and cultural festivals.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80'
    ],
    seller: {
      name: 'Simon Tangu Footwear Atelier',
      location: 'Commercial Ave, Bamenda',
      phone: '+237650135276',
      email: 'simontangu317@gmail.com',
      rating: 4.9,
      salesCount: 67,
      verified: true
    },
    condition: 'New',
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    regionOrigin: 'North West (Bamenda)',
    fabricType: 'Heavy Velvet & Hand Embroidery',
    featured: false,
    createdAt: '2026-04-28'
  }
];

export const INITIAL_ORDERS: import('./types').Order[] = [
  {
    id: 'ord_101',
    orderNumber: 'KS-ORD-9842',
    productId: '1',
    productName: 'Royal Bamenda Hand-Embroidered Toghu Regalia',
    productPrice: 185000,
    productImage: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80',
    productCategory: 'Traditional',
    sellerName: 'Simon Tangu Heritage Ateliers',
    sellerPhone: '+237650135276',
    sellerLocation: 'Commercial Ave, Bamenda',
    buyerId: 'usr_douala_01',
    buyerName: 'Dr. Jean-Paul Mbarga',
    buyerEmail: 'jp.mbarga@gmail.com',
    buyerPhone: '+237677442299',
    buyerCity: 'Douala (Akwa Hub)',
    deliveryAddress: 'Boulevard de la Liberté, Akwa, Douala',
    deliveryAgency: 'Buca Voyages Express Agency',
    trackingNumber: 'BUCA-DLA-84920',
    size: 'XL',
    notes: 'Please double-stitch the cuffs for a traditional wedding.',
    paymentMethod: 'mtn_momo',
    paymentRef: 'MOMO-KS-774921',
    paymentPhoneOrCard: '+237 677 44 22 99',
    currency: 'FCFA',
    amountPaidFcfa: 185000,
    escrowStatus: 'dispatched',
    createdAt: '2026-05-02T10:15:00Z',
    updatedAt: '2026-05-02T14:30:00Z',
    dispatchedAt: '2026-05-02T14:30:00Z'
  },
  {
    id: 'ord_102',
    orderNumber: 'KS-ORD-9843',
    productId: '2',
    productName: 'Sawa Kaba Ngondo Ceremonial Silk Robe',
    productPrice: 65000,
    productImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80',
    productCategory: 'Traditional',
    sellerName: 'Ngo Mbog Coastal Silks & Kaba',
    sellerPhone: '+237677894210',
    sellerLocation: 'Bonanjo, Douala',
    buyerId: 'usr_yaounde_02',
    buyerName: 'Clarisse Eyenga',
    buyerEmail: 'c.eyenga@outlook.com',
    buyerPhone: '+237699318855',
    buyerCity: 'Yaoundé (Bastos)',
    deliveryAddress: 'Ambassadorial Quarter, Bastos, Yaoundé',
    deliveryAgency: 'Finexs Voyages Agency',
    trackingNumber: 'FNX-YDE-19042',
    size: 'M',
    notes: 'Gift wrapping requested for mother’s day.',
    paymentMethod: 'orange_money',
    paymentRef: 'OM-KS-883912',
    paymentPhoneOrCard: '+237 699 31 88 55',
    currency: 'FCFA',
    amountPaidFcfa: 65000,
    escrowStatus: 'delivered',
    createdAt: '2026-05-01T09:00:00Z',
    updatedAt: '2026-05-02T16:00:00Z',
    dispatchedAt: '2026-05-01T15:00:00Z',
    deliveredAt: '2026-05-02T16:00:00Z'
  },
  {
    id: 'ord_103',
    orderNumber: 'KS-ORD-9844',
    productId: '12',
    productName: 'Authentic Royal Velvet Toghu Slippers & Mule',
    productPrice: 32000,
    productImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80',
    productCategory: 'Shoes',
    sellerName: 'Simon Tangu Footwear Atelier',
    sellerPhone: '+237650135276',
    sellerLocation: 'Commercial Ave, Bamenda',
    buyerId: 'usr_bafoussam_03',
    buyerName: 'Emmanuel Kuete',
    buyerEmail: 'e.kuete@yahoo.fr',
    buyerPhone: '+237654129988',
    buyerCity: 'Bafoussam',
    deliveryAddress: 'Marché A, Bafoussam',
    deliveryAgency: 'Amour Mezam Travel',
    trackingNumber: 'AMZ-BAF-33821',
    size: '43',
    notes: 'Standard fit.',
    paymentMethod: 'mtn_momo',
    paymentRef: 'MOMO-KS-993810',
    paymentPhoneOrCard: '+237 654 12 99 88',
    currency: 'FCFA',
    amountPaidFcfa: 32000,
    escrowStatus: 'escrow_released',
    createdAt: '2026-04-29T11:20:00Z',
    updatedAt: '2026-05-01T10:00:00Z',
    dispatchedAt: '2026-04-29T16:00:00Z',
    deliveredAt: '2026-04-30T17:00:00Z',
    payoutReleasedAt: '2026-05-01T10:00:00Z'
  },
  {
    id: 'ord_104',
    orderNumber: 'KS-ORD-9845',
    productId: '3',
    productName: 'Western Grassfields Ndop Royal Tunic & Wrapper',
    productPrice: 140000,
    productImage: 'https://images.unsplash.com/photo-1549037173-e3b717902c57?auto=format&fit=crop&q=80',
    productCategory: 'Traditional',
    sellerName: 'Chefferie Bandjoun Ndop Guild',
    sellerPhone: '+237699120485',
    sellerLocation: 'Bafoussam / Bandjoun, West',
    buyerId: 'usr_diaspora_04',
    buyerName: 'Sarah Njoya (Diaspora France)',
    buyerEmail: 'sarah.njoya@paris.fr',
    buyerPhone: '+33 6 45 88 12 90',
    buyerCity: 'Paris / DHL International',
    deliveryAddress: '14 Rue de Rivoli, 75001 Paris, France',
    deliveryAgency: 'DHL Express International Cameroon',
    trackingNumber: 'DHL-CMR-77821094',
    size: 'Custom Fitted',
    notes: 'Include certificate of cultural authenticity for French customs.',
    paymentMethod: 'card',
    paymentRef: 'CARD-KS-554910',
    paymentPhoneOrCard: '•••• 4242',
    currency: 'EUR',
    amountPaidFcfa: 140000,
    escrowStatus: 'escrow_held',
    createdAt: '2026-05-03T08:10:00Z',
    updatedAt: '2026-05-03T08:10:00Z'
  }
];

export const INITIAL_PAYOUTS: import('./types').Payout[] = [
  {
    id: 'pay_01',
    sellerName: 'Simon Tangu Heritage Ateliers',
    amountFcfa: 217000,
    method: 'mtn_momo',
    accountNumber: '+237 650 135 276',
    accountName: 'Simon Tangu (Verified)',
    status: 'completed',
    reference: 'PAY-MOMO-99482',
    createdAt: '2026-04-28'
  },
  {
    id: 'pay_02',
    sellerName: 'Chefferie Bandjoun Ndop Guild',
    amountFcfa: 140000,
    method: 'orange_money',
    accountNumber: '+237 699 120 485',
    accountName: 'Bandjoun Heritage Treasury',
    status: 'completed',
    reference: 'PAY-OM-38291',
    createdAt: '2026-04-25'
  }
];
