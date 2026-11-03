"use client";

import { useEffect } from "react";
import { Button } from "@workspace/ui/components/button";

export default function AdminGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global admin error:", error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold">خطأ في النظام</h1>
          <p className="text-sm text-muted-foreground">
            حدث خطأ حرج في النظام، يرجى إعادة المحاولة.
          </p>
          <Button onClick={() => reset()}>إعادة المحاولة</Button>
        </div>
      </body>
    </html>
  );
}
