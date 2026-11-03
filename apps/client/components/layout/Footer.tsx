import Link from "next/link";
import {
  Flame,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Intro */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight block">
                  إيت ويل
                </span>
                <span className="text-[10px] text-muted-foreground block -mt-1 font-medium">
                  EAT WELL RESTAURANT
                </span>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              نقدم لكم تجربة طعام شرقية فاخرة بنكهات المشاوي على الفحم والشاورما
              الأصلية، مع التزام تام بأعلى معايير النظافة واستخدام اللحوم البلدية
              الطازجة يومياً.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>لحوم بلدية طازجة 100% حلال معتمدة</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold tracking-tight">روابط سريعة</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/menu" className="hover:text-primary transition-colors">
                  قائمة الطعام الكاملة
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?featured=true"
                  className="hover:text-primary transition-colors"
                >
                  عروض ووجبات التوفير
                </Link>
              </li>
              <li>
                <Link
                  href="/orders/track"
                  className="hover:text-primary transition-colors"
                >
                  تتبع حالة طلبك بالرقم
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  من نحن وقصة المطعم
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  اتصل بنا والاستفسارات
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  الأسئلة الشائعة (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold tracking-tight">أوقات العمل والتوصيل</h3>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-foreground">
                    يومياً من السبت إلى الجمعة:
                  </span>
                  <span>11:00 صباحاً حتى 02:00 بعد منتصف الليل</span>
                </div>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border border-border/60">
                <span className="font-semibold text-foreground block mb-1">
                  سرعة التوصيل:
                </span>
                <span>متوسط وقت تجهيز وتوصيل الطلب 30 إلى 45 دقيقة فقط.</span>
              </div>
            </div>
          </div>

          {/* Contact & Branch */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold tracking-tight">العنوان والتواصل</h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>شارع النصر، المعادي الجديدة، القاهرة، جمهورية مصر العربية</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span dir="ltr" className="font-mono">+20 100 000 0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="font-mono">orders@eatwell-restaurant.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 مطعم إيت ويل (Eat Well). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              <span>دفع آمن: كاش عند الاستلام • فيزا / ماستركارد • فودافون كاش / انستاباي</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
