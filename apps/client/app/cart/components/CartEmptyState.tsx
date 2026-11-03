import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@workspace/ui/components/button";

export function CartEmptyState() {
  return (
    <div className="text-center py-20 px-4 max-w-md mx-auto space-y-6">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
        <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-foreground">
          سلة المشتريات فارغة
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          لم تقم بإضافة أي وجبات أو مشروبات إلى سلتك بعد. استكشف قائمتنا المتنوعة من
          المشاوي والأطباق الشرقية الشهية واطلب الآن!
        </p>
      </div>
      <Link
        href="/menu"
        className={buttonVariants({
          size: "lg",
          className: "rounded-2xl font-bold gap-2 px-8 shadow-md",
        })}
      >
        <span>تصفح قائمة الطعام</span>
        <ArrowLeft className="w-4 h-4" />
      </Link>
    </div>
  );
}
