import { trackOrder } from "@/requests/trackOrder";
import { OrderTrackView } from "../components/OrderTrackView";
import { OrderTrackSearch } from "../components/OrderTrackSearch";
import { PackageSearch } from "lucide-react";

export interface OrderTrackSectionProps {
  params?: Promise<{ orderNumber: string }>;
  searchParams?: Promise<{
    orderNumber?: string;
  }>;
  orderNumber?: string;
}

export async function OrderTrackSection({
  params,
  searchParams,
  orderNumber: propOrderNumber,
}: OrderTrackSectionProps) {
  const resolvedParams = params ? await params : undefined;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const rawOrderNumber =
    propOrderNumber ??
    resolvedParams?.orderNumber ??
    resolvedSearchParams?.orderNumber;
  const orderNumber = rawOrderNumber
    ? decodeURIComponent(rawOrderNumber)
    : undefined;
  if (!orderNumber) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <PackageSearch className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-foreground">
            تتبع حالة طلبك لحظة بلحظة
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            أدخل رقم طلبك الذي استلمته في رسالة التأكيد أو الفاتورة لمشاهدة مرحلة
            التحضير وموقع السائق المباشر.
          </p>
        </div>
        <OrderTrackSearch />
      </div>
    );
  }

  const order = await trackOrder(orderNumber);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive">
          <PackageSearch className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-foreground">
            لم نتمكن من العثور على الطلب ({orderNumber})
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            يرجى التأكد من كتابة رقم الطلب بشكل صحيح والمحاولة مرة أخرى.
          </p>
        </div>
        <OrderTrackSearch initialValue={orderNumber} />
      </div>
    );
  }

  return <OrderTrackView order={order} />;
}
