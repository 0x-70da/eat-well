import { db } from "../../../db/index.js";
import { orders, orderItems, orderStatusHistory } from "../../../db/schema.js";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";
import type { PreparedOrderData, PreparedOrderItem } from "../orders.types.js";
import crypto from "crypto";

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
