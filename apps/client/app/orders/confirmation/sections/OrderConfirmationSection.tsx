import { notFound } from "next/navigation";
import { trackOrder } from "@/requests/trackOrder";
import { OrderConfirmationView } from "../components/OrderConfirmationView";

export interface OrderConfirmationSectionProps {
  searchParams?: Promise<{
    orderNumber?: string;
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

  const order = await trackOrder(orderNumber);
  if (!order) {
    notFound();
  }

  return <OrderConfirmationView order={order} />;
}
