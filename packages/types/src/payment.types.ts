export type PaymentProvider = "stripe" | "paymob" | "cod";

export type PaymentTransactionStatus =
  "pending" | "successful" | "failed" | "cancelled" | "refunded" | "expired";

export interface PaymentTransaction {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  paymentMethod: string;
  transactionReference?: string | null;
  amount: string | number;
  currency: string;
  status: PaymentTransactionStatus;
  metadata?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreatePaymentIntentResponse {
  provider: PaymentProvider;
  clientSecret?: string;
  sessionId?: string;
  paymentToken?: string;
  iframeUrl?: string;
  redirectUrl?: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  expiresAt?: number | string;
}

export interface StripeCheckoutResponse {
  provider: "stripe";
  clientSecret: string;
  sessionId: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  expiresAt: number;
}

export interface PaymobCheckoutResponse {
  provider: "paymob";
  paymentToken: string;
  iframeUrl: string;
  redirectUrl?: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  expiresAt: number;
}

export interface PaymentAvailability {
  cod: boolean;
  stripe: boolean;
  paymob: boolean;
  publishableKey?: {
    stripe?: string;
    paymob?: string;
  };
}

export interface PaymentStatusResponse {
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: PaymentProvider;
  totalAmount: number;
  isPaid: boolean;
  isExpired: boolean;
  isCancelled: boolean;
  payment?: {
    id: string;
    status: PaymentTransactionStatus;
    provider: PaymentProvider;
    transactionReference?: string | null;
  } | null;
}
