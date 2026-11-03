export type PaymentProvider = "stripe" | "paymob" | "cod";

export interface PaymentTransaction {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  paymentMethod: string;
  transactionReference?: string | null;
  amount: string | number;
  currency: string;
  status: "pending" | "successful" | "failed" | "cancelled" | "refunded";
  metadata?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreatePaymentIntentResponse {
  provider: PaymentProvider;
  clientSecret?: string;
  paymentToken?: string;
  iframeUrl?: string;
  redirectUrl?: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
}
