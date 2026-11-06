"use client";

import { useEffect } from "react";
import { Button } from "@workspace/ui/components/button";

export default function LoginError({
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
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-bold">حدث خطأ في صفحة تسجيل الدخول</h2>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={() => reset()}>إعادة المحاولة</Button>
    </div>
  );
}
