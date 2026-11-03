import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema.js";

// Categories table
export const categories = pgTable(
  "categories",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    nameAr: text("name_ar").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    descriptionAr: text("description_ar"),
    image: text("image"),
    sortOrder: integer("sort_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    parentId: text("parent_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("categories_slug_idx").on(table.slug),
    index("categories_sort_order_idx").on(table.sortOrder),
    index("categories_parent_id_idx").on(table.parentId),
  ],
);

// Products table
export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    nameAr: text("name_ar").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    descriptionAr: text("description_ar"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    image: text("image").notNull(),
    isAvailable: boolean("is_available").default(true).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isPopular: boolean("is_popular").default(false).notNull(),
    prepTimeMinutes: integer("prep_time_minutes").default(20).notNull(),
    calories: integer("calories"),
    rating: numeric("rating", { precision: 3, scale: 2 }).default("4.80").notNull(),
    reviewsCount: integer("reviews_count").default(0).notNull(),
    orderCount: integer("order_count").default(0).notNull(),
    spicyLevel: integer("spicy_level").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("products_slug_idx").on(table.slug),
    index("products_category_id_idx").on(table.categoryId),
    index("products_is_available_idx").on(table.isAvailable),
    index("products_is_featured_idx").on(table.isFeatured),
    index("products_is_popular_idx").on(table.isPopular),
  ],
);

// Secondary images for products
export const productImages = pgTable(
  "product_images",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("product_images_product_id_idx").on(table.productId)],
);

// Product sizes (e.g. Single, Double, Family / صغير، وسط، كبير)
export const productSizes = pgTable(
  "product_sizes",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    nameAr: text("name_ar").notNull(),
    priceAdjustment: numeric("price_adjustment", { precision: 10, scale: 2 })
      .default("0.00")
      .notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
  },
  (table) => [index("product_sizes_product_id_idx").on(table.productId)],
);

// Product Addon Groups (e.g. "اختر الصوص", "إضافات مميزة")
export const productAddonGroups = pgTable(
  "product_addon_groups",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    nameAr: text("name_ar").notNull(),
    minSelections: integer("min_selections").default(0).notNull(),
    maxSelections: integer("max_selections").default(1).notNull(),
    isRequired: boolean("is_required").default(false).notNull(),
  },
  (table) => [index("product_addon_groups_product_id_idx").on(table.productId)],
);

// Items within an addon group
export const productAddonItems = pgTable(
  "product_addon_items",
  {
    id: text("id").primaryKey(),
    groupId: text("group_id")
      .notNull()
      .references(() => productAddonGroups.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    nameAr: text("name_ar").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).default("0.00").notNull(),
    isAvailable: boolean("is_available").default(true).notNull(),
  },
  (table) => [index("product_addon_items_group_id_idx").on(table.groupId)],
);

// Delivery Addresses for customers
export const deliveryAddresses = pgTable(
  "delivery_addresses",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(), // e.g. "المنزل", "العمل"
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    city: text("city").notNull(),
    area: text("area").notNull(),
    street: text("street").notNull(),
    building: text("building").notNull(),
    floor: text("floor"),
    apartment: text("apartment"),
    notes: text("notes"),
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("delivery_addresses_user_id_idx").on(table.userId)],
);

// Coupons and Promotional Discounts
export const coupons = pgTable(
  "coupons",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull().unique(),
    description: text("description"),
    descriptionAr: text("description_ar"),
    discountType: text("discount_type").notNull().default("percentage"), // percentage | fixed
    discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
    minOrderAmount: numeric("min_order_amount", { precision: 10, scale: 2 })
      .default("0.00")
      .notNull(),
    maxDiscountAmount: numeric("max_discount_amount", { precision: 10, scale: 2 }),
    usageLimit: integer("usage_limit"),
    usedCount: integer("used_count").default(0).notNull(),
    expiresAt: timestamp("expires_at"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("coupons_code_idx").on(table.code)],
);

// Customer Orders
export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    orderNumber: text("order_number").notNull().unique(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerEmail: text("customer_email"),
    deliveryAddress: text("delivery_address").notNull(),
    deliveryInstructions: text("delivery_instructions"),
    orderType: text("order_type").default("delivery").notNull(), // delivery | pickup
    status: text("status").default("pending").notNull(), // pending | confirmed | preparing | ready_for_pickup | out_for_delivery | delivered | cancelled
    paymentMethod: text("payment_method").default("cod").notNull(), // cod | stripe | paymob
    paymentStatus: text("payment_status").default("pending").notNull(), // pending | paid | failed | refunded
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
    discountAmount: numeric("discount_amount", { precision: 10, scale: 2 })
      .default("0.00")
      .notNull(),
    deliveryFee: numeric("delivery_fee", { precision: 10, scale: 2 })
      .default("0.00")
      .notNull(),
    taxAmount: numeric("tax_amount", { precision: 10, scale: 2 })
      .default("0.00")
      .notNull(),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
    couponCode: text("coupon_code"),
    cancellationReason: text("cancellation_reason"),
    estimatedDeliveryMinutes: integer("estimated_delivery_minutes").default(45).notNull(),
    deliveredAt: timestamp("delivered_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("orders_order_number_idx").on(table.orderNumber),
    index("orders_user_id_idx").on(table.userId),
    index("orders_status_idx").on(table.status),
    index("orders_payment_status_idx").on(table.paymentStatus),
    index("orders_created_at_idx").on(table.createdAt),
  ],
);

// Individual Order Items (preserves historical item details even if product changes)
export const orderItems = pgTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    productName: text("product_name").notNull(),
    productNameAr: text("product_name_ar").notNull(),
    productImage: text("product_image"),
    productPrice: numeric("product_price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull().default(1),
    selectedSize: text("selected_size"), // JSON string with size details if chosen
    selectedAddons: text("selected_addons"), // JSON string with array of addons
    specialInstructions: text("special_instructions"),
    totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  },
  (table) => [index("order_items_order_id_idx").on(table.orderId)],
);

// Order status change audit log
export const orderStatusHistory = pgTable(
  "order_status_history",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    fromStatus: text("from_status"),
    toStatus: text("to_status").notNull(),
    note: text("note"),
    changedBy: text("changed_by").notNull().default("system"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("order_status_history_order_id_idx").on(table.orderId)],
);

// Payment Transactions record
export const payments = pgTable(
  "payments",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(), // 'stripe' | 'paymob' | 'cod'
    paymentMethod: text("payment_method").notNull(), // 'card' | 'vodafone_cash' | 'instapay' | 'cash'
    transactionReference: text("transaction_reference"),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    currency: text("currency").default("EGP").notNull(),
    status: text("status").default("pending").notNull(), // pending | successful | failed | cancelled | refunded
    metadata: text("metadata"), // Raw provider response JSON
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("payments_order_id_idx").on(table.orderId),
    index("payments_reference_idx").on(table.transactionReference),
    index("payments_status_idx").on(table.status),
  ],
);

// Product customer reviews
export const productReviews = pgTable(
  "product_reviews",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    customerName: text("customer_name").notNull(),
    rating: integer("rating").notNull(), // 1 to 5
    comment: text("comment").notNull(),
    isApproved: boolean("is_approved").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("product_reviews_product_id_idx").on(table.productId),
    index("product_reviews_user_id_idx").on(table.userId),
  ],
);

// Customer favorite products
export const favorites = pgTable(
  "favorites",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("favorites_user_id_idx").on(table.userId),
    index("favorites_product_id_idx").on(table.productId),
  ],
);

// Restaurant Global Settings
export const restaurantSettings = pgTable("restaurant_settings", {
  id: text("id").primaryKey().default("default"),
  restaurantName: text("restaurant_name").default("Eat Well Restaurant").notNull(),
  restaurantNameAr: text("restaurant_name_ar").default("مطعم إيت ويل").notNull(),
  slogan: text("slogan").default("Authentic Oriental Cuisine & Grills"),
  sloganAr: text("slogan_ar").default("أشهى المأكولات والمشاوي الشرقية بأعلى معايير الجودة"),
  descriptionAr: text("description_ar").default(
    "نقدم تجربة طعام شرقية أصيلة تجمع بين النكهات التقليدية واللمسات العصرية باستخدام أفضل المكونات الطازجة.",
  ),
  logoUrl: text("logo_url"),
  coverUrl: text("cover_url"),
  phone: text("phone").default("+20 100 000 0000").notNull(),
  secondaryPhone: text("secondary_phone").default("+20 120 000 0000"),
  email: text("email").default("info@eatwell-restaurant.com"),
  addressAr: text("address_ar").default("شارع النصر، المعادي، القاهرة، مصر"),
  openingHour: text("opening_hour").default("11:00 AM").notNull(),
  closingHour: text("closing_hour").default("01:00 AM").notNull(),
  isDeliveryOpen: boolean("is_delivery_open").default(true).notNull(),
  deliveryFee: numeric("delivery_fee", { precision: 10, scale: 2 })
    .default("30.00")
    .notNull(),
  minOrderAmount: numeric("min_order_amount", { precision: 10, scale: 2 })
    .default("100.00")
    .notNull(),
  estimatedPrepTimeMinutes: integer("estimated_prep_time_minutes")
    .default(30)
    .notNull(),
  currency: text("currency").default("ج.م").notNull(),
  currencyCode: text("currency_code").default("EGP").notNull(),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).default("14.00").notNull(),
  facebookUrl: text("facebook_url").default("https://facebook.com"),
  instagramUrl: text("instagram_url").default("https://instagram.com"),
  whatsappNumber: text("whatsapp_number").default("+201000000000"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Staff / Admin Team members
export const staff = pgTable(
  "staff",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone"),
    role: text("role").default("staff").notNull(), // super_admin | admin | manager | order_manager | staff
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("staff_user_id_idx").on(table.userId)],
);
