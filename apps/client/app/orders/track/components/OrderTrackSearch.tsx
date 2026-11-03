"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

export interface OrderTrackSearchProps {
  initialValue?: string;
}

export function OrderTrackSearch({ initialValue = "" }: OrderTrackSearchProps) {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState(initialValue);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    router.push(`/orders/track/${encodeURIComponent(orderNumber.trim())}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto"
    >
      <div className="relative w-full">
        <Input
          placeholder="أدخل رقم الطلب (مثال: ORD-26-A1B2)"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="rounded-2xl h-12 pr-4 pl-10 text-sm font-mono uppercase"
        />
        <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={!orderNumber.trim()}
        className="w-full sm:w-auto rounded-2xl font-bold h-12 px-6 shrink-0 cursor-pointer"
      >
        تتبع الطلب
      </Button>
    </form>
  );
}
