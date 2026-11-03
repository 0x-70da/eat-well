"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@workspace/types";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Clock, Plus, Flame } from "lucide-react";
import { ProductCustomizationModal } from "./ProductCustomizationModal";

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="group overflow-hidden rounded-2xl border-border/80 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full bg-card">
        {/* Product Image and Badges */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
          <Link href={`/menu/${product.slug}`} className="block w-full h-full">
            <Image
              src={product.image}
              alt={product.nameAr}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

          {/* Top Badges */}
          <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1.5 z-10">
            {product.isFeatured && (
              <Badge className="bg-primary text-primary-foreground font-bold shadow-xs">
                مميز
              </Badge>
            )}
            {product.isPopular && (
              <Badge className="bg-amber-500 text-white font-bold shadow-xs">
                الأكثر طلباً
              </Badge>
            )}
            {product.spicyLevel > 0 && (
              <Badge className="bg-rose-500 text-white font-bold shadow-xs gap-1">
                <Flame className="w-3 h-3" />
                <span>حار</span>
              </Badge>
            )}
          </div>

          {/* Prep time badge */}
          <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary" />
            <span>{product.prepTimeMinutes} دقيقة</span>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/menu/${product.slug}`}
                className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
              >
                {product.nameAr}
              </Link>
              <span className="text-xs font-bold text-amber-500 shrink-0">
                ★ {product.rating}
              </span>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.descriptionAr}
            </p>
          </div>

          {/* Price and CTA */}
          <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-primary">
                  {product.price}
                </span>
                <span className="text-[11px] font-bold text-muted-foreground">
                  ج.م
                </span>
              </div>
              {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                <span className="text-[11px] text-muted-foreground line-through block -mt-1">
                  {product.originalPrice} ج.م
                </span>
              )}
            </div>

            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              disabled={!product.isAvailable}
              className="font-bold text-xs gap-1.5 rounded-xl shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{product.isAvailable ? "طلب الوجبة" : "غير متاح"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customization modal */}
      <ProductCustomizationModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
