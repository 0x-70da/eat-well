import { get } from "@/lib/api";
import type { PaymentAvailability } from "@workspace/types";

export const getPaymentAvailability =
  async (): Promise<PaymentAvailability> => {
    const res = await get<PaymentAvailability>("/payments/availability");
    return (
      res.data || {
        cod: true,
        stripe: false,
        paymob: false,
      }
    );
  };
