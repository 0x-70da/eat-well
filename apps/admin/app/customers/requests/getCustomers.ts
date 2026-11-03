import { get } from "@/lib/api";
import type { CustomerSummary } from "@workspace/types";

export const getAdminCustomers = async (): Promise<CustomerSummary[]> => {
  const res = await get<CustomerSummary[]>("/customers", {
    cache: "no-store",
  });
  return res.data || [];
};
