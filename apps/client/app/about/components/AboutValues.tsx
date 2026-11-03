import { ShieldCheck, Flame, Heart, Clock, Utensils } from "lucide-react";

export function AboutValues() {
  const values = [
    {
      icon: ShieldCheck,
      title: "جودة لا تقبل المساومة",
      desc: "نختار لحومنا وخضرواتنا يومياً من موردين معتمدين يخضعون لأعلى معايير الرقابة الصحية والشرعية 100%.",
    },
    {
      icon: Flame,
      title: "شواء الفحم الطبيعي",
      desc: "نعتمد على الفحم النباتي الطبيعي لإعطاء الكباب والكفتة والشيش نكهة التدخين المميزة التي يعشقها محبو المشاوي.",
    },
    {
      icon: Heart,
      title: "حب الطهي وكرم الضيافة",
      desc: "أطباقنا تطهى بعناية وكرم يعكسان أصول الضيافة المصرية العريقة لتقديم وجبة مشبعة تسعد حواسك.",
    },
    {
      icon: Clock,
      title: "سرعة ودقة التوصيل",
      desc: "أسطول توصيل مجهز بحافظات حرارية احترافية لضمان وصول وجبتك ساخنة وطازجة كما لو خرجت للتو من شوايتنا.",
    },
  ];

  return (
    <div className="py-12 space-y-8">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">
          القيم التي نقف خلفها في كل وجبة
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          التزامنا بالجودة والاهتمام بالتفاصيل هو سر ثقة آلاف العائلات في مطعمنا
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((v, i) => {
          const Icon = v.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-3xl bg-card border border-border/80 space-y-4 hover:border-primary/40 transition-colors shadow-xs"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-foreground text-base">{v.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {v.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
