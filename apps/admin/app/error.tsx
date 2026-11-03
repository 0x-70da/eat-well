"use client";

import { useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
        <AlertCircle className="w-7 h-7" />
      </div>
      <div className="space-y-1.5 max-w-md">
        <h2 className="text-xl font-bold">حدث خطأ غير متوقع</h2>
        <p className="text-sm text-muted-foreground">
          نعتذر عن هذا الخطأ أثناء تحميل بيانات لوحة الإدارة. يرجى المحاولة مرة أخرى.
        </p>
      </div>
      <Button onClick={() => reset()} className="gap-2">
        <RotateCcw className="w-4 h-4" />
        <span>إعادة المحاولة</span>
      </Button>
    </div>
  );
}
