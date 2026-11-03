"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product, ProductSize, ProductAddonItem } from "@workspace/types";
import { useCart, type CartItemOption, type CartItemSize } from "@/hooks/useCart";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { BackButton } from "@/components/helper-components/BackButton";
import {
  Clock,
  Flame,
  Check,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Star,
} from "lucide-react";

export interface ProductDetailsViewProps {
  product: Product;
}

export function ProductDetailsView({ product }: ProductDetailsViewProps) {
  const { addItem } = useCart();

  const defaultSize = product.sizes?.find((s) => s.isDefault) || product.sizes?.[0] || null;
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(defaultSize);
  const [selectedAddons, setSelectedAddons] = useState<Map<string, CartItemOption>>(
    new Map(),
  );
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const toggleAddon = (
    groupNameAr: string,
    item: ProductAddonItem,
    maxSelections: number,
  ) => {
    setSelectedAddons((prev) => {
      const next = new Map(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        if (maxSelections === 1) {
          for (const [key, val] of next.entries()) {
            if (val.groupId === item.groupId) {
              next.delete(key);
            }
          }
        }
        next.set(item.id, {
          groupId: item.groupId,
          groupName: groupNameAr,
          itemId: item.id,
          name: item.name,
          nameAr: item.nameAr,
          price: Number(item.price),
        });
      }
      return next;
    });
  };

  const basePrice = Number(product.price);
  const sizeAdjustment = selectedSize ? Number(selectedSize.priceAdjustment) : 0;
  const addonsTotal = Array.from(selectedAddons.values()).reduce(
    (sum, a) => sum + a.price,
    0,
  );
  const unitPrice = basePrice + sizeAdjustment + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const sizePayload: CartItemSize | null = selectedSize
      ? {
          sizeId: selectedSize.id,
          name: selectedSize.name,
          nameAr: selectedSize.nameAr,
          priceAdjustment: Number(selectedSize.priceAdjustment),
        }
      : null;

    addItem(
      {
        id: product.id,
        name: product.name,
        nameAr: product.nameAr,
        image: product.image,
        price: product.price,
      },
      quantity,
      sizePayload,
      Array.from(selectedAddons.values()),
      specialInstructions,
    );
  };

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <BackButton label="العودة لقائمة الطعام" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Product Image */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-xl border border-border bg-muted">
          <Image
            src={product.image}
            alt={product.nameAr}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 500px"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            {product.isFeatured && (
              <Badge className="bg-primary text-primary-foreground font-bold shadow-xs">
                وجبة مميزة
              </Badge>
            )}
            {product.spicyLevel > 0 && (
              <Badge className="bg-rose-500 text-white font-bold gap-1 shadow-xs">
                <Flame className="w-3.5 h-3.5" />
                <span>حار</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Product Details & Customization options */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <span>{product.category?.nameAr || "أطباق شرقية"}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{product.rating} ({product.reviewsCount} تقييم)</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              {product.nameAr}
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {product.descriptionAr}
            </p>

            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-2xl font-black text-primary">
                {unitPrice} ج.م
              </span>
              {product.originalPrice && Number(product.originalPrice) > unitPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice} ج.م
                </span>
              )}
            </div>
          </div>

          {/* Quick info badges */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-muted/30 p-3 rounded-2xl border border-border/60">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>وقت التحضير: {product.prepTimeMinutes} دقيقة</span>
            </div>
            {product.calories && (
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>السعرات: {product.calories} ك.سعرة</span>
              </div>
            )}
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold block">اختر الحجم المناسب:</label>
              <div className="grid grid-cols-2 gap-2">
                {product.sizes.map((s) => {
                  const isSelected = selectedSize?.id === s.id;
                  const adj = Number(s.priceAdjustment);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                          : "border-border hover:bg-muted/40 text-foreground"
                      }`}
                    >
                      <div className="text-xs">
                        <span className="block">{s.nameAr}</span>
                        {adj > 0 && (
                          <span className="text-[10px] text-muted-foreground block">
                            +{adj} ج.م
                          </span>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Addons */}
          {product.addonGroups &&
            product.addonGroups.map((grp) => (
              <div key={grp.id} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold">{grp.nameAr}</label>
                  <span className="text-[10px] text-muted-foreground">
                    {grp.maxSelections === 1 ? "خيار واحد" : `حتى ${grp.maxSelections} خيارات`}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {grp.items.map((item) => {
                    const isChecked = selectedAddons.has(item.id);
                    const pr = Number(item.price);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleAddon(grp.nameAr, item, grp.maxSelections)}
                        className={`w-full p-2.5 rounded-xl border text-right flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          isChecked
                            ? "border-primary/80 bg-primary/5 font-semibold text-foreground"
                            : "border-border hover:bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded ${
                              grp.maxSelections === 1 ? "rounded-full" : "rounded-sm"
                            } border flex items-center justify-center ${
                              isChecked
                                ? "bg-primary border-primary text-white"
                                : "border-muted-foreground/40 bg-background"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span>{item.nameAr}</span>
                        </div>
                        <span>{pr > 0 ? `+${pr} ج.م` : "مجاناً"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Special instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold block">ملاحظات خاصة للطلب:</label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="مثال: زيادة صوص، بدون طماطم..."
              className="w-full text-xs rounded-xl border border-input bg-background p-2.5 focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Quantity & Add to Cart button */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <div className="flex items-center border border-border rounded-xl overflow-hidden bg-background">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 text-sm font-bold min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              size="lg"
              className="flex-1 font-bold gap-2 text-sm shadow-lg shadow-primary/25 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>إضافة إلى السلة ({totalPrice} ج.م)</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
