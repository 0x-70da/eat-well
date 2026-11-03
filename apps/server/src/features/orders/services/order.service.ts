import { AppError } from "../../../lib/errors.js";
import {
  createOrderWithItemsQuery,
  getOrderByIdQuery,
  getOrderByNumberQuery,
  getOrdersByUserIdQuery,
  getAdminOrdersQuery,
  updateOrderStatusQuery,
  updateOrderPaymentStatusQuery,
  type PreparedOrderItem,
  type PreparedOrderData,
  type AdminOrdersFilter,
} from "../queries/order.query.js";
import { db } from "../../../db/index.js";
import {
  products,
  productSizes,
  productAddonGroups,
  productAddonItems,
  restaurantSettings,
} from "../../../db/schema.js";
import { inArray, eq } from "drizzle-orm";
import { validateCouponService } from "../../coupons/services/coupon.service.js";
import { incrementCouponUsageQuery } from "../../coupons/queries/coupon.query.js";
import type {
  CreateOrderInput,
  UpdateOrderStatusInput,
  UpdatePaymentStatusInput,
} from "@workspace/validation";
import crypto from "crypto";

export const createOrderService = async (
  input: CreateOrderInput,
  userId?: string | null,
) => {
  // 1. Fetch restaurant settings for delivery fee, min order, etc.
  const [settings] = await db.select().from(restaurantSettings).limit(1);
  const minOrderAmount = Number(settings?.minOrderAmount || 100);
  const deliveryFeeConfig = Number(settings?.deliveryFee || 30);
  const taxRate = Number(settings?.taxRate || 14);

  // 2. Fetch all products in the order
  const productIds = input.items.map((i) => i.productId);
  const dbProductsList = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));

  const dbSizes = await db
    .select()
    .from(productSizes)
    .where(inArray(productSizes.productId, productIds));

  const dbGroups = await db
    .select()
    .from(productAddonGroups)
    .where(inArray(productAddonGroups.productId, productIds));

  const groupIds = dbGroups.map((g) => g.id);
  const dbAddonItems = groupIds.length > 0
    ? await db
        .select()
        .from(productAddonItems)
        .where(inArray(productAddonItems.groupId, groupIds))
    : [];

  const itemsByGroup = new Map<string, (typeof dbAddonItems)[number][]>();
  for (const it of dbAddonItems) {
    const list = itemsByGroup.get(it.groupId) || [];
    list.push(it);
    itemsByGroup.set(it.groupId, list);
  }

  const groupsByProduct = new Map<
    string,
    ((typeof dbGroups)[number] & { items: (typeof dbAddonItems)[number][] })[]
  >();
  for (const grp of dbGroups) {
    const list = groupsByProduct.get(grp.productId) || [];
    list.push({
      ...grp,
      items: itemsByGroup.get(grp.id) || [],
    });
    groupsByProduct.set(grp.productId, list);
  }

  const sizesByProduct = new Map<string, (typeof dbSizes)[number][]>();
  for (const s of dbSizes) {
    const list = sizesByProduct.get(s.productId) || [];
    list.push(s);
    sizesByProduct.set(s.productId, list);
  }

  const productMap = new Map(
    dbProductsList.map((p) => [
      p.id,
      {
        ...p,
        sizes: sizesByProduct.get(p.id) || [],
        addonGroups: groupsByProduct.get(p.id) || [],
      },
    ]),
  );

  // 3. Validate and calculate each order item server-side
  let calculatedSubtotal = 0;
  const preparedItems: PreparedOrderItem[] = [];

  for (const itemInput of input.items) {
    const dbProduct = productMap.get(itemInput.productId);
    if (!dbProduct) {
      throw new AppError(`الوجبة المطلوبة غير موجودة (ID: ${itemInput.productId})`, 400);
    }
    if (!dbProduct.isAvailable) {
      throw new AppError(`الوجبة (${dbProduct.nameAr}) غير متاحة حالياً للطلب`, 400);
    }

    let unitPrice = Number(dbProduct.price);

    // Validate size if selected
    let selectedSizeStr: string | null = null;
    if (itemInput.selectedSize) {
      const dbSize = dbProduct.sizes.find(
        (s) => s.id === itemInput.selectedSize?.sizeId || s.name === itemInput.selectedSize?.name,
      );
      if (dbSize) {
        unitPrice += Number(dbSize.priceAdjustment);
        selectedSizeStr = JSON.stringify({
          sizeId: dbSize.id,
          name: dbSize.name,
          nameAr: dbSize.nameAr,
          priceAdjustment: Number(dbSize.priceAdjustment),
        });
      }
    }

    // Validate addons if selected
    let selectedAddonsStr: string | null = null;
    if (itemInput.selectedAddons && itemInput.selectedAddons.length > 0) {
      const validAddonsList: {
        groupId: string;
        groupName: string;
        itemId: string;
        name: string;
        nameAr: string;
        price: number;
      }[] = [];

      for (const addonInput of itemInput.selectedAddons) {
        // find in groups
        for (const group of dbProduct.addonGroups) {
          const item = group.items.find(
            (it) => it.id === addonInput.itemId || it.name === addonInput.name,
          );
          if (item && item.isAvailable) {
            const addPrice = Number(item.price);
            unitPrice += addPrice;
            validAddonsList.push({
              groupId: group.id,
              groupName: group.nameAr,
              itemId: item.id,
              name: item.name,
              nameAr: item.nameAr,
              price: addPrice,
            });
            break;
          }
        }
      }

      if (validAddonsList.length > 0) {
        selectedAddonsStr = JSON.stringify(validAddonsList);
      }
    }

    const itemTotalPrice = unitPrice * itemInput.quantity;
    calculatedSubtotal += itemTotalPrice;

    preparedItems.push({
      productId: dbProduct.id,
      productName: dbProduct.name,
      productNameAr: dbProduct.nameAr,
      productImage: dbProduct.image,
      productPrice: unitPrice,
      quantity: itemInput.quantity,
      selectedSize: selectedSizeStr,
      selectedAddons: selectedAddonsStr,
      specialInstructions: itemInput.specialInstructions,
      totalPrice: itemTotalPrice,
    });
  }

  // 4. Verify minimum order amount
  if (calculatedSubtotal < minOrderAmount) {
    throw new AppError(
      `الحد الأدنى لقيمة الطلب هو ${minOrderAmount} ج.م (مجموعك الحالي: ${calculatedSubtotal.toFixed(2)} ج.م)`,
      400,
    );
  }

  // 5. Calculate delivery fee
  const deliveryFee = input.orderType === "delivery" ? deliveryFeeConfig : 0;

  // 6. Calculate coupon discount if provided
  let discountAmount = 0;
  let validCouponCode: string | null = null;

  if (input.couponCode) {
    const couponResult = await validateCouponService({
      code: input.couponCode,
      subtotal: calculatedSubtotal,
    });
    discountAmount = couponResult.discountAmount;
    validCouponCode = couponResult.code;
  }

  // 7. Calculate tax and total
  const taxableAmount = Math.max(0, calculatedSubtotal - discountAmount);
  const taxAmount = taxRate > 0 ? (taxableAmount * taxRate) / 100 : 0;
  const totalAmount = Math.max(0, taxableAmount + deliveryFee + taxAmount);

  // 8. Generate order number: e.g. ORD-26-A1B2
  const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  const orderNumber = `ORD-26-${randomSuffix}`;

  const orderData: PreparedOrderData = {
    orderNumber,
    userId: userId ?? null,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail || null,
    deliveryAddress: input.deliveryAddress,
    deliveryInstructions: input.deliveryInstructions || null,
    orderType: input.orderType,
    paymentMethod: input.paymentMethod,
    subtotal: calculatedSubtotal,
    discountAmount,
    deliveryFee,
    taxAmount,
    totalAmount,
    couponCode: validCouponCode,
    estimatedDeliveryMinutes: Number(settings?.estimatedPrepTimeMinutes || 30) + 15,
  };

  // 9. Create order transaction
  const createdOrder = await createOrderWithItemsQuery(orderData, preparedItems);

  // 10. Increment coupon usage if used
  if (validCouponCode) {
    await incrementCouponUsageQuery(validCouponCode);
  }

  return createdOrder;
};

export const getOrderByIdService = async (id: string, userId?: string) => {
  const order = await getOrderByIdQuery(id);
  if (!order) {
    throw new AppError("الطلب غير موجود", 404);
  }
  // If customer requesting, verify ownership unless admin
  if (userId && (order as { userId?: string }).userId && (order as { userId?: string }).userId !== userId) {
    throw new AppError("غير مصرح بالوصول إلى هذا الطلب", 403);
  }
  return order;
};

export const trackOrderByNumberService = async (orderNumber: string) => {
  const order = await getOrderByNumberQuery(orderNumber);
  if (!order) {
    throw new AppError("رقم الطلب غير صحيح أو غير مسجل في النظام", 404);
  }
  return order;
};

export const getUserOrdersService = async (userId: string) => {
  return await getOrdersByUserIdQuery(userId);
};

export const getAdminOrdersService = async (filter: AdminOrdersFilter) => {
  return await getAdminOrdersQuery(filter);
};

export const updateOrderStatusService = async (
  id: string,
  input: UpdateOrderStatusInput,
  adminName = "admin",
) => {
  const order = await getOrderByIdQuery(id);
  if (!order) {
    throw new AppError("الطلب غير موجود", 404);
  }

  return await updateOrderStatusQuery(
    id,
    input.status,
    (order as { status: string }).status,
    input.note,
    input.cancellationReason,
    adminName,
  );
};

export const updateOrderPaymentStatusService = async (
  id: string,
  input: UpdatePaymentStatusInput,
) => {
  const order = await getOrderByIdQuery(id);
  if (!order) {
    throw new AppError("الطلب غير موجود", 404);
  }

  return await updateOrderPaymentStatusQuery(
    id,
    input.paymentStatus,
    input.transactionReference,
    input.note,
  );
};
