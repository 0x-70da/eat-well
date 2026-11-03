import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <div className="space-y-3 pb-6 border-b border-border/40">
        <div className="inline-flex items-center gap-2 text-primary bg-primary/10 px-3.5 py-1.5 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>حماية البيانات والخصوصية</span>
        </div>
        <h1 className="text-3xl font-black text-foreground">سياسة الخصوصية</h1>
        <p className="text-xs text-muted-foreground">
          آخر تحديث: نوفمبر 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">1. مقدمة والتزام</h2>
          <p>
            نحن في مطعم إيت ويل نلتزم بحماية خصوصية وأمان بيانات عملائنا الشخصية.
            توضح هذه الوثيقة ماهية المعلومات التي نجمعها، وكيف نستخدمها لتقديم خدمة
            توصيل طعام استثنائية.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">2. البيانات التي نجمعها</h2>
          <p>
            عند قيامك بطلب وجبة طعام عبر موقعنا الإلكتروني، قد نجمع بيانات تشمل:
            اسمك الكامل، رقم هاتفك للتواصل مع المندوب، عنوان التوصيل، والبريد
            الإلكتروني لإرسال الفواتير. نحن لا نقوم بتخزين تفاصيل بطاقات الدفع
            الائتمانية على خوادمنا بل تتم معالجتها مباشرة عبر بوابات مشفرة ومعتمدة
            (Stripe / Paymob).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">3. كيفية استخدام البيانات</h2>
          <p>
            تُستخدم بياناتك فقط في: تجهيز الطلب، التوصيل إلى عنوانك بدقة، التواصل معك
            في حال وجود أي استفسار حول المكونات أو العنوان، وتحسين جودة أطباقنا
            وخدماتنا.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">4. حماية ومشاركة البيانات</h2>
          <p>
            نحن لا نبيع أو نشارك بياناتك مع أي طرف ثالث لأغراض تسويقية. يتم تزويد سائق
            التوصيل فقط بالاسم ورقم الهاتف والعنوان الخاص بالطلب المعني لإتمام
            التوصيل بنجاح.
          </p>
        </section>
      </div>
    </div>
  );
}
