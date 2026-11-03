import { Suspense } from "react";
import { OrderConfirmationSection } from "./sections/OrderConfirmationSection";
import { OrderConfirmationSkeleton } from "./components/OrderConfirmationSkeleton";

export interface ConfirmationPageProps {
  searchParams: Promise<{
    orderNumber?: string;
  }>;
}

export default function OrderConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<OrderConfirmationSkeleton />}>
        <OrderConfirmationSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
