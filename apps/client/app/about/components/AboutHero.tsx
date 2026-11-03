import Image from "next/image";
import { Sparkles, Award, HeartHandshake } from "lucide-react";

export function AboutHero() {
  return (
    <div className="relative py-16 lg:py-24 overflow-hidden rounded-3xl bg-gradient-to-b from-primary/10 via-background to-card border border-border/60 p-8 sm:p-12 mb-12">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>قصة شغف وأصالة منذ 2012</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
          نحن في <span className="text-primary">إيت ويل</span>، نصنع من الطعام تجربة لا تُنسى
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          انطلقت رحلتنا من إيمان راسخ بأن وجبة الطعام ليست مجرد طاقة، بل هي لحظة
          سعادة تجمع العائلة والأصدقاء. نحرص على تقديم أشهى المشاوي المصرية والأطباق
          الشرقية المحضرة من أجود أنواع اللحوم الطازجة والبهارات الأصيلة.
        </p>

        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-card border border-border/40">
            <span className="block font-black text-2xl text-primary font-mono">+12</span>
            <span className="text-xs text-muted-foreground">عاماً من الخبرة</span>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border/40">
            <span className="block font-black text-2xl text-primary font-mono">+80</span>
            <span className="text-xs text-muted-foreground">صنفاً طازجاً يومياً</span>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border/40">
            <span className="block font-black text-2xl text-primary font-mono">+50k</span>
            <span className="text-xs text-muted-foreground">عميل سعيد</span>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border/40">
            <span className="block font-black text-2xl text-primary font-mono">100%</span>
            <span className="text-xs text-muted-foreground">لحوم بلدية حلال</span>
          </div>
        </div>
      </div>
    </div>
  );
}
