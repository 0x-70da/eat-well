import { notFound } from "next/navigation";
import { trackOrder } from "@/requests/trackOrder";
import { getPaymentStatus } from "@/app/checkout/requests/getPaymentStatus";
import { OrderConfirmationView } from "../components/OrderConfirmationView";

export interface OrderConfirmationSectionProps {
  searchParams?: Promise<{
    orderNumber?: string;
    session_id?: string;
    status?: string;
  }>;
  orderNumber?: string;
}

export async function OrderConfirmationSection({
  searchParams,
  orderNumber: propOrderNumber,
}: OrderConfirmationSectionProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const orderNumber = propOrderNumber ?? resolvedParams.orderNumber;

  if (!orderNumber) {
    notFound();
  }

  // If returning from Stripe embedded checkout with session_id, sync payment status
  if (resolvedParams.session_id) {
    try {
      await getPaymentStatus({
        sessionId: resolvedParams.session_id,
        orderNumber,
      });
    } catch {
      // Continue to tracking if verification check encounters network error
    }
  }

  const order = await trackOrder(orderNumber);
  if (!order) {
    notFound();
  }

  return <OrderConfirmationView order={order} />;
}
