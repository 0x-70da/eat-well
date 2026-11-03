export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod = "cod" | "stripe" | "paymob";

export type OrderType = "delivery" | "pickup";

export interface SelectedAddonPayload {
  groupId: string;
  groupName: string;
  itemId: string;
  name: string;
  nameAr: string;
  price: number;
}

export interface SelectedSizePayload {
  sizeId: string;
  name: string;
  nameAr: string;
  priceAdjustment: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string | null;
  productName: string;
  productNameAr: string;
  productImage?: string | null;
  productPrice: string | number;
  quantity: number;
  selectedSize?: string | null; // serialized JSON
  selectedAddons?: string | null; // serialized JSON
  specialInstructions?: string | null;
  totalPrice: string | number;
}

export interface OrderStatusHistoryItem {
  id: string;
  orderId: string;
  fromStatus?: string | null;
  toStatus: string;
  note?: string | null;
  changedBy: string;
  createdAt: Date | string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryAddress: string;
  deliveryInstructions?: string | null;
  orderType: OrderType;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: string | number;
  discountAmount: string | number;
  deliveryFee: string | number;
  taxAmount: string | number;
  totalAmount: string | number;
  couponCode?: string | null;
  cancellationReason?: string | null;
  estimatedDeliveryMinutes: number;
  deliveredAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  items?: OrderItem[];
  statusHistory?: OrderStatusHistoryItem[];
}

export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  descriptionAr?: string | null;
  discountType: "percentage" | "fixed";
  discountValue: string | number;
  minOrderAmount: string | number;
  maxDiscountAmount?: string | number | null;
  usageLimit?: number | null;
  usedCount: number;
  expiresAt?: Date | string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ValidateCouponResult {
  valid: boolean;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
  message?: string;
}
