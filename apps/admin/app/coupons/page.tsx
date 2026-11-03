import { Suspense } from "react";
import { CouponListSection } from "./sections/CouponListSection";
import { CouponListSkeleton } from "./components/CouponListSkeleton";

export default function AdminCouponsPage() {
  return (
    <Suspense fallback={<CouponListSkeleton />}>
      <CouponListSection />
    </Suspense>
  );
}
