import { Card, CardContent } from "@workspace/ui/components/card";
import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const reviews = [
    {
      name: "م. أحمد حسام",
      city: "المعادي، القاهرة",
      rating: 5,
      date: "منذ يومين",
      comment:
        "أفضل كفتة وشيش طاووق جربتهم في القاهرة بلا منازع! الأكل وصل سخن جداً في أقل من 35 دقيقة والتتبيلة مظبوطة بالملي والتومية خرافية.",
    },
    {
      name: "د. سارة محمود",
      city: "التجمع الخامس",
      rating: 5,
      date: "منذ 4 أيام",
      comment:
        "طلبنا صينية مشاوي عائلية في عزومة، الضيوف انبهروا بجودة اللحمة وتسويتها، وطاجن الموزة كان دايب ومستوي تماماً. خدمة ممتازة وتغليف احترافي.",
    },
    {
      name: "أ/ كريم الزيات",
      city: "مدينة نصر",
      rating: 5,
      date: "منذ أسبوع",
      comment:
        "الشاورما العربي بالخبز الصاج والجبنة مقرمشة ولذيذة جداً، وسهولة الطلب والدفع الإلكتروني عبر الموقع بتوفر وقت ومجهود كبير. شكراً لكم!",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-primary tracking-wider uppercase block">
            آراء وشهادات ضيوفنا
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            ماذا يقول عملاؤنا عن تجربة إيت ويل؟
          </h2>
          <p className="text-xs text-muted-foreground">
            فخورون بثقة أكثر من 15,000 عميل سعيد في جميع أنحاء القاهرة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <Card
              key={i}
              className="rounded-2xl border-border/80 bg-card p-6 flex flex-col justify-between relative hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <Quote className="w-8 h-8 text-primary/15 absolute top-4 left-4" />
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: r.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-4 h-4 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  "{r.comment}"
                </p>
              </CardContent>

              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs block text-foreground">
                    {r.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    {r.city}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {r.date}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
