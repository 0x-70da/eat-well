import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChefHat, Check } from "lucide-react";
import { buttonVariants } from "@workspace/ui/components/button";

export function AboutChefStory() {
  const points = [
    "تتبيلات سرية متوارثة محضرة من أعشاب وتوابل طبيعية 100%",
    "إشراف مباشر من كبار شيفات المشاوي والمأكولات الشرقية",
    "مطبخ مركزي مجهز بأحدث معايير النظافة والسلامة الغذائية ISO",
    "تعبئة وتغليف حراري محكم يحافظ على القرمشة والحرارة",
  ];

  return (
    <div className="py-12 bg-muted/30 rounded-3xl p-8 sm:p-12 border border-border/60">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <ChefHat className="w-4 h-4" />
            <span>فريق الطهاة المحترف</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-foreground">
            نطبخ بشغف كما لو كنا نطبخ لعائلتنا
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed">
            يضم فريق عمل إيت ويل نخبة من أمهر الطهاة المتخصصين في فنون الشواء الشرقي،
            حيث يتم إعداد كل قطعة لحم بعناية فائقة وتتبيلها لساعات طويلة لضمان
            امتصاصها للنكهات، ثم طهيها على الفحم بدرجات حرارة محسوبة بدقة للحصول على
            أطرى قوام وألذ مذاق.
          </p>

          <ul className="space-y-3">
            {points.map((pt, i) => (
              <li key={i} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-foreground">
                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <Link
              href="/menu"
              className={buttonVariants({
                size: "lg",
                className: "rounded-2xl font-bold gap-2 px-8 shadow-md",
              })}
            >
              <span>تذوق قائمة مأكولاتنا اليوم</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-xl border border-border/40">
          <Image
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop"
            alt="شيفات مطعم إيت ويل"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
