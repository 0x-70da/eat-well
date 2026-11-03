import { db } from "../../../db/index.js";
import {
  orders,
  orderItems,
  orderStatusHistory,
  payments,
} from "../../../db/schema.js";
import { eq, desc, and, ilike, or, sql, inArray } from "drizzle-orm";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { OrderStatus, PaymentStatus } from "@workspace/types";
import crypto from "crypto";

export interface PreparedOrderItem {
  productId: string;
  productName: string;
  productNameAr: string;
  productImage: string;
  productPrice: number;
  quantity: number;
  selectedSize?: string | null;
  selectedAddons?: string | null;
  specialInstructions?: string | null;
  totalPrice: number;
}

export interface PreparedOrderData {
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryAddress: string;
  deliveryInstructions?: string | null;
  orderType: string;
  paymentMethod: string;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string | null;
  estimatedDeliveryMinutes: number;
}

const attachOrderRelations = async (orderRows: (typeof orders.$inferSelect)[]) => {
  if (orderRows.length === 0) return [];

  const orderIds = orderRows.map((o) => o.id);

  const itemsList = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds));

  const historyList = await db
    .select()
    .from(orderStatusHistory)
    .where(inArray(orderStatusHistory.orderId, orderIds))
    .orderBy(desc(orderStatusHistory.createdAt));

  const paymentsList = await db
    .select()
    .from(payments)
    .where(inArray(payments.orderId, orderIds))
    .orderBy(desc(payments.createdAt));

  const itemsByOrder = new Map<string, unknown[]>();
  for (const it of itemsList) {
    const list = itemsByOrder.get(it.orderId) || [];
    list.push(nullToUndefined(it));
    itemsByOrder.set(it.orderId, list);
  }

  const historyByOrder = new Map<string, unknown[]>();
  for (const h of historyList) {
    const list = historyByOrder.get(h.orderId) || [];
    list.push(nullToUndefined(h));
    historyByOrder.set(h.orderId, list);
  }

  const paymentsByOrder = new Map<string, unknown[]>();
  for (const p of paymentsList) {
    const list = paymentsByOrder.get(p.orderId) || [];
    list.push(nullToUndefined(p));
    paymentsByOrder.set(p.orderId, list);
  }

  return orderRows.map((o) => ({
    ...nullToUndefined(o),
    items: itemsByOrder.get(o.id) || [],
    statusHistory: historyByOrder.get(o.id) || [],
    payments: paymentsByOrder.get(o.id) || [],
  }));
};

export const createOrderWithItemsQuery = async (
  orderData: PreparedOrderData,
  items: PreparedOrderItem[],
) => {
  const orderId = `ord_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;

  return await db.transaction(async (tx) => {
    // 1. Insert order
    const [createdOrder] = await tx
      .insert(orders)
      .values({
        id: orderId,
        orderNumber: orderData.orderNumber,
        userId: orderData.userId ?? null,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail ?? null,
        deliveryAddress: orderData.deliveryAddress,
        deliveryInstructions: orderData.deliveryInstructions ?? null,
        orderType: orderData.orderType,
        status: "pending",
        paymentMethod: orderData.paymentMethod,
        paymentStatus: "pending",
        subtotal: orderData.subtotal.toFixed(2),
        discountAmount: orderData.discountAmount.toFixed(2),
        deliveryFee: orderData.deliveryFee.toFixed(2),
        taxAmount: orderData.taxAmount.toFixed(2),
        totalAmount: orderData.totalAmount.toFixed(2),
        couponCode: orderData.couponCode ?? null,
        estimatedDeliveryMinutes: orderData.estimatedDeliveryMinutes,
      })
      .returning();

    // 2. Insert order items
    await tx.insert(orderItems).values(
      items.map((item) => ({
        id: `oit_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
        orderId,
        productId: item.productId,
        productName: item.productName,
        productNameAr: item.productNameAr,
        productImage: item.productImage,
        productPrice: item.productPrice.toFixed(2),
        quantity: item.quantity,
        selectedSize: item.selectedSize ?? null,
        selectedAddons: item.selectedAddons ?? null,
        specialInstructions: item.specialInstructions ?? null,
        totalPrice: item.totalPrice.toFixed(2),
      })),
    );

    // 3. Insert initial status history
    await tx.insert(orderStatusHistory).values({
      id: `osh_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
      orderId,
      fromStatus: null,
      toStatus: "pending",
      note: "تم استلام الطلب وبانتظار التأكيد",
      changedBy: orderData.userId ? "customer" : "guest",
    });

    return createdOrder ? nullToUndefined(createdOrder) : undefined;
  });
};

export const getOrderByIdQuery = async (id: string) => {
  const orderRows = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  if (orderRows.length === 0) return undefined;
  const attached = await attachOrderRelations(orderRows);
  return attached[0];
};

export const getOrderByNumberQuery = async (orderNumber: string) => {
  const orderRows = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber.toUpperCase()))
    .limit(1);

  if (orderRows.length === 0) return undefined;
  const attached = await attachOrderRelations(orderRows);
  return attached[0];
};

export const getOrdersByUserIdQuery = async (userId: string) => {
  const orderRows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  return await attachOrderRelations(orderRows);
};

export interface AdminOrdersFilter {
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  search?: string;
  page: number;
  limit: number;
}

export const getAdminOrdersQuery = async (filter: AdminOrdersFilter) => {
  const conditions = [];

  if (filter.status) {
    conditions.push(eq(orders.status, filter.status));
  }

  if (filter.paymentStatus) {
    conditions.push(eq(orders.paymentStatus, filter.paymentStatus));
  }

  if (filter.paymentMethod) {
    conditions.push(eq(orders.paymentMethod, filter.paymentMethod));
  }

  if (filter.search) {
    const searchPattern = `%${filter.search}%`;
    conditions.push(
      or(
        ilike(orders.orderNumber, searchPattern),
        ilike(orders.customerName, searchPattern),
        ilike(orders.customerPhone, searchPattern),
      )!,
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalCountResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(whereClause);

  const total = Number(totalCountResult?.count || 0);
  const offset = (filter.page - 1) * filter.limit;

  const orderRows = await db
    .select()
    .from(orders)
    .where(whereClause)
    .orderBy(desc(orders.createdAt))
    .limit(filter.limit)
    .offset(offset);

  const items = await attachOrderRelations(orderRows);

  return {
    items,
    total,
    page: filter.page,
    limit: filter.limit,
    totalPages: Math.ceil(total / filter.limit),
  };
};

export const updateOrderStatusQuery = async (
  orderId: string,
  newStatus: OrderStatus,
  currentStatus: string,
  note?: string,
  cancellationReason?: string,
  changedBy = "admin",
) => {
  return await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(orders)
      .set({
        status: newStatus,
        cancellationReason: cancellationReason ?? null,
        deliveredAt: newStatus === "delivered" ? new Date() : null,
      })
      .where(eq(orders.id, orderId))
      .returning();

    await tx.insert(orderStatusHistory).values({
      id: `osh_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
      orderId,
      fromStatus: currentStatus,
      toStatus: newStatus,
      note: note ?? `تغيرت حالة الطلب إلى: ${newStatus}`,
      changedBy,
    });

    return updated ? nullToUndefined(updated) : undefined;
  });
};

export const updateOrderPaymentStatusQuery = async (
  orderId: string,
  paymentStatus: PaymentStatus,
  transactionReference?: string,
  note?: string,
) => {
  return await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(orders)
      .set({
        paymentStatus,
      })
      .where(eq(orders.id, orderId))
      .returning();

    if (paymentStatus === "paid") {
      await tx.insert(orderStatusHistory).values({
        id: `osh_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
        orderId,
        fromStatus: null,
        toStatus: "payment_received",
        note: note ?? `تم تأكيد دفع قيمة الطلب بنجاح. المرجع: ${transactionReference ?? "نقدي / غير محدد"}`,
        changedBy: "system",
      });
    }

    return updated ? nullToUndefined(updated) : undefined;
  });
};
