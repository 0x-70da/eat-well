import { z } from "zod";

// -------------------------------------------------------------
// Common / Query Schemas
// -------------------------------------------------------------
export const basePaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().optional(),
});

export const productFilterSchema = basePaginationSchema.extend({
  categoryId: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  isFeatured: z.enum(["true", "false"]).optional(),
  isPopular: z.enum(["true", "false"]).optional(),
  sortBy: z
    .enum(["price_asc", "price_desc", "rating", "newest", "popular"])
    .default("newest"),
});

// -------------------------------------------------------------
// Category Schemas
// -------------------------------------------------------------
export const createCategorySchema = z.object({
  name: z.string().min(2, "اسم التصنيف مطلوب بالإنجليزية"),
  nameAr: z.string().min(2, "اسم التصنيف مطلوب بالعربية"),
  slug: z.string().min(2, "الاسم اللطيف (Slug) مطلوب"),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  image: z
    .string()
    .url("رابط صورة التصنيف غير صالح")
    .optional()
    .or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
  parentId: z.string().optional().nullable(),
});

export const updateCategorySchema = createCategorySchema.partial();

// -------------------------------------------------------------
// Product Size & Addon Schemas
// -------------------------------------------------------------
export const productSizeInputSchema = z.object({
  name: z.string().min(1, "اسم الحجم مطلوب"),
  nameAr: z.string().min(1, "اسم الحجم بالعربية مطلوب"),
  priceAdjustment: z.coerce.number().default(0),
  isDefault: z.boolean().default(false),
});

export const productAddonItemInputSchema = z.object({
  name: z.string().min(1, "اسم الإضافة مطلوب"),
  nameAr: z.string().min(1, "اسم الإضافة بالعربية مطلوب"),
  price: z.coerce.number().min(0, "السعر لا يمكن أن يكون سالباً").default(0),
  isAvailable: z.boolean().default(true),
});

export const productAddonGroupInputSchema = z.object({
  name: z.string().min(1, "اسم مجموعة الإضافات مطلوب"),
  nameAr: z.string().min(1, "اسم المجموعة بالعربية مطلوب"),
  minSelections: z.coerce.number().int().min(0).default(0),
  maxSelections: z.coerce.number().int().min(1).default(1),
  isRequired: z.boolean().default(false),
  items: z
    .array(productAddonItemInputSchema)
    .min(1, "يجب إضافة خيار واحد على الأقل للمجموعة"),
});

// -------------------------------------------------------------
// Product Schemas
// -------------------------------------------------------------
export const createProductSchema = z.object({
  name: z.string().min(2, "اسم الوجبة مطلوب بالإنجليزية"),
  nameAr: z.string().min(2, "اسم الوجبة مطلوب بالعربية"),
  slug: z.string().min(2, "الاسم اللطيف مطلوب"),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  price: z.coerce.number().positive("السعر يجب أن يكون أكبر من صفر"),
  originalPrice: z.coerce.number().positive().optional().nullable(),
  categoryId: z.string().min(1, "يجب اختيار التصنيف"),
  image: z.string().url("رابط الصورة غير صالح"),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  prepTimeMinutes: z.coerce.number().int().min(1).default(20),
  calories: z.coerce.number().int().positive().optional().nullable(),
  spicyLevel: z.coerce.number().int().min(0).max(3).default(0),
  sizes: z.array(productSizeInputSchema).optional(),
  addonGroups: z.array(productAddonGroupInputSchema).optional(),
  galleryImages: z.array(z.string().url()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

// -------------------------------------------------------------
// Order Schemas
// -------------------------------------------------------------
export const orderItemInputSchema = z.object({
  productId: z.string().min(1, "معرف المنتج مطلوب"),
  quantity: z.coerce.number().int().min(1, "الكمية يجب أن تكون 1 على الأقل"),
  selectedSize: z
    .object({
      sizeId: z.string().optional(),
      name: z.string(),
      nameAr: z.string(),
      priceAdjustment: z.number().default(0),
    })
    .optional()
    .nullable(),
  selectedAddons: z
    .array(
      z.object({
        groupId: z.string().optional(),
        groupName: z.string().optional(),
        itemId: z.string().optional(),
        name: z.string(),
        nameAr: z.string(),
        price: z.number().default(0),
      }),
    )
    .optional(),
  specialInstructions: z.string().max(255).optional(),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2, "الاسم مطلوب"),
  customerPhone: z
    .string()
    .min(10, "رقم الهاتف غير صالح")
    .max(15, "رقم الهاتف غير صالح"),
  customerEmail: z
    .string()
    .email("البريد الإلكتروني غير صالح")
    .optional()
    .or(z.literal("")),
  deliveryAddress: z.string().min(5, "عنوان التوصيل مطلوب بدقة"),
  deliveryInstructions: z.string().max(300).optional(),
  orderType: z.enum(["delivery", "pickup"]).default("delivery"),
  paymentMethod: z.enum(["cod", "stripe", "paymob"]).default("cod"),
  paymobMethod: z.enum(["card", "vodafone_cash", "instapay"]).optional(),
  couponCode: z.string().optional().nullable(),
  saveAddress: z.boolean().optional(),
  addressTitle: z.string().optional(),
  savedAddressId: z.string().optional(),
  items: z
    .array(orderItemInputSchema)
    .min(1, "يجب أن تحتوي السلة على وجبة واحدة على الأقل"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "preparing",
    "ready_for_pickup",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ]),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]),
  transactionReference: z.string().optional(),
  note: z.string().optional(),
});

// -------------------------------------------------------------
// Coupon Schemas
// -------------------------------------------------------------
export const validateCouponSchema = z.object({
  code: z.string().min(1, "رمز الكوبون مطلوب"),
  subtotal: z.coerce.number().positive("المجموع يجب أن يكون أكبر من صفر"),
});

export const createCouponSchema = z.object({
  code: z.string().min(2, "رمز الكوبون مطلوب").toUpperCase(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]).default("percentage"),
  discountValue: z.coerce
    .number()
    .positive("قيمة الخصم يجب أن تكون أكبر من صفر"),
  minOrderAmount: z.coerce.number().min(0).default(0),
  maxDiscountAmount: z.coerce.number().positive().optional().nullable(),
  usageLimit: z.coerce.number().int().positive().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const updateCouponSchema = createCouponSchema.partial();

// -------------------------------------------------------------
// Product Review Schema
// -------------------------------------------------------------
export const createReviewSchema = z.object({
  productId: z.string().min(1, "معرف المنتج مطلوب"),
  customerName: z.string().min(2, "اسم العميل مطلوب"),
  rating: z.coerce
    .number()
    .int()
    .min(1)
    .max(5, "التقييم يجب أن يكون بين 1 و 5 نجوم"),
  comment: z
    .string()
    .min(3, "التعليق يجب أن يحتوي على 3 أحرف على الأقل")
    .max(500),
});

// -------------------------------------------------------------
// Delivery Address Schemas
// -------------------------------------------------------------
export const createDeliveryAddressSchema = z.object({
  title: z.string().min(1, "عنوان المكان (مثال: المنزل، العمل) مطلوب"),
  customerName: z.string().min(2, "الاسم مطلوب"),
  customerPhone: z.string().min(10, "رقم الهاتف غير صالح"),
  city: z.string().min(2, "المدينة مطلوبة"),
  area: z.string().min(2, "المنطقة / الحي مطلوب"),
  street: z.string().min(2, "الشارع مطلوب"),
  building: z.string().min(1, "رقم المبنى / العقار مطلوب"),
  floor: z.string().optional(),
  apartment: z.string().optional(),
  notes: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export const updateDeliveryAddressSchema =
  createDeliveryAddressSchema.partial();

// -------------------------------------------------------------
// Restaurant Settings Schema
// -------------------------------------------------------------
export const updateSettingsSchema = z.object({
  restaurantName: z.string().min(2).optional(),
  restaurantNameAr: z.string().min(2).optional(),
  slogan: z.string().optional(),
  sloganAr: z.string().optional(),
  descriptionAr: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  coverUrl: z.string().url().optional().or(z.literal("")),
  phone: z.string().min(6).optional(),
  secondaryPhone: z.string().optional(),
  email: z.string().email().optional(),
  addressAr: z.string().min(5).optional(),
  openingHour: z.string().optional(),
  closingHour: z.string().optional(),
  isDeliveryOpen: z.boolean().optional(),
  deliveryFee: z.coerce.number().min(0).optional(),
  minOrderAmount: z.coerce.number().min(0).optional(),
  estimatedPrepTimeMinutes: z.coerce.number().int().min(5).optional(),
  taxRate: z.coerce.number().min(0).max(100).optional(),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  whatsappNumber: z.string().optional(),
});

// -------------------------------------------------------------
// Staff Schemas
// -------------------------------------------------------------
export const createStaffSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  phone: z.string().optional(),
  role: z
    .enum(["super_admin", "admin", "manager", "order_manager", "staff"])
    .default("staff"),
});

export const updateStaffSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  role: z
    .enum(["super_admin", "admin", "manager", "order_manager", "staff"])
    .optional(),
  isActive: z.boolean().optional(),
});

// -------------------------------------------------------------
// Payments Schemas
// -------------------------------------------------------------
export const createPaymentIntentSchema = z.object({
  orderId: z.string().min(1, "معرف الطلب مطلوب"),
  provider: z.enum(["stripe", "paymob"]),
  paymobMethod: z.enum(["card", "vodafone_cash", "instapay"]).optional(),
  walletMobileNumber: z.string().optional(), // For Paymob Vodafone Cash / Mobile Wallet
});

export const createStripeCheckoutSchema = z.object({
  orderId: z.string().min(1, "معرف الطلب مطلوب"),
});

export const createPaymobCheckoutSchema = z.object({
  orderId: z.string().min(1, "معرف الطلب مطلوب"),
  paymobMethod: z.enum(["card", "vodafone_cash", "instapay"]).optional(),
  walletMobileNumber: z.string().optional(),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, "معرف الطلب مطلوب"),
  provider: z.enum(["stripe", "paymob"]),
  transactionId: z.string().optional(),
});

// -------------------------------------------------------------
// Auth Schemas
// -------------------------------------------------------------
export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
    token: z.string().min(1, "رمز إعادة التعيين مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

// -------------------------------------------------------------
// User Management & RBAC Schemas
// -------------------------------------------------------------
export const updateUserRoleSchema = z.object({
  userId: z.string().min(1, "معرف المستخدم مطلوب"),
  role: z.enum(
    ["super_admin", "admin", "manager", "order_manager", "staff", "user"],
    {
      error: "نوع الصلاحية المختار غير صالح",
    },
  ),
});

export const banUserSchema = z.object({
  userId: z.string().min(1, "معرف المستخدم مطلوب"),
  banned: z.boolean(),
  banReason: z.string().min(2, "سبب الإيقاف مطلوب").optional().nullable(),
  banExpiresInDays: z.coerce.number().int().min(1).optional().nullable(),
});

export const userFilterSchema = basePaginationSchema.extend({
  role: z.string().optional(),
  status: z.enum(["all", "active", "banned"]).optional().default("all"),
});

// -------------------------------------------------------------
// Type inference helpers
// -------------------------------------------------------------
export type BasePaginationInput = z.infer<typeof basePaginationSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateCategoryRawInput = z.input<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreateProductRawInput = z.input<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateOrderRawInput = z.input<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdatePaymentStatusInput = z.infer<
  typeof updatePaymentStatusSchema
>;
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type CreateCouponRawInput = z.input<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateDeliveryAddressInput = z.infer<
  typeof createDeliveryAddressSchema
>;
export type UpdateDeliveryAddressInput = z.infer<
  typeof updateDeliveryAddressSchema
>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type UpdateSettingsRawInput = z.input<typeof updateSettingsSchema>;
export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
export type CreatePaymentIntentInput = z.infer<
  typeof createPaymentIntentSchema
>;
export type CreateStripeCheckoutInput = z.infer<
  typeof createStripeCheckoutSchema
>;
export type CreatePaymobCheckoutInput = z.infer<
  typeof createPaymobCheckoutSchema
>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type BanUserInput = z.infer<typeof banUserSchema>;
export type BanUserRawInput = z.input<typeof banUserSchema>;
export type UserFilterInput = z.infer<typeof userFilterSchema>;
export type UserFilterRawInput = z.input<typeof userFilterSchema>;
