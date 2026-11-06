export type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  OrderStatusHistoryItem,
} from "@workspace/types";

export interface PreparedOrderItem {
  productId: string;
  productName: string;
  productNameAr: string;
  productImage?: string | null;
  productPrice: number;
  quantity: number;
  selectedSize?: string | null;
  selectedAddons?: string | null;
  specialInstructions?: string | null;
  totalPrice: number;
}

export interface PreparedOrderData {
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryAddress: string;
  deliveryInstructions?: string | null;
  orderType: string;
  paymentMethod: string;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string | null;
  estimatedDeliveryMinutes: number;
}

export interface AdminOrdersFilter {
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  search?: string;
  page: number;
  limit: number;
}
