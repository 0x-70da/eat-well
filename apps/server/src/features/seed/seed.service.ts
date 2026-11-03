import { db } from "../../db/index.js";
import {
  categories,
  products,
  productSizes,
  productAddonGroups,
  productAddonItems,
  restaurantSettings,
  coupons,
} from "../../db/schema.js";
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_COUPONS,
} from "./seed.data.js";
import { count } from "drizzle-orm";
import crypto from "crypto";

export const seedDatabaseService = async () => {
  // 1. Check if categories already seeded
  const [catCountRes] = await db.select({ count: count() }).from(categories);
  const catCount = Number(catCountRes?.count || 0);

  if (catCount === 0) {
    for (const cat of SEED_CATEGORIES) {
      await db.insert(categories).values({
        id: cat.id,
        name: cat.name,
        nameAr: cat.nameAr,
        slug: cat.slug,
        description: cat.description,
        descriptionAr: cat.descriptionAr,
        image: cat.image,
        sortOrder: cat.sortOrder,
        isActive: true,
      });
    }
  }

  // 2. Check if products already seeded
  const [prodCountRes] = await db.select({ count: count() }).from(products);
  const prodCount = Number(prodCountRes?.count || 0);

  if (prodCount === 0) {
    for (const prod of SEED_PRODUCTS) {
      await db.insert(products).values({
        id: prod.id,
        name: prod.name,
        nameAr: prod.nameAr,
        slug: prod.slug,
        description: prod.description,
        descriptionAr: prod.descriptionAr,
        price: prod.price.toString(),
        originalPrice: prod.originalPrice ? prod.originalPrice.toString() : null,
        categoryId: prod.categoryId,
        image: prod.image,
        isAvailable: prod.isAvailable,
        isFeatured: prod.isFeatured,
        isPopular: prod.isPopular,
        prepTimeMinutes: prod.prepTimeMinutes,
        calories: prod.calories,
        rating: prod.rating.toString(),
        reviewsCount: prod.reviewsCount,
        orderCount: prod.orderCount,
        spicyLevel: prod.spicyLevel,
      });

      if (prod.sizes && prod.sizes.length > 0) {
        await db.insert(productSizes).values(
          prod.sizes.map((s) => ({
            id: `sz_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
            productId: prod.id,
            name: s.name,
            nameAr: s.nameAr,
            priceAdjustment: s.priceAdjustment.toString(),
            isDefault: s.isDefault,
          })),
        );
      }

      if (prod.addonGroups && prod.addonGroups.length > 0) {
        for (const grp of prod.addonGroups) {
          const groupId = `grp_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
          await db.insert(productAddonGroups).values({
            id: groupId,
            productId: prod.id,
            name: grp.name,
            nameAr: grp.nameAr,
            minSelections: grp.minSelections,
            maxSelections: grp.maxSelections,
            isRequired: grp.isRequired,
          });

          if (grp.items && grp.items.length > 0) {
            await db.insert(productAddonItems).values(
              grp.items.map((it) => ({
                id: `itm_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`,
                groupId,
                name: it.name,
                nameAr: it.nameAr,
                price: it.price.toString(),
                isAvailable: it.isAvailable,
              })),
            );
          }
        }
      }
    }
  }

  // 3. Settings
  const [settingsCountRes] = await db.select({ count: count() }).from(restaurantSettings);
  if (Number(settingsCountRes?.count || 0) === 0) {
    await db.insert(restaurantSettings).values({
      id: "default",
      restaurantName: "Eat Well Restaurant",
      restaurantNameAr: "مطعم إيت ويل للمشاوي والمأكولات الشرقية",
      slogan: "Authentic Oriental Cuisine & Charcoal Grills",
      sloganAr: "أشهى المأكولات والمشاوي على الفحم بأعلى معايير الجودة المصرية الأصيلة",
      descriptionAr:
        "نقدم تجربة طعام فريدة تجمع بين أصالة المشاوي الشرقية على الفحم والشاورما الفاخرة والطواجن الفخارية المطهوة بعناية فائقة، باستخدام أجود أنواع اللحوم الطازجة والمكونات الطبيعية.",
      logoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
      coverUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      phone: "+20 100 000 0000",
      secondaryPhone: "+20 120 000 0000",
      email: "info@eatwell-restaurant.com",
      addressAr: "شارع النصر، المعادي الجديدة، القاهرة، مصر",
      openingHour: "11:00 AM",
      closingHour: "02:00 AM",
      isDeliveryOpen: true,
      deliveryFee: "30.00",
      minOrderAmount: "100.00",
      estimatedPrepTimeMinutes: 25,
      taxRate: "14.00",
      currency: "ج.م",
      currencyCode: "EGP",
      facebookUrl: "https://facebook.com/eatwell.eg",
      instagramUrl: "https://instagram.com/eatwell.eg",
      whatsappNumber: "+201000000000",
    });
  }

  // 4. Coupons
  const [couponCountRes] = await db.select({ count: count() }).from(coupons);
  if (Number(couponCountRes?.count || 0) === 0) {
    for (const c of SEED_COUPONS) {
      await db.insert(coupons).values({
        id: c.id,
        code: c.code,
        description: c.description,
        descriptionAr: c.descriptionAr,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderAmount: c.minOrderAmount,
        maxDiscountAmount: c.maxDiscountAmount,
        usageLimit: c.usageLimit,
        isActive: c.isActive,
      });
    }
  }

  return {
    success: true,
    message: "تم تهيئة قاعدة البيانات بالبيانات الأولية بنجاح",
  };
};
