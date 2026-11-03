"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { ValidateCouponResult } from "@workspace/types";

export interface CartItemOption {
  groupId?: string;
  groupName?: string;
  itemId?: string;
  name: string;
  nameAr: string;
  price: number;
}

export interface CartItemSize {
  sizeId?: string;
  name: string;
  nameAr: string;
  priceAdjustment: number;
}

export interface CartItem {
  id: string; // composite key
  productId: string;
  name: string;
  nameAr: string;
  image: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  selectedSize?: CartItemSize | null;
  selectedAddons?: CartItemOption[];
  specialInstructions?: string;
  totalPrice: number;
}

interface CartContextType {
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "eatwell_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResult | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from storage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to storage:", e);
    }
  }, [items, isLoaded]);

  const addItem: CartContextType["addItem"] = (
    product,
    quantity,
    size = null,
    addons = [],
    instructions = "",
  ) => {
    const baseP = Number(product.price);
    const sizeAdj = size ? Number(size.priceAdjustment) : 0;
    const addonsTotal = (addons || []).reduce(
      (sum, a) => sum + Number(a.price || 0),
      0,
    );
    const unitPrice = baseP + sizeAdj + addonsTotal;

    // Generate unique composite ID
    const addonKey = (addons || [])
      .map((a) => a.itemId || a.name)
      .sort()
      .join("-");
    const compositeId = `${product.id}_${size?.sizeId || "default"}_${addonKey}`;

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === compositeId);
      if (existingIdx > -1) {
        const updated = [...prev];
        const existing = updated[existingIdx]!;
        const newQty = existing.quantity + quantity;
        updated[existingIdx] = {
          ...existing,
          quantity: newQty,
          totalPrice: unitPrice * newQty,
          specialInstructions: instructions || existing.specialInstructions,
        };
        return updated;
      }

      return [
        ...prev,
        {
          id: compositeId,
          productId: product.id,
          name: product.name,
          nameAr: product.nameAr,
          image: product.image,
          basePrice: baseP,
          unitPrice,
          quantity,
          selectedSize: size,
          selectedAddons: addons,
          specialInstructions: instructions,
          totalPrice: unitPrice * quantity,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              quantity,
              totalPrice: i.unitPrice * quantity,
            }
          : i,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: ValidateCouponResult) => {
    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const subtotal = items.reduce((acc, i) => acc + i.totalPrice, 0);

  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(appliedCoupon.discountValue, subtotal);
    }
    discountAmount = Math.round(discountAmount * 100) / 100;
  }

  const deliveryFee = subtotal > 0 ? 30 : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        deliveryFee,
        totalAmount,
        totalItems,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
