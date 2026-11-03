"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { Button } from "@workspace/ui/components/button";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    subtotal,
    discountAmount,
    deliveryFee,
    totalAmount,
    appliedCoupon,
    removeCoupon,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-card border-r border-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">سلة طلباتك</h2>
              <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base">سلتك فارغة</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  لم تقم بإضافة أي وجبات بعد. تصفح قائمتنا واختر أشهى المأكولات!
                </p>
                <Button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2"
                  size="sm"
                >
                  <Link href="/menu">تصفح قائمة الطعام</Link>
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl border border-border bg-card/60 relative group"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden relative shrink-0 bg-muted">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.nameAr}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs truncate">
                        {item.nameAr}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive p-0.5 transition-colors cursor-pointer"
                        title="حذف الوجبة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.selectedSize && (
                      <span className="text-[11px] text-muted-foreground block">
                        الحجم: {item.selectedSize.nameAr}
                      </span>
                    )}

                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="text-[10px] text-muted-foreground truncate">
                        الإضافات: {item.selectedAddons.map((a) => a.nameAr).join("، ")}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-xs text-primary">
                        {item.totalPrice} ج.م
                      </span>

                      {/* Quantity stepper */}
                      <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 border-t border-border bg-muted/20 space-y-3">
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-2 rounded-lg border border-emerald-500/20">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>تم تطبيق الكوبون: {appliedCoupon.code}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs hover:underline cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              )}

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>المجموع الفرعي:</span>
                  <span>{subtotal} ج.م</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>قيمة الخصم:</span>
                    <span>-{discountAmount} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>رسوم التوصيل:</span>
                  <span>{deliveryFee} ج.م</span>
                </div>
                <div className="flex justify-between text-base font-bold text-foreground border-t border-border pt-2">
                  <span>المجموع الإجمالي:</span>
                  <span className="text-primary">{totalAmount} ج.م</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 px-4 rounded-xl text-sm shadow-md shadow-primary/20 transition-all cursor-pointer"
                >
                  <span>متابعة إتمام الطلب</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
