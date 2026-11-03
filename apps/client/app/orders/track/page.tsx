import { Suspense } from "react";
import { OrderTrackSection } from "./sections/OrderTrackSection";
import { OrderTrackSkeleton } from "./components/OrderTrackSkeleton";

export interface OrderTrackPageProps {
  searchParams: Promise<{
    orderNumber?: string;
  }>;
}

export default function OrderTrackPage({
  searchParams,
}: OrderTrackPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<OrderTrackSkeleton />}>
        <OrderTrackSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
