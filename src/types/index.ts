export type PageName =
  | 'onboarding'
  | 'home'
  | 'products'
  | 'cart'
  | 'goalSelect'
  | 'complete'
  | 'goals'
  | 'records';

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  detailDescription: string;
  price: number;
  originalPrice: number;
  stockCount: number;
  rating: number;
  reviewCount: number;
  imageEmoji: string;
  imageUrl?: string;
  tags: string[];
  savingMessage: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  imageEmoji: string;
  quantity: number;
}

export interface SavingGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
}

export interface SavingRecord {
  id: string;
  goalId: string;
  goalTitle: string;
  amount: number;
  itemSummary: string;
  itemNames: string[];
  createdAt: string;
}

export interface SavingStats {
  totalSavedAmount: number;
  totalSavingCount: number;
}

export function getDiscountRate(product: Product): number {
  if (product.originalPrice <= 0 || product.originalPrice <= product.price) {
    return 0;
  }

  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
}

export function isProductDiscounted(product: Product): boolean {
  return product.originalPrice > product.price;
}