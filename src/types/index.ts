// Type definitions for ShowSales

export interface Sale {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  brandId: string;
  brandName: string;
  brandLogo?: string;
  category: string;
  discountPercentage: number;
  originalPrice?: number;
  salePrice?: number;
  image: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isFeatured: boolean;
  link: string;
  views?: number;
  affiliateClicks?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  website: string;
  category: string;
  isActive: boolean;
  salesCount?: number;
  createdAt: string;
}

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  salesCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  favorites: string[];
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
}

export interface FilterOptions {
  category?: string;
  brand?: string;
  minDiscount?: number;
  maxDiscount?: number;
  sortBy?: "newest" | "discount" | "ending";
  search?: string;
}

export interface Stats {
  totalSales: number;
  totalBrands: number;
  totalUsers: number;
  totalSubscribers: number;
  activeSales: number;
}
