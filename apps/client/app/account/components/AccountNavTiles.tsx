import Link from "next/link";
import { ShoppingBag, Clock, UtensilsCrossed, ArrowLeft } from "lucide-react";

export function AccountNavTiles() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Link
        href="/orders"
        className="p-6 rounded-3xl bg-card border border-border/80 hover:border-primary/40 transition-colors shadow-xs space-y-3 group"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-xs">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-base">طلباتي السابقة</h3>
          <p className="text-xs text-muted-foreground mt-1">
            سجل جميع طلباتك السابقة وتفاصيلها وحالتها
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-primary font-semibold pt-1">
          <span>عرض الطلبات</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </div>
      </Link>

      <Link
        href="/cart"
        className="p-6 rounded-3xl bg-card border border-border/80 hover:border-primary/40 transition-colors shadow-xs space-y-3 group"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-xs">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-base">سلة المشتريات</h3>
          <p className="text-xs text-muted-foreground mt-1">
            عرض الأصناف المحفوظة في سلتك الحالية
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold pt-1">
          <span>فتح السلة</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </div>
      </Link>

      <Link
        href="/menu"
        className="p-6 rounded-3xl bg-card border border-border/80 hover:border-primary/40 transition-colors shadow-xs space-y-3 group"
      >
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-xs">
          <UtensilsCrossed className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-base">قائمة الطعام</h3>
          <p className="text-xs text-muted-foreground mt-1">
            استكشف أشهى المأكولات والمشاوي الطازجة
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold pt-1">
          <span>تصفح المنيو</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </div>
      </Link>
    </div>
  );
}
