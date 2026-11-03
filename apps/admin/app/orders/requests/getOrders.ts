import { get } from "@/lib/api";
import type { Order } from "@workspace/types";

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  search?: string;
}

export interface GetOrdersResponse {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getAdminOrders = async (
  params?: GetOrdersParams,
): Promise<GetOrdersResponse> => {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.status) query.set("status", params.status);
  if (params?.paymentStatus) query.set("paymentStatus", params.paymentStatus);
  if (params?.paymentMethod) query.set("paymentMethod", params.paymentMethod);
  if (params?.search) query.set("search", params.search);

  const qs = query.toString() ? `?${query.toString()}` : "";
  const res = await get<GetOrdersResponse>(`/orders/admin/all${qs}`, {
    cache: "no-store",
  });

  return (
    res.data || {
      items: [],
      total: 0,
      page: 1,
      limit: 15,
      totalPages: 1,
    }
  );
};
