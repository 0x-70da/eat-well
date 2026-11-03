"use client";

import { useState } from "react";
import Link from "next/link";
import { Tag, ArrowLeft, Check, AlertCircle, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useCart } from "@/hooks/useCart";
import { validateCoupon } from "@/requests/validateCoupon";

export function CartSummaryCard() {
  const {
    subtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    deliveryFee,
    totalAmount,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await validateCoupon({
        code: couponCode.trim(),
        subtotal,
      });
      applyCoupon(res);
      setCouponCode("");
    } catch (err: unknown) {
      setCouponError((err as Error).message || "كود الخصم غير صحيح");
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs sticky top-24">
      <h2 className="text-xl font-black text-foreground border-b border-border/40 pb-4">
        ملخص الطلب
      </h2>

      {/* Coupon section */}
      <div>
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="font-mono font-bold text-sm text-foreground">
                  {appliedCoupon.code}
                </span>
                <p className="text-xs text-muted-foreground">
                  خصم {appliedCoupon.discountAmount} ج.م
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={removeCoupon}
              className="text-muted-foreground hover:text-destructive h-7 w-7"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="أدخل كود الخصم"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="rounded-xl pl-9 uppercase font-mono text-sm"
                />
                <Tag className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <Button
                type="submit"
                variant="outline"
                disabled={couponLoading || !couponCode.trim()}
                className="rounded-xl font-bold shrink-0"
              >
                {couponLoading ? "جاري..." : "تطبيق"}
              </Button>
            </div>
            {couponError && (
              <p className="text-xs text-destructive flex items-center gap-1 pt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {couponError}
              </p>
            )}
          </form>
        )}
      </div>

      {/* Financial breakdown */}
      <div className="space-y-3 pt-2 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>المجموع الفرعي</span>
          <span className="font-mono font-bold text-foreground">
            {subtotal} ج.م
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span>قيمة الخصم</span>
            <span className="font-mono font-bold">-{discountAmount} ج.م</span>
          </div>
        )}

        <div className="flex items-center justify-between text-muted-foreground">
          <span>رسوم التوصيل المقدرة</span>
          <span className="font-mono font-bold text-foreground">
            {deliveryFee} ج.م
          </span>
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-between text-base font-black">
          <span className="text-foreground">الإجمالي التقريبي</span>
          <div className="text-primary text-xl font-mono">
            <span>{totalAmount}</span>
            <span className="text-xs mr-1 text-muted-foreground">ج.م</span>
          </div>
        </div>
      </div>

      <div className="pt-2 space-y-3">
        <Link
          href="/checkout"
          className={buttonVariants({
            size: "lg",
            className: "w-full rounded-2xl font-black text-base gap-2 cursor-pointer shadow-lg shadow-primary/25",
          })}
        >
          <span>المتابعة إلى الدفع</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <Link
          href="/menu"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "w-full rounded-2xl font-bold text-sm cursor-pointer",
          })}
        >
          مواصلة اختيار الوجبات
        </Link>
      </div>
    </div>
  );
}
