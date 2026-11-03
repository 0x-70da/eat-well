import Link from "next/link";
import { buttonVariants } from "@workspace/ui/components/button";

export default function TrackNotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-xl font-bold mb-4">الصفحة غير موجودة</h2>
      <Link href="/orders/track" className={buttonVariants()}>
        تتبع طلب آخر
      </Link>
    </div>
  );
}
