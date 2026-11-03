export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description?: string | null;
  descriptionAr?: string | null;
  image?: string | null;
  sortOrder: number;
  isActive: boolean;
  parentId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  productCount?: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductSize {
  id: string;
  productId: string;
  name: string;
  nameAr: string;
  priceAdjustment: string | number;
  isDefault: boolean;
}

export interface ProductAddonItem {
  id: string;
  groupId: string;
  name: string;
  nameAr: string;
  price: string | number;
  isAvailable: boolean;
}

export interface ProductAddonGroup {
  id: string;
  productId: string;
  name: string;
  nameAr: string;
  minSelections: number;
  maxSelections: number;
  isRequired: boolean;
  items: ProductAddonItem[];
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description?: string | null;
  descriptionAr?: string | null;
  price: string | number;
  originalPrice?: string | number | null;
  categoryId: string;
  image: string;
  isAvailable: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  prepTimeMinutes: number;
  calories?: number | null;
  rating: string | number;
  reviewsCount: number;
  orderCount: number;
  spicyLevel: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  category?: Category | null;
  images?: ProductImage[];
  sizes?: ProductSize[];
  addonGroups?: ProductAddonGroup[];
}

export interface RestaurantSettings {
  id: string;
  restaurantName: string;
  restaurantNameAr: string;
  slogan?: string | null;
  sloganAr?: string | null;
  descriptionAr?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  phone: string;
  secondaryPhone?: string | null;
  email?: string | null;
  addressAr: string;
  openingHour: string;
  closingHour: string;
  isDeliveryOpen: boolean;
  deliveryFee: string | number;
  minOrderAmount: string | number;
  estimatedPrepTimeMinutes: number;
  currency: string;
  currencyCode: string;
  taxRate: string | number;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  whatsappNumber?: string | null;
  updatedAt: Date | string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId?: string | null;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date | string;
}

export interface DeliveryAddress {
  id: string;
  userId?: string | null;
  title: string;
  customerName: string;
  customerPhone: string;
  city: string;
  area: string;
  street: string;
  building: string;
  floor?: string | null;
  apartment?: string | null;
  notes?: string | null;
  isDefault: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
