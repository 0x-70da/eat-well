import { get } from "@/lib/api";
import type { DashboardStats } from "@workspace/types";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await get<DashboardStats>("/analytics/dashboard", {
    cache: "no-store",
  });
  if (!res.success || !res.data) {
    // Return empty fallback stats if server is initializing
    return {
      totalRevenue: 0,
      todayRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      preparingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      averageOrderValue: 0,
      totalCustomers: 0,
      bestSellingProducts: [],
      recentOrders: [],
      salesTrend: [],
    };
  }
  return res.data;
};
