import { db } from "../../../db/index.js";
import { orders, orderItems, user } from "../../../db/schema.js";
import { eq, desc, sql } from "drizzle-orm";
import type { DashboardStats } from "@workspace/types";

export const getDashboardStatsQuery = async (): Promise<DashboardStats> => {
  // 1. Order counts by status
  const allOrders = await db
    .select({
      id: orders.id,
      status: orders.status,
      totalAmount: orders.totalAmount,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt,
    })
    .from(orders);

  const totalOrders = allOrders.length;
  let totalRevenue = 0;
  let todayRevenue = 0;
  let pendingOrders = 0;
  let preparingOrders = 0;
  let completedOrders = 0;
  let cancelledOrders = 0;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  for (const o of allOrders) {
    const amount = Number(o.totalAmount || 0);
    if (o.status !== "cancelled") {
      totalRevenue += amount;
      if (new Date(o.createdAt) >= todayStart) {
        todayRevenue += amount;
      }
    }

    if (o.status === "pending") pendingOrders++;
    else if (o.status === "preparing") preparingOrders++;
    else if (o.status === "delivered") completedOrders++;
    else if (o.status === "cancelled") cancelledOrders++;
  }

  const averageOrderValue =
    totalOrders > 0 ? Math.round((totalRevenue / (totalOrders - cancelledOrders || 1)) * 100) / 100 : 0;

  // 2. Total customers count
  const [customersCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(user)
    .where(eq(user.role, "user"));

  const totalCustomers = Number(customersCount?.count || 0);

  // 3. Best selling products based on actual orderItems
  const topProductsRaw = await db
    .select({
      productId: orderItems.productId,
      productName: orderItems.productName,
      productNameAr: orderItems.productNameAr,
      productImage: orderItems.productImage,
      orderCount: sql<number>`cast(sum(${orderItems.quantity}) as integer)`,
      totalRevenue: sql<number>`cast(sum(cast(${orderItems.totalPrice} as numeric)) as float)`,
    })
    .from(orderItems)
    .where(sql`${orderItems.productId} is not null`)
    .groupBy(
      orderItems.productId,
      orderItems.productName,
      orderItems.productNameAr,
      orderItems.productImage,
    )
    .orderBy(desc(sql`sum(${orderItems.quantity})`))
    .limit(5);

  const bestSellingProducts = topProductsRaw.map((p) => ({
    productId: p.productId || "",
    productName: p.productName,
    productNameAr: p.productNameAr,
    image: p.productImage || "",
    orderCount: Number(p.orderCount || 0),
    totalRevenue: Number(p.totalRevenue || 0),
  }));

  // 4. Recent 6 orders
  const recentOrdersRaw = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerName: orders.customerName,
      customerPhone: orders.customerPhone,
      totalAmount: orders.totalAmount,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      paymentMethod: orders.paymentMethod,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(6);

  const recentOrders = recentOrdersRaw.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    totalAmount: Number(o.totalAmount),
    status: o.status,
    paymentStatus: o.paymentStatus,
    paymentMethod: o.paymentMethod,
    createdAt: o.createdAt.toISOString(),
  }));

  // 5. Sales trend over the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const salesTrendMap = new Map<string, { revenue: number; ordersCount: number }>();

  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0]!;
    salesTrendMap.set(dateStr, { revenue: 0, ordersCount: 0 });
  }

  for (const o of allOrders) {
    if (new Date(o.createdAt) >= sevenDaysAgo && o.status !== "cancelled") {
      const dateStr = new Date(o.createdAt).toISOString().split("T")[0]!;
      const current = salesTrendMap.get(dateStr);
      if (current) {
        current.revenue += Number(o.totalAmount || 0);
        current.ordersCount += 1;
      }
    }
  }

  const salesTrend = Array.from(salesTrendMap.entries()).map(([date, data]) => ({
    date,
    revenue: Math.round(data.revenue * 100) / 100,
    ordersCount: data.ordersCount,
  }));

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    todayRevenue: Math.round(todayRevenue * 100) / 100,
    totalOrders,
    pendingOrders,
    preparingOrders,
    completedOrders,
    cancelledOrders,
    averageOrderValue,
    totalCustomers,
    bestSellingProducts,
    recentOrders,
    salesTrend,
  };
};
