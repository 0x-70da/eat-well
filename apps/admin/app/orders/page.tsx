import { Suspense } from "react";
import { OrderListSection } from "./sections/OrderListSection";
import { OrderListSkeleton } from "./components/OrderListSkeleton";

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<OrderListSkeleton />}>
      <OrderListSection />
    </Suspense>
  );
}
