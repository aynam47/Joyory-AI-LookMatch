export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  shade?: string;
  color_family?: string;
  undertone?: string;
  finish?: string;
  texture?: string;
  coverage?: string;
  skin_types?: string[];
  features?: string[];
  key_ingredients?: string[];
  image: string;
  originalPrice?: number;
}

export const ALL_FEATURES = [
  'long lasting', 'hydrating', 'vegan', 'plumping', 'lightweight',
  'oil control', '24h wear', 'cruelty-free', 'waterproof', 'lengthening',
  'smudge-proof', 'hyaluronic acid', 'fragrance-free', 'spf 50', 'no white cast'
];

export const CATEGORIES = [
  { name: 'Skincare', icon: '✨', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&h=400&fit=crop&auto=format', count: 142 },
  { name: 'Makeup', icon: '💄', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=400&fit=crop&auto=format', count: 98 },
  { name: 'Haircare', icon: '🌿', image: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=300&h=400&fit=crop&auto=format', count: 73 },
  { name: 'Fragrance', icon: '🌸', image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=300&h=400&fit=crop&auto=format', count: 56 },
  { name: 'Offers', icon: '🏷️', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=400&fit=crop&auto=format', count: 120 },
];

const BRANDS = ['Lumière', 'Aura', 'Silk & Soul', 'Glow Lab', 'Velvet', 'Pure Essence', 'Botanica', 'Oasis'];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItems<T>(arr: T[], min: number, max: number): T[] {
  const count = getRandomInt(min, max);
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const PRODUCT_NAMES: Record<string, string[]> = {
  'Skincare': [
    'Hydrating Cleanser', 'Vitamin C Brightening Serum', 'Daily Defense SPF 50', 
    'Night Repair Cream', 'Rosewater Soothing Toner', 'Gentle Exfoliating Scrub', 
    'Hyaluronic Acid Gel', 'Peptide Eye Cream', 'Clay Detox Mask', 'Squalane Face Oil'
  ],
  'Makeup': [
    'Velvet Matte Lipstick', 'Luminous Liquid Foundation', 'Max Volume Mascara', 
    'Radiant Peach Blush', 'Precision Ink Eyeliner', 'Flawless Setting Spray', 
    'Dewy Skin Primer', 'Satin Finish Lip Gloss', 'Contour & Highlight Palette', 'Brow Sculpting Gel'
  ],
  'Haircare': [
    'Nourishing Argan Shampoo', 'Deep Repair Conditioner', 'Intense Moisture Hair Mask', 
    'Heat Protectant Spray', 'Volumizing Root Mousse', 'Scalp Revitalizing Serum', 
    'Leave-in Detangler', 'Dry Shampoo Mist', 'Smoothing Hair Oil', 'Color Protect Shampoo'
  ],
  'Fragrance': [
    'Rose & Oud Eau de Parfum', 'Vanilla Bourbon Scent', 'Ocean Breeze Cologne', 
    'Midnight Bloom Perfume', 'Citrus Splash EDT', 'Amber Wood Essence', 
    'Jasmine & Lily Perfume', 'Sandalwood Musk', 'Wild Fig & Cassis', 'Bergamot Bloom'
  ]
};

function generateProducts(category: string, count: number, startId: number): Product[] {
  const products: Product[] = [];
  const basePrice = category === 'Fragrance' ? 2500 : category === 'Skincare' ? 800 : 500;
  
  for (let i = 0; i < count; i++) {
    const isOffer = category === 'Offers' || Math.random() > 0.8;
    const price = getRandomInt(basePrice, basePrice + 3000);
    const originalPrice = isOffer ? price + getRandomInt(200, 1000) : undefined;
    const cat = category === 'Offers' ? CATEGORIES[getRandomInt(0, 3)].name : category;
    
    let image = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop&auto=format';
    if (cat === 'Skincare') image = 'https://images.unsplash.com/photo-1570194065650-d60fd23d517f?w=500&h=500&fit=crop&auto=format';
    else if (cat === 'Makeup') image = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop&auto=format';
    else if (cat === 'Haircare') image = 'https://images.unsplash.com/photo-1526685412586-ce6e71911961?w=500&h=500&fit=crop&auto=format';
    else if (cat === 'Fragrance') image = 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=500&h=500&fit=crop&auto=format';

    const namesList = PRODUCT_NAMES[cat] || PRODUCT_NAMES['Skincare'];
    const randomName = namesList[getRandomInt(0, namesList.length - 1)];

    products.push({
      id: startId + i,
      name: randomName,
      brand: BRANDS[getRandomInt(0, BRANDS.length - 1)],
      category: cat,
      price: price,
      originalPrice: originalPrice,
      features: getRandomItems(ALL_FEATURES, 2, 4),
      image: image,
    });
  }
  return products;
}

import productsData from '../../backend/app/data/products.json';

export const ALL_PRODUCTS: Product[] = productsData as Product[];
