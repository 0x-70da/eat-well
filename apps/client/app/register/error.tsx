"use client";

import { useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function RegisterError({
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
    <div className="container mx-auto max-w-md space-y-4 px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold text-foreground">حدث خطأ في صفحة إنشاء الحساب</h2>
      <p className="text-xs text-muted-foreground">تعذر تحميل الصفحة. يرجى المحاولة مرة أخرى.</p>
      <Button onClick={() => reset()} className="gap-2 rounded-xl">
        <RefreshCw className="h-4 w-4" />
        <span>إعادة المحاولة</span>
      </Button>
    </div>
  );
}
