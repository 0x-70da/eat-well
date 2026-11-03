import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@workspace/ui/components/button";
import { Flame, ArrowLeft, Utensils, Sparkles, ShieldCheck, Clock } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
            {/* Promo Tag */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>أصالة المشاوي الشرقية على الفحم بأعلى معايير الجودة</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-foreground tracking-tight leading-[1.2]">
              نكهة شرقية أصيلة تليق بذوقك الرفيع في{" "}
              <span className="text-primary underline decoration-primary/30 underline-offset-8">
                مطعم إيت ويل
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              نختار لكم أجود قطع اللحوم البلدية الطازجة ونطهوها على نار الفحم الهادئة
              بتتبيلتنا الخاصة المتوارثة، لنوصل لكم أشهى الأطباق ساخنة ومقرمشة في أسرع وقت.
            </p>

            {/* Highlights badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-primary" />
                <span>مشاوي فحم 100%</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>لحوم طازجة بلدية حلال</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>توصيل سريع ساخن</span>
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-4">
              <Link
                href="/menu"
                className={buttonVariants({
                  size: "lg",
                  className: "w-full sm:w-auto font-bold gap-2 text-base shadow-lg shadow-primary/25 cursor-pointer",
                })}
              >
                <Utensils className="w-4 h-4" />
                <span>تصفح المنيو واطلب الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                href="/menu?featured=true"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "w-full sm:w-auto font-bold text-sm cursor-pointer",
                })}
              >
                <span>عروض الوجبات العائلية</span>
              </Link>
            </div>
          </div>

          {/* Hero Visual Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border-4 border-card">
              <Image
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
                alt="مشاوي شرقية فاخرة من مطعم إيت ويل"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating review highlight */}
              <div className="absolute bottom-4 right-4 left-4 bg-background/90 backdrop-blur-md p-3.5 rounded-2xl border border-border shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block text-foreground">
                    طبق المشاوي الملكي الفاخر
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    الطبق الأكثر طلباً وتقييماً 4.95 ★
                  </span>
                </div>
                <span className="text-sm font-extrabold text-primary">
                  340 ج.م
                </span>
              </div>
            </div>

            {/* Ambient blur glow */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
