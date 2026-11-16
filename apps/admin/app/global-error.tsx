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
      <body className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
        <div className="max-w-md space-y-4 text-center">
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
