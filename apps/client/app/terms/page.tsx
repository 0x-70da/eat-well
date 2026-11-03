import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <div className="space-y-3 pb-6 border-b border-border/40">
        <div className="inline-flex items-center gap-2 text-primary bg-primary/10 px-3.5 py-1.5 rounded-full text-xs font-bold">
          <FileText className="w-4 h-4" />
          <span>الشروط والأحكام</span>
        </div>
        <h1 className="text-3xl font-black text-foreground">شروط وأحكام الاستخدام</h1>
        <p className="text-xs text-muted-foreground">
          آخر تحديث: نوفمبر 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">1. القبول والاتفاقية</h2>
          <p>
            باستخدامك لموقع مطعم إيت ويل أو طلبك لأي من منتجاتنا، فإنك توافق التزاماً
            كاملاً بهذه الشروط والأحكام. إذا كنت لا توافق عليها، يرجى عدم استخدام
            الموقع.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">2. الأسعار والوجبات</h2>
          <p>
            جميع الأسعار المعروضة على الموقع بالجنيه المصري (EGP). تخضع الأسعار
            والأصناف المتاحة للتغيير وفق توفر المكونات الطازجة ومواسم الإنتاج. يقوم
            النظام بحساب السعر النهائي ورسوم التوصيل والضرائب بدقة قبل إتمام الدفع.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">3. الإلغاء والاسترجاع</h2>
          <p>
            نظراً لأن جميع وجباتنا تطهى طازجة ومخصصة حسب طلب العميل، يمكن إلغاء الطلب
            فقط خلال 5 دقائق من تسجيله وقبل بدء المطبخ في عملية الشواء والتجهيز. في
            حال وصول وجبة خاطئة أو غير مطابقة للمواصفات، يتم تعويض العميل فوراً إما
            بإعادة إرسال الوجبة أو استرداد المبلغ.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">4. كوبونات الخصم والعروض</h2>
          <p>
            تخضع كوبونات الخصم للشروط الخاصة بكل عرض مثل الحد الأدنى للطلب وتاريخ
            انتهاء الصلاحية، ولا يجوز دمج أكثر من كوبون في الطلب الواحد ما لم ينص على
            خلاف ذلك.
          </p>
        </section>
      </div>
    </div>
  );
}
