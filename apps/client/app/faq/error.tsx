"use client";

import { useEffect } from "react";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function FaqError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Faq error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-md mx-auto p-8 rounded-2xl bg-destructive/5 border border-destructive/20">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">
          تعذر تحميل الأسئلة الشائعة
        </h2>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button onClick={() => reset()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </Button>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
