import Link from "next/link";
import { buttonVariants } from "@workspace/ui/components/button";
import { Tag, Sparkles, ArrowLeft, Percent, Gift } from "lucide-react";

export function SpecialOffersSection() {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: WELCOME20 Promo */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-card border border-primary/20 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3 z-10">
              <div className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-black px-3 py-1 rounded-full shadow-xs">
                <Percent className="w-3.5 h-3.5" />
                <span>عرض الترحيب للعملاء الجدد</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-foreground">
                خصم 20% على أول طلب لك!
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                استخدم كود الخصم الترويجي عند إتمام طلبك عبر الموقع واستمتع بوجبتك
                المفضلة بسعر استثنائي وتوصيل سريع.
              </p>
            </div>

            <div className="pt-6 flex items-center justify-between gap-4 z-10">
              <div className="bg-background/90 backdrop-blur-xs border-2 border-dashed border-primary px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                <span className="font-mono font-black text-sm text-foreground tracking-wider">
                  WELCOME20
                </span>
              </div>
              <Link
                href="/menu"
                className={buttonVariants({
                  size: "sm",
                  className: "font-bold gap-1.5 cursor-pointer",
                })}
              >
                <span>اطلب الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-primary/10 rounded-full blur-2xl" />
          </div>

          {/* Card 2: Family Deals */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-card border border-amber-500/20 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3 z-10">
              <div className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-xs">
                <Gift className="w-3.5 h-3.5" />
                <span>وليمة الجمعة والعائلة</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-foreground">
                صواني المشاوي واللمة الحلوة
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                صواني تكفي حتى 6 أفراد تشمل تشكيلة مشاوي مشكلة مع الأرز البسمتي
                والمقبلات والسلطات والخبز الطازج بأسعار توفير مميزة.
              </p>
            </div>

            <div className="pt-6 flex items-center justify-between gap-4 z-10">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                تبدأ من 450 ج.م فقط
              </span>
              <Link
                href="/menu?category=cat_grills"
                className={buttonVariants({
                  size: "sm",
                  variant: "outline",
                  className: "font-bold border-amber-500/30 text-amber-600 hover:bg-amber-500/10 cursor-pointer",
                })}
              >
                <span>مشاهدة الصواني</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
