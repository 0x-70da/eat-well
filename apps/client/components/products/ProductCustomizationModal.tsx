"use client";

import { useState } from "react";
import type { Product, ProductSize, ProductAddonItem } from "@workspace/types";
import Image from "next/image";
import { useCart, type CartItemOption, type CartItemSize } from "@/hooks/useCart";
import { Button } from "@workspace/ui/components/button";
import { X, Plus, Minus, ShoppingBag, Clock, Flame, Check } from "lucide-react";

export interface ProductCustomizationModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductCustomizationModal({
  product,
  isOpen,
  onClose,
}: ProductCustomizationModalProps) {
  const { addItem } = useCart();

  // Selected size
  const defaultSize = product.sizes?.find((s) => s.isDefault) || product.sizes?.[0] || null;
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(defaultSize);

  // Selected addon items map: itemId -> { groupName, name, nameAr, price }
  const [selectedAddons, setSelectedAddons] = useState<Map<string, CartItemOption>>(
    new Map(),
  );

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  if (!isOpen) return null;

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
          // If max selections is 1, replace previous item from the same group
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

  // Price calculation
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

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Image Header */}
        <div className="relative h-56 w-full bg-muted shrink-0">
          <Image
            src={product.image}
            alt={product.nameAr}
            fill
            className="object-cover"
            priority
            sizes="500px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 right-4 left-4 text-white">
            <h3 className="text-xl font-bold">{product.nameAr}</h3>
            <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
              {product.descriptionAr}
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Metadata badges */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>تحضير: {product.prepTimeMinutes} دقيقة</span>
            </span>
            {product.calories && (
              <span className="flex items-center gap-1 font-medium">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>{product.calories} سعرة حرارية</span>
              </span>
            )}
            <span className="font-bold text-foreground">
              التقييم: ★ {product.rating} ({product.reviewsCount})
            </span>
          </div>

          {/* Sizes options */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold block text-foreground">
                اختر الحجم المناسب:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize?.id === size.id;
                  const adj = Number(size.priceAdjustment);
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                          : "border-border hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <div className="text-xs">
                        <span className="block">{size.nameAr}</span>
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

          {/* Addon groups */}
          {product.addonGroups &&
            product.addonGroups.map((group) => (
              <div key={group.id} className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-foreground block">
                    {group.nameAr}
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    {group.maxSelections === 1
                      ? "اختر خياراً واحداً"
                      : `يمكنك اختيار حتى ${group.maxSelections} خيارات`}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {group.items.map((item) => {
                    const isChecked = selectedAddons.has(item.id);
                    const itemPrice = Number(item.price);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          toggleAddon(group.nameAr, item, group.maxSelections)
                        }
                        className={`w-full p-2.5 rounded-xl border text-right flex items-center justify-between transition-colors cursor-pointer text-xs ${
                          isChecked
                            ? "border-primary/80 bg-primary/5 text-foreground font-semibold"
                            : "border-border hover:bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded ${
                              group.maxSelections === 1 ? "rounded-full" : "rounded-sm"
                            } border flex items-center justify-center transition-colors ${
                              isChecked
                                ? "bg-primary border-primary text-white"
                                : "border-muted-foreground/40 bg-background"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span>{item.nameAr}</span>
                        </div>
                        <span className="font-medium">
                          {itemPrice > 0 ? `+${itemPrice} ج.م` : "مجاناً"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Special instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold block text-foreground">
              ملاحظات خاصة للشيف:
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="مثال: بدون بصل، زيادة صوص الطحينة، خبز محمص جيداً..."
              className="w-full text-xs rounded-xl border border-input bg-background p-2.5 focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-4 shrink-0">
          {/* Quantity Stepper */}
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

          {/* Add Button with Total Price */}
          <Button
            onClick={handleAddToCart}
            className="flex-1 font-bold text-sm h-11 gap-2 shadow-md shadow-primary/25 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>إضافة إلى السلة ({totalPrice} ج.م)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
