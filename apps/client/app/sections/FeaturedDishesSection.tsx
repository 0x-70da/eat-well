import { getFeaturedProducts } from "@/requests/getFeaturedProducts";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export async function FeaturedDishesSection() {
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-muted/20 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مختارات الشيف الخاصة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              أطباقنا المميزة والموصى بها
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              تذوق أفضل ما يقدمه مطبخنا الشرقي الأصيل، أطباق تم إعدادها بشغف لتنال إعجابكم.
            </p>
          </div>
          <Link
            href="/menu?featured=true"
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1.5"
          >
            <span>عرض كافة الأطباق المميزة</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* 4-column product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
