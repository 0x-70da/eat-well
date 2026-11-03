import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export function RestaurantStorySection() {
  const highlights = [
    "لحوم بلدية طازجة تذبح يومياً وتحضر تحت إشراف بيطري كامل",
    "تتبيلات توابل طبيعية 100% بدون أي مواد حافظة أو ألوان صناعية",
    "شواء على الفحم الطبيعي الخالي من المواد الكيميائية لنكهة تدخين فريدة",
    "فريق طهاة محترف يتمتع بخبرة تزيد عن 20 عاماً في المطبخ الشرقي",
  ];

  return (
    <section className="py-20 bg-muted/20 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Images collage */}
          <div className="relative">
            <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-card">
              <Image
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                alt="طهي المشاوي الشرقية الفاخرة"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 500px"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-1/2 aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-card hidden sm:block">
              <Image
                src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=400&q=80"
                alt="شاورما عربي طازجة"
                fill
                className="object-cover"
                sizes="250px"
              />
            </div>
          </div>

          {/* Text Story */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary tracking-wider uppercase block">
                قصتنا وعشق الطهي
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
                سر النكهة الأصيلة التي تميز مطعم إيت ويل
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              انطلقت فكرة مطعم إيت ويل من شغف حقيقي بإعادة تقديم أكلاتنا الشرقية
              المحبوبة والمشاوي على الفحم بمستوى جودة فندقي لا يقبل المساومة.
              نحن نؤمن بأن الوجبة الرائعة تبدأ من المكونات الطازجة، وتكتمل بروح الضيافة
              المصرية الكريمة.
            </p>

            <div className="space-y-3 pt-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-foreground">
                    {h}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
