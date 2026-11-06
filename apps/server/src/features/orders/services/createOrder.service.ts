import { AppError } from "../../../lib/errors.js";
import { db } from "../../../db/index.js";
import {
  products,
  productSizes,
  productAddonGroups,
  productAddonItems,
  restaurantSettings,
  deliveryAddresses,
} from "../../../db/schema.js";
import { inArray, eq, and } from "drizzle-orm";
import { validateCouponService } from "../../coupons/services/validateCoupon.service.js";
import { incrementCouponUsageQuery } from "../../coupons/queries/incrementCouponUsage.query.js";
import { createOrderWithItemsQuery } from "../queries/createOrderWithItems.query.js";
import { createDeliveryAddressQuery } from "../../addresses/queries/createDeliveryAddress.query.js";
import type { CreateOrderInput } from "@workspace/validation";
import type { PreparedOrderItem, PreparedOrderData } from "../orders.types.js";
import crypto from "crypto";

export const createOrderService = async (
  input: CreateOrderInput,
  userId?: string | null,
) => {
  // 1. Fetch restaurant settings
  const settings = await fetchRestaurantSettings();

  // 2. Validate and handle address
  const resolvedAddress = await verifyAndHandleAddress(userId, input);

  // 3. Fetch products and customize
  const productIds = input.items.map((i) => i.productId);
  const productMap = await validateAndFetchProducts(productIds);

  // 4. Build and calculate items
  let calculatedSubtotal = 0;
  const preparedItems: PreparedOrderItem[] = [];

  for (const item of input.items) {
    const dbProd = productMap.get(item.productId);
    if (!dbProd) {
      throw new AppError(`الوجبة برقم ${item.productId} غير متوفرة`, 404);
    }
    if (!dbProd.isAvailable) {
      throw new AppError(
        `الوجبة "${dbProd.nameAr}" غير متاحة حالياً للطلب`,
        400,
      );
    }

    const preparedItem = computeOrderItem(item, dbProd);
    calculatedSubtotal += preparedItem.totalPrice;
    preparedItems.push(preparedItem);
  }

  // 5. Verify minimum order amount
  verifyMinimumOrder(calculatedSubtotal, settings.minOrderAmount);

  // 6. Validate & apply coupon discount
  const { discountAmount, validCouponCode } = await applyCouponDiscount(
    input.couponCode,
    calculatedSubtotal,
  );

  // 7. Calculate final order pricing
  const { deliveryFee, taxAmount, totalAmount } = calculateOrderPricing(
    calculatedSubtotal,
    discountAmount,
    input.orderType,
    settings.deliveryFee,
    settings.taxRate,
  );

  // 8. Generate readable order number
  const orderNumber = generateOrderNumber();

  // 9. Prepare order data
  const orderData: PreparedOrderData = {
    orderNumber,
    userId: userId ?? null,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail || null,
    deliveryAddress: resolvedAddress,
    deliveryInstructions: input.deliveryInstructions || null,
    orderType: input.orderType,
    paymentMethod: input.paymentMethod,
    subtotal: calculatedSubtotal,
    discountAmount,
    deliveryFee,
    taxAmount,
    totalAmount,
    couponCode: validCouponCode,
    estimatedDeliveryMinutes: settings.estimatedPrepTimeMinutes + 15,
  };

  // 10. Persist order with items
  const createdOrder = await createOrderWithItemsQuery(
    orderData,
    preparedItems,
  );

  // 11. Increment coupon usage if used
  if (validCouponCode) {
    await incrementCouponUsageQuery(validCouponCode);
  }

  return createdOrder;
};

// -------------------------------------------------------------
// Helper Functions
// -------------------------------------------------------------

async function fetchRestaurantSettings() {
  const [settings] = await db.select().from(restaurantSettings).limit(1);
  return {
    minOrderAmount: Number(settings?.minOrderAmount || 100),
    deliveryFee: Number(settings?.deliveryFee || 30),
    taxRate: Number(settings?.taxRate || 14),
    estimatedPrepTimeMinutes: Number(settings?.estimatedPrepTimeMinutes || 30),
  };
}

async function verifyAndHandleAddress(
  userId: string | null | undefined,
  input: CreateOrderInput,
): Promise<string> {
  if (input.savedAddressId) {
    if (!userId) {
      throw new AppError("يجب تسجيل الدخول لاستخدام العناوين المحفوظة", 401);
    }
    const [saved] = await db
      .select()
      .from(deliveryAddresses)
      .where(
        and(
          eq(deliveryAddresses.id, input.savedAddressId),
          eq(deliveryAddresses.userId, userId),
        ),
      )
      .limit(1);

    if (!saved) {
      throw new AppError("العنوان المحدد غير صالح أو لا ينتمي لحسابك", 403);
    }

    const formatted = `${saved.city} - ${saved.area} - ${saved.street} - مبنى ${saved.building}${saved.floor ? ` - طابق ${saved.floor}` : ""}${saved.apartment ? ` - شقة ${saved.apartment}` : ""}`;
    return input.deliveryAddress || formatted;
  }

  // If saveAddress is true and user is authenticated
  if (input.saveAddress && userId) {
    try {
      await createDeliveryAddressQuery(userId, {
        title: input.addressTitle || "عنوان التوصيل",
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        city: "القاهرة",
        area: "الرئيسي",
        street: input.deliveryAddress,
        building: "-",
        notes: input.deliveryInstructions || undefined,
        isDefault: false,
      });
    } catch {
      // Non-blocking if address auto-save fails
    }
  }

  return input.deliveryAddress;
}

async function validateAndFetchProducts(productIds: string[]) {
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
  const dbAddonItems =
    groupIds.length > 0
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

  return new Map(
    dbProductsList.map((p) => [
      p.id,
      {
        ...p,
        sizes: sizesByProduct.get(p.id) || [],
        addonGroups: groupsByProduct.get(p.id) || [],
      },
    ]),
  );
}

function computeOrderItem(
  item: CreateOrderInput["items"][number],
  dbProd: {
    id: string;
    name: string;
    nameAr: string;
    image: string;
    price: string | number;
    sizes: {
      id: string;
      name: string;
      nameAr: string;
      priceAdjustment: string | number;
    }[];
    addonGroups: {
      id: string;
      items: {
        id: string;
        name: string;
        nameAr: string;
        price: string | number;
      }[];
    }[];
  },
): PreparedOrderItem {
  const basePrice = Number(dbProd.price);
  let sizePriceAdj = 0;
  let selectedSizeStr: string | null = null;

  if (item.selectedSize?.name) {
    const dbSize = dbProd.sizes.find(
      (s) =>
        s.id === item.selectedSize?.sizeId ||
        s.name === item.selectedSize?.name ||
        s.nameAr === item.selectedSize?.nameAr,
    );
    if (dbSize) {
      sizePriceAdj = Number(dbSize.priceAdjustment || 0);
      selectedSizeStr = JSON.stringify({
        sizeId: dbSize.id,
        name: dbSize.name,
        nameAr: dbSize.nameAr,
        priceAdjustment: sizePriceAdj,
      });
    }
  }

  let addonsTotal = 0;
  let selectedAddonsStr: string | null = null;
  if (item.selectedAddons && item.selectedAddons.length > 0) {
    const validAddonsList = [];
    for (const addon of item.selectedAddons) {
      const itemPrice = Number(addon.price || 0);
      addonsTotal += itemPrice;
      validAddonsList.push({
        groupId: addon.groupId,
        groupName: addon.groupName,
        itemId: addon.itemId,
        name: addon.name,
        nameAr: addon.nameAr,
        price: itemPrice,
      });
    }
    selectedAddonsStr = JSON.stringify(validAddonsList);
  }

  const unitPrice = basePrice + sizePriceAdj + addonsTotal;
  const itemTotal = unitPrice * item.quantity;

  return {
    productId: dbProd.id,
    productName: dbProd.name,
    productNameAr: dbProd.nameAr,
    productImage: dbProd.image,
    productPrice: unitPrice,
    quantity: item.quantity,
    selectedSize: selectedSizeStr,
    selectedAddons: selectedAddonsStr,
    specialInstructions: item.specialInstructions || null,
    totalPrice: itemTotal,
  };
}

function verifyMinimumOrder(subtotal: number, minOrderAmount: number) {
  if (subtotal < minOrderAmount) {
    throw new AppError(
      `الحد الأدنى للطلب هو ${minOrderAmount} ج.م. إجمالي سلتك الحالي هو ${subtotal.toFixed(2)} ج.م`,
      400,
    );
  }
}

async function applyCouponDiscount(
  couponCode: string | null | undefined,
  subtotal: number,
) {
  let discountAmount = 0;
  let validCouponCode: string | null = null;

  if (couponCode) {
    try {
      const couponResult = await validateCouponService({
        code: couponCode,
        subtotal,
      });
      discountAmount = couponResult.discountAmount;
      validCouponCode = couponResult.code;
    } catch {
      throw new AppError(
        `الكوبون "${couponCode}" غير صالح أو انتهت صلاحيته`,
        400,
      );
    }
  }

  return { discountAmount, validCouponCode };
}

function calculateOrderPricing(
  subtotal: number,
  discountAmount: number,
  orderType: string,
  deliveryFeeConfig: number,
  taxRate: number,
) {
  const deliveryFee = orderType === "delivery" ? deliveryFeeConfig : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * taxRate) / 100;
  const totalAmount = taxableAmount + deliveryFee;

  return { deliveryFee, taxAmount, totalAmount };
}

function generateOrderNumber() {
  const today = new Date();
  const yearSuffix = today.getFullYear().toString().slice(-2);
  const randomChars = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `ORD-${yearSuffix}-${randomChars}`;
}
