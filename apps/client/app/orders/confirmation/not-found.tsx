import Link from "next/link";
import { buttonVariants } from "@workspace/ui/components/button";
import { PackageSearch } from "lucide-react";

export default function ConfirmationNotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-md">
      <PackageSearch className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h2 className="text-xl font-bold mb-2">الطلب غير موجود</h2>
      <p className="text-sm text-muted-foreground mb-6">
        لم نتمكن من العثور على الطلب المطلوب برقم المرجع المحدد.
      </p>
      <Link href="/orders/track" className={buttonVariants()}>
        البحث عن طلب آخر
      </Link>
    </div>
  );
}
