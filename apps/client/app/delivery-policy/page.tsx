import { Truck } from "lucide-react";

export default function DeliveryPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <div className="space-y-3 pb-6 border-b border-border/40">
        <div className="inline-flex items-center gap-2 text-primary bg-primary/10 px-3.5 py-1.5 rounded-full text-xs font-bold">
          <Truck className="w-4 h-4" />
          <span>سياسة الشحن والتوصيل</span>
        </div>
        <h1 className="text-3xl font-black text-foreground">سياسة التوصيل والاستلام</h1>
        <p className="text-xs text-muted-foreground">
          آخر تحديث: نوفمبر 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">1. مناطق ونطاق التوصيل</h2>
          <p>
            تغطي شبكة توصيل إيت ويل مناطق واسعة في القاهرة الكبرى، الجيزة، والإسكندرية.
            يتم تحديد إمكانية التوصيل ورسوم الخدمة تلقائياً بناءً على عنوانك المكتوب
            في صفحة الدفع.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">2. أوقات التوصيل المقدرة</h2>
          <p>
            متوسط وقت التوصيل يتراوح بين 30 إلى 45 دقيقة. قد يختلف هذا التوقيت في أوقات
            الذروة، عطلات نهاية الأسبوع، أو الأحوال الجوية الطارئة، وسنقوم بإشعارك
            بأي تأخير متوقع عبر شاشة تتبع الطلب.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">3. استلام الطلب من الفرع (Pickup)</h2>
          <p>
            يمكنك دائماً اختيار 'استلام من المطعم' دون أي رسوم توصيل إضافية. سيكون
            طلبك جاهزاً ومغلّفاً في فرعنا المختار خلال 20 إلى 25 دقيقة من تأكيد
            الطلب.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">4. التعبئة والحفظ الحراري</h2>
          <p>
            تُنقل جميع الوجبات داخل حقائب حرارية مخصصة تضمن بقاء المشاوي والخبز
            والطواجن في درجة حرارة التقديم المثالية حتى تصل إلى طاولتك.
          </p>
        </section>
      </div>
    </div>
  );
}
