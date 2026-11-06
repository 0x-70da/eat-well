"use client";

import { useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function OrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-md space-y-4">
      <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-foreground">حدث خطأ في جلب طلباتك</h2>
      <p className="text-xs text-muted-foreground">
        تعذر تحميل الطلبات في الوقت الحالي. يرجى إعادة المحاولة.
      </p>
      <Button onClick={() => reset()} className="gap-2 rounded-xl">
        <RefreshCw className="w-4 h-4" />
        <span>إعادة المحاولة</span>
      </Button>
    </div>
  );
}
