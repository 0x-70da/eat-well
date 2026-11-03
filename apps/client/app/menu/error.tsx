"use client";

import { useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function MenuError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Menu page error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-bold">حدث خطأ أثناء تحميل قائمة الطعام</h2>
        <p className="text-xs text-muted-foreground">
          يرجى التحقق من اتصالك والمحاولة مجدداً.
        </p>
      </div>
      <Button onClick={() => reset()} size="sm" className="gap-2 cursor-pointer">
        <RotateCcw className="w-4 h-4" />
        <span>إعادة المحاولة</span>
      </Button>
    </div>
  );
}
