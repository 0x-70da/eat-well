"use client";

import { useEffect } from "react";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Checkout page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-md mx-auto p-8 rounded-2xl bg-destructive/5 border border-destructive/20">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">
          حدث خطأ أثناء تحميل صفحة الدفع
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          يرجى التحقق من اتصالك والمحاولة مرة أخرى.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => reset()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </Button>
          <Link href="/cart" className={buttonVariants({ variant: "outline" })}>
            العودة للسلة
          </Link>
        </div>
      </div>
    </div>
  );
}
