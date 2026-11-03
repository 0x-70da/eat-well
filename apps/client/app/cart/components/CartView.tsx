"use client";

import { useCart } from "@/hooks/useCart";
import { CartItemCard } from "./CartItemCard";
import { CartSummaryCard } from "./CartSummaryCard";
import { CartEmptyState } from "./CartEmptyState";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CartView() {
  const { items, updateQuantity, removeItem, clearCart, totalItems } = useCart();

  if (items.length === 0) {
    return <CartEmptyState />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/60 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-primary" />
            <span>سلة المشتريات ({totalItems} صنف)</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            قم بمراجعة أصناف وجباتك والإضافات قبل الانتقال إلى صفحة الدفع
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold text-destructive hover:underline self-start sm:self-auto cursor-pointer"
        >
          إفراغ السلة بالكامل
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}

          <div className="pt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/menu"
              className="text-primary hover:underline font-bold inline-flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>إضافة المزيد من الوجبات أو المشروبات</span>
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <CartSummaryCard />
        </div>
      </div>
    </div>
  );
}
