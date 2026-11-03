import { Suspense } from "react";
import { OrderTrackSection } from "../sections/OrderTrackSection";
import { OrderTrackSkeleton } from "../components/OrderTrackSkeleton";

export interface OrderTrackDynamicPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default function OrderTrackDynamicPage({
  params,
}: OrderTrackDynamicPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<OrderTrackSkeleton />}>
        <OrderTrackSection params={params} />
      </Suspense>
    </div>
  );
}
