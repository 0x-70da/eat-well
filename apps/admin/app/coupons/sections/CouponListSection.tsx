import { getAdminCoupons } from "../requests/getCoupons";
import { CouponTable } from "../components/CouponTable";

export async function CouponListSection() {
  const coupons = await getAdminCoupons();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">إدارة الكوبونات والعروض</h1>
        <p className="text-sm text-muted-foreground mt-1">
          إنشاء أكواد الخصم الترويجية وتحديد نسب الخصم والحدود الدنيا للطلبات.
        </p>
      </div>

      <CouponTable coupons={coupons} />
    </div>
  );
}
