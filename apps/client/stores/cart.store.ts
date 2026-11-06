import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
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

export interface CartProductInput {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  price: number | string;
}

interface CartState {
  items: CartItem[];
  appliedCoupon: ValidateCouponResult | null;
  isCartOpen: boolean;
  hasHydrated: boolean;
}

interface CartActions {
  addItem: (
    product: CartProductInput,
    quantity: number,
    size?: CartItemSize | null,
    addons?: CartItemOption[],
    instructions?: string,
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: ValidateCouponResult) => void;
  removeCoupon: () => void;
  setIsCartOpen: (open: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    immer((set) => ({
      items: [],
      appliedCoupon: null,
      isCartOpen: false,
      hasHydrated: false,

      setHasHydrated: (hydrated: boolean) =>
        set((state) => {
          state.hasHydrated = hydrated;
        }),

      setIsCartOpen: (open: boolean) =>
        set((state) => {
          state.isCartOpen = open;
        }),

      applyCoupon: (coupon: ValidateCouponResult) =>
        set((state) => {
          state.appliedCoupon = coupon;
        }),

      removeCoupon: () =>
        set((state) => {
          state.appliedCoupon = null;
        }),

      clearCart: () =>
        set((state) => {
          state.items = [];
          state.appliedCoupon = null;
        }),

      removeItem: (itemId: string) =>
        set((state) => {
          state.items = state.items.filter((i) => i.id !== itemId);
        }),

      updateQuantity: (itemId: string, quantity: number) =>
        set((state) => {
          if (quantity <= 0) {
            state.items = state.items.filter((i) => i.id !== itemId);
            return;
          }
          const item = state.items.find((i) => i.id === itemId);
          if (item) {
            item.quantity = quantity;
            item.totalPrice = item.unitPrice * quantity;
          }
        }),

      addItem: (product, quantity, size = null, addons = [], instructions = "") =>
        set((state) => {
          const baseP = Number(product.price);
          const sizeAdj = size ? Number(size.priceAdjustment) : 0;
          const addonsTotal = (addons || []).reduce(
            (sum, a) => sum + Number(a.price || 0),
            0,
          );
          const unitPrice = baseP + sizeAdj + addonsTotal;
          const compositeId = generateCompositeKey(product.id, size, addons);

          const existing = state.items.find((i) => i.id === compositeId);
          if (existing) {
            const newQty = existing.quantity + quantity;
            existing.quantity = newQty;
            existing.totalPrice = unitPrice * newQty;
            existing.specialInstructions =
              instructions || existing.specialInstructions;
          } else {
            state.items.push({
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
            });
          }
          state.isCartOpen = true;
        }),
    })),
    {
      name: "eatwell_cart_store_v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

// Helpers
function generateCompositeKey(
  productId: string,
  size?: CartItemSize | null,
  addons?: CartItemOption[],
): string {
  const addonKey = (addons || [])
    .map((a) => a.itemId || a.name)
    .sort()
    .join("-");
  return `${productId}_${size?.sizeId || "default"}_${addonKey}`;
}
