"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { CartItem } from "@/hooks/useCart";

export interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card border border-border/60 rounded-2xl gap-4 transition-colors hover:border-primary/20">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/40">
          <Image
            src={item.image}
            alt={item.nameAr || item.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="font-bold text-foreground text-base">
            {item.nameAr || item.name}
          </h3>
          {item.selectedSize && (
            <p className="text-xs text-muted-foreground font-medium">
              الحجم: {item.selectedSize.nameAr || item.selectedSize.name}
            </p>
          )}
          {item.selectedAddons && item.selectedAddons.length > 0 && (
            <div className="text-xs text-muted-foreground">
              الإضافات:{" "}
              {item.selectedAddons.map((a) => a.nameAr || a.name).join("، ")}
            </div>
          )}
          {item.specialInstructions && (
            <p className="text-xs text-amber-600 dark:text-amber-400 italic">
              ملاحظات: {item.specialInstructions}
            </p>
          )}
          <div className="text-sm font-bold text-primary sm:hidden pt-1">
            {item.totalPrice} ج.م
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
        <div className="flex items-center border border-border rounded-xl bg-background p-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <Minus className="w-3.5 h-3.5" />
          </Button>
          <span className="w-8 text-center text-sm font-black font-mono">
            {item.quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="hidden sm:block text-left min-w-[90px]">
          <span className="text-base font-black text-foreground font-mono">
            {item.totalPrice}
          </span>
          <span className="text-xs text-muted-foreground mr-1">ج.م</span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onRemove(item.id)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
          title="حذف من السلة"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
