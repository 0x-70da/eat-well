"use client";

import { useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Products page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center space-y-4 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-bold">حدث خطأ أثناء تحميل قائمة الوجبات</h2>
        <p className="text-xs text-muted-foreground">يرجى التحقق من الخادم والمحاولة مرة أخرى.</p>
      </div>
      <Button onClick={() => reset()} size="sm" className="gap-2">
        <RotateCcw className="h-4 w-4" />
        <span>إعادة المحاولة</span>
      </Button>
    </div>
  );
}
