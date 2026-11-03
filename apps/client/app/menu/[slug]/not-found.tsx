import Link from "next/link";
import { buttonVariants } from "@workspace/ui/components/button";
import { UtensilsCrossed } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 bg-muted/60 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
          <UtensilsCrossed className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            الوجبة غير متوفرة أو تم تغيير الرابط
          </h1>
          <p className="text-muted-foreground text-sm">
            لم نتمكن من العثور على الصنف المطلوب. يمكنك استعراض قائمتنا اللذيذة واختيار وجبة أخرى.
          </p>
        </div>
        <Link href="/menu" className={buttonVariants({ className: "rounded-xl px-8" })}>
          تصفح قائمة الطعام
        </Link>
      </div>
    </div>
  );
}
