"use client";

import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { ArrowRight } from "lucide-react";

export function BackButton({ label = "العودة للخلف" }: { label?: string }) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 cursor-pointer"
    >
      <ArrowRight className="w-4 h-4" />
      <span>{label}</span>
    </Button>
  );
}
