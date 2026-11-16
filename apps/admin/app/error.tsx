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
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 p-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-7 w-7" />
      </div>
      <div className="max-w-md space-y-1.5">
        <h2 className="text-xl font-bold">حدث خطأ غير متوقع</h2>
        <p className="text-sm text-muted-foreground">
          نعتذر عن هذا الخطأ أثناء تحميل بيانات لوحة الإدارة. يرجى المحاولة مرة أخرى.
        </p>
      </div>
      <Button onClick={() => reset()} className="gap-2">
        <RotateCcw className="h-4 w-4" />
        <span>إعادة المحاولة</span>
      </Button>
    </div>
  );
}
