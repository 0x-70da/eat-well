"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Clock, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";

export interface PaymobEmbeddedCheckoutProps {
  iframeUrl: string;
  redirectUrl?: string;
  orderNumber: string;
  amount: number;
  expiresAt?: number;
  onCancel?: () => void;
}

export function PaymobEmbeddedCheckout({
  iframeUrl,
  redirectUrl,
  orderNumber,
  amount,
  expiresAt,
  onCancel,
}: PaymobEmbeddedCheckoutProps) {
  const [isLoading, setIsLoading] = useState(true);
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

  // If external redirect URL is provided (e.g. mobile wallet app redirection)
  if (redirectUrl) {
    return (
      <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-5 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <ExternalLink className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground">
            تأكيد الدفع عبر المحفظة الإلكترونية
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            تم تسجيل طلبك رقم{" "}
            <span className="font-semibold text-foreground">{orderNumber}</span>{" "}
            بنجاح. يرجى الضغط على الزر أدناه لتأكيد التحويل عبر محفظتك
            الإلكترونية في Paymob.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <a
            href={redirectUrl}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            <span>الانتقال لتأكيد الدفع</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          {onCancel && (
            <Button
              onClick={onCancel}
              variant="ghost"
              className="rounded-xl text-xs"
            >
              العودة للخيارات
            </Button>
          )}
        </div>
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
              بوابة الدفع الإلكتروني Paymob
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

      {/* Embedded Paymob Iframe Container */}
      <div className="relative rounded-3xl border border-border/80 bg-background overflow-hidden min-h-[620px] shadow-sm">
        {isLoading && (
          <div className="absolute inset-0 bg-background/90 z-10 p-6 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
            <p className="text-sm text-muted-foreground">
              جاري تحميل بوابة الدفع الآمنة...
            </p>
            <Skeleton className="w-3/4 h-8 rounded-xl" />
            <Skeleton className="w-1/2 h-8 rounded-xl" />
          </div>
        )}

        <iframe
          src={iframeUrl}
          title="Paymob Payment Portal"
          className="w-full h-[620px] border-0"
          onLoad={() => setIsLoading(false)}
          allow="payment"
        />
      </div>

      <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground/80" />
        <span>
          معتمدة من البنك المركزي المصري وتخضع لبروتوكولات الأمان والحماية
          المشددة 3D Secure.
        </span>
      </p>
    </div>
  );
}
