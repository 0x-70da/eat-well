"use client";

import { useEffect, useState } from "react";
import {
  useCartStore,
  type CartItem,
  type CartItemOption,
  type CartItemSize,
} from "@/stores/cart.store";
import type { ValidateCouponResult } from "@workspace/types";

export type { CartItem, CartItemOption, CartItemSize };

export interface CartContextValue {
  items: CartItem[];
  addItem: (
    product: {
      id: string;
      name: string;
      nameAr: string;
      image: string;
      price: number | string;
    },
    quantity: number,
    size?: CartItemSize | null,
    addons?: CartItemOption[],
    instructions?: string,
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  appliedCoupon: ValidateCouponResult | null;
  applyCoupon: (coupon: ValidateCouponResult) => void;
  removeCoupon: () => void;
  discountAmount: number;
  deliveryFee: number;
  totalAmount: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoaded: boolean;
}

export function useCart(): CartContextValue {
  const [isClient, setIsClient] = useState(false);
  const items = useCartStore((state) => state.items);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const safeItems = isClient ? items : [];
  const safeCoupon = isClient ? appliedCoupon : null;

  const subtotal = safeItems.reduce((acc, i) => acc + i.totalPrice, 0);

  let discountAmount = 0;
  if (safeCoupon && subtotal > 0) {
    if (safeCoupon.discountType === "percentage") {
      discountAmount = (subtotal * safeCoupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(safeCoupon.discountValue, subtotal);
    }
    discountAmount = Math.round(discountAmount * 100) / 100;
  }

  const deliveryFee = subtotal > 0 ? 30 : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);
  const totalItems = safeItems.reduce((acc, i) => acc + i.quantity, 0);

  return {
    items: safeItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    appliedCoupon: safeCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    deliveryFee,
    totalAmount,
    totalItems,
    isCartOpen,
    setIsCartOpen,
    isLoaded: isClient,
  };
}

// Retain Provider component for backward compatibility without breaking layout trees
export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
