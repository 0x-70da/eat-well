import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/requests/getCategories";
import { ArrowLeft } from "lucide-react";

export async function CategorySliderSection() {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-primary tracking-wider uppercase block">
              تصفح حسب الرغبة
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
              أقسام قائمة الطعام
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1.5"
          >
            <span>عرض القائمة بالكامل</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.id}`}
              className="group flex flex-col items-center text-center p-3 rounded-2xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden relative mb-3 bg-muted shadow-xs transition-transform duration-300 group-hover:scale-110">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.nameAr}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : null}
              </div>
              <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors block">
                {cat.nameAr}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                {cat.productCount ? `${cat.productCount} وجبة` : "أطباق شهية"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
