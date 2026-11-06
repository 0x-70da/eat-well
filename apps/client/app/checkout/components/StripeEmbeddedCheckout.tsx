"use client";

import React, { useMemo, useState, useEffect } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { ShieldCheck, Clock, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export interface StripeEmbeddedCheckoutProps {
  clientSecret: string;
  publishableKey?: string;
  orderNumber: string;
  amount: number;
  expiresAt?: number;
  onCancel?: () => void;
}

export function StripeEmbeddedCheckout({
  clientSecret,
  publishableKey,
  orderNumber,
  amount,
  expiresAt,
  onCancel,
}: StripeEmbeddedCheckoutProps) {
  const activeKey =
    publishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  const stripePromise = useMemo<Promise<Stripe | null> | null>(() => {
    if (!activeKey) return null;
    return loadStripe(activeKey);
  }, [activeKey]);

  // Expiration countdown
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = expiresAt - now;
      if (remaining <= 0) {
        setTimeLeft("انتهت صلاحية جلسة الدفع");
        return;
      }
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      setTimeLeft(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!activeKey) {
    return (
      <div className="p-8 rounded-3xl bg-card border border-destructive/20 text-center space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground">
          بوابة دفع Stripe غير مهيأة
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          لم يتم العثور على مفتاح النشر (Stripe Publishable Key). يرجى التأكد من
          إعداد المتغيرات أو اختيار وسيلة دفع أخرى مثل الدفع عند الاستلام.
        </p>
        {onCancel && (
          <Button onClick={onCancel} variant="outline" className="rounded-xl">
            العودة لخيارات الدفع
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Checkout Session Header Banner */}
      <div className="p-5 rounded-3xl bg-primary/5 border border-primary/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <h3 className="text-base font-bold text-foreground">
              الدفع الآمن عبر Stripe
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            طلب رقم{" "}
            <span className="font-semibold text-foreground">{orderNumber}</span>{" "}
            • الإجمالي:{" "}
            <span className="font-bold text-primary">
              {amount.toFixed(2)} ج.م
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {timeLeft && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              <span>مهلة الدفع: {timeLeft}</span>
            </div>
          )}

          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <span>إلغاء والعودة</span>
              <ArrowRight className="w-3.5 h-3.5 mr-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Official Stripe Embedded Checkout */}
      <div
        id="checkout"
        className="rounded-3xl border border-border/80 bg-background overflow-hidden p-2 min-h-[420px]"
      >
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout className="w-full" />
        </EmbeddedCheckoutProvider>
      </div>

      <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground/80" />
        <span>
          يتم تشفير وتأمين معلومات الدفع بنسبة 100% وفق أعلى معايير أمان PCI
          DSS.
        </span>
      </p>
    </div>
  );
}
