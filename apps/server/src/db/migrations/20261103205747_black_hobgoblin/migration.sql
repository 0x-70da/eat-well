CREATE TABLE "categories" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"name_ar" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"description" text,
	"description_ar" text,
	"image" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"parent_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" text PRIMARY KEY,
	"code" text NOT NULL UNIQUE,
	"description" text,
	"description_ar" text,
	"discount_type" text DEFAULT 'percentage' NOT NULL,
	"discount_value" numeric(10,2) NOT NULL,
	"min_order_amount" numeric(10,2) DEFAULT '0.00' NOT NULL,
	"max_discount_amount" numeric(10,2),
	"usage_limit" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_addresses" (
	"id" text PRIMARY KEY,
	"user_id" text,
	"title" text NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"city" text NOT NULL,
	"area" text NOT NULL,
	"street" text NOT NULL,
	"building" text NOT NULL,
	"floor" text,
	"apartment" text,
	"notes" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"product_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" text PRIMARY KEY,
	"order_id" text NOT NULL,
	"product_id" text,
	"product_name" text NOT NULL,
	"product_name_ar" text NOT NULL,
	"product_image" text,
	"product_price" numeric(10,2) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"selected_size" text,
	"selected_addons" text,
	"special_instructions" text,
	"total_price" numeric(10,2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_status_history" (
	"id" text PRIMARY KEY,
	"order_id" text NOT NULL,
	"from_status" text,
	"to_status" text NOT NULL,
	"note" text,
	"changed_by" text DEFAULT 'system' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY,
	"order_number" text NOT NULL UNIQUE,
	"user_id" text,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_email" text,
	"delivery_address" text NOT NULL,
	"delivery_instructions" text,
	"order_type" text DEFAULT 'delivery' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"payment_method" text DEFAULT 'cod' NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"subtotal" numeric(10,2) NOT NULL,
	"discount_amount" numeric(10,2) DEFAULT '0.00' NOT NULL,
	"delivery_fee" numeric(10,2) DEFAULT '0.00' NOT NULL,
	"tax_amount" numeric(10,2) DEFAULT '0.00' NOT NULL,
	"total_amount" numeric(10,2) NOT NULL,
	"coupon_code" text,
	"cancellation_reason" text,
	"estimated_delivery_minutes" integer DEFAULT 45 NOT NULL,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY,
	"order_id" text NOT NULL,
	"provider" text NOT NULL,
	"payment_method" text NOT NULL,
	"transaction_reference" text,
	"amount" numeric(10,2) NOT NULL,
	"currency" text DEFAULT 'EGP' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_addon_groups" (
	"id" text PRIMARY KEY,
	"product_id" text NOT NULL,
	"name" text NOT NULL,
	"name_ar" text NOT NULL,
	"min_selections" integer DEFAULT 0 NOT NULL,
	"max_selections" integer DEFAULT 1 NOT NULL,
	"is_required" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_addon_items" (
	"id" text PRIMARY KEY,
	"group_id" text NOT NULL,
	"name" text NOT NULL,
	"name_ar" text NOT NULL,
	"price" numeric(10,2) DEFAULT '0.00' NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" text PRIMARY KEY,
	"product_id" text NOT NULL,
	"url" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_reviews" (
	"id" text PRIMARY KEY,
	"product_id" text NOT NULL,
	"user_id" text,
	"customer_name" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"is_approved" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_sizes" (
	"id" text PRIMARY KEY,
	"product_id" text NOT NULL,
	"name" text NOT NULL,
	"name_ar" text NOT NULL,
	"price_adjustment" numeric(10,2) DEFAULT '0.00' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"name_ar" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"description" text,
	"description_ar" text,
	"price" numeric(10,2) NOT NULL,
	"original_price" numeric(10,2),
	"category_id" text NOT NULL,
	"image" text NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	"prep_time_minutes" integer DEFAULT 20 NOT NULL,
	"calories" integer,
	"rating" numeric(3,2) DEFAULT '4.80' NOT NULL,
	"reviews_count" integer DEFAULT 0 NOT NULL,
	"order_count" integer DEFAULT 0 NOT NULL,
	"spicy_level" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurant_settings" (
	"id" text PRIMARY KEY DEFAULT 'default',
	"restaurant_name" text DEFAULT 'Eat Well Restaurant' NOT NULL,
	"restaurant_name_ar" text DEFAULT 'مطعم إيت ويل' NOT NULL,
	"slogan" text DEFAULT 'Authentic Oriental Cuisine & Grills',
	"slogan_ar" text DEFAULT 'أشهى المأكولات والمشاوي الشرقية بأعلى معايير الجودة',
	"description_ar" text DEFAULT 'نقدم تجربة طعام شرقية أصيلة تجمع بين النكهات التقليدية واللمسات العصرية باستخدام أفضل المكونات الطازجة.',
	"logo_url" text,
	"cover_url" text,
	"phone" text DEFAULT '+20 100 000 0000' NOT NULL,
	"secondary_phone" text DEFAULT '+20 120 000 0000',
	"email" text DEFAULT 'info@eatwell-restaurant.com',
	"address_ar" text DEFAULT 'شارع النصر، المعادي، القاهرة، مصر',
	"opening_hour" text DEFAULT '11:00 AM' NOT NULL,
	"closing_hour" text DEFAULT '01:00 AM' NOT NULL,
	"is_delivery_open" boolean DEFAULT true NOT NULL,
	"delivery_fee" numeric(10,2) DEFAULT '30.00' NOT NULL,
	"min_order_amount" numeric(10,2) DEFAULT '100.00' NOT NULL,
	"estimated_prep_time_minutes" integer DEFAULT 30 NOT NULL,
	"currency" text DEFAULT 'ج.م' NOT NULL,
	"currency_code" text DEFAULT 'EGP' NOT NULL,
	"tax_rate" numeric(5,2) DEFAULT '14.00' NOT NULL,
	"facebook_url" text DEFAULT 'https://facebook.com',
	"instagram_url" text DEFAULT 'https://instagram.com',
	"whatsapp_number" text DEFAULT '+201000000000',
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"phone" text,
	"role" text DEFAULT 'staff' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "categories_slug_idx" ON "categories" ("slug");--> statement-breakpoint
CREATE INDEX "categories_sort_order_idx" ON "categories" ("sort_order");--> statement-breakpoint
CREATE INDEX "categories_parent_id_idx" ON "categories" ("parent_id");--> statement-breakpoint
CREATE INDEX "coupons_code_idx" ON "coupons" ("code");--> statement-breakpoint
CREATE INDEX "delivery_addresses_user_id_idx" ON "delivery_addresses" ("user_id");--> statement-breakpoint
CREATE INDEX "favorites_user_id_idx" ON "favorites" ("user_id");--> statement-breakpoint
CREATE INDEX "favorites_product_id_idx" ON "favorites" ("product_id");--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" ("order_id");--> statement-breakpoint
CREATE INDEX "order_status_history_order_id_idx" ON "order_status_history" ("order_id");--> statement-breakpoint
CREATE INDEX "orders_order_number_idx" ON "orders" ("order_number");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" ("user_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" ("status");--> statement-breakpoint
CREATE INDEX "orders_payment_status_idx" ON "orders" ("payment_status");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" ("created_at");--> statement-breakpoint
CREATE INDEX "payments_order_id_idx" ON "payments" ("order_id");--> statement-breakpoint
CREATE INDEX "payments_reference_idx" ON "payments" ("transaction_reference");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" ("status");--> statement-breakpoint
CREATE INDEX "product_addon_groups_product_id_idx" ON "product_addon_groups" ("product_id");--> statement-breakpoint
CREATE INDEX "product_addon_items_group_id_idx" ON "product_addon_items" ("group_id");--> statement-breakpoint
CREATE INDEX "product_images_product_id_idx" ON "product_images" ("product_id");--> statement-breakpoint
CREATE INDEX "product_reviews_product_id_idx" ON "product_reviews" ("product_id");--> statement-breakpoint
CREATE INDEX "product_reviews_user_id_idx" ON "product_reviews" ("user_id");--> statement-breakpoint
CREATE INDEX "product_sizes_product_id_idx" ON "product_sizes" ("product_id");--> statement-breakpoint
CREATE INDEX "products_slug_idx" ON "products" ("slug");--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" ("category_id");--> statement-breakpoint
CREATE INDEX "products_is_available_idx" ON "products" ("is_available");--> statement-breakpoint
CREATE INDEX "products_is_featured_idx" ON "products" ("is_featured");--> statement-breakpoint
CREATE INDEX "products_is_popular_idx" ON "products" ("is_popular");--> statement-breakpoint
CREATE INDEX "staff_user_id_idx" ON "staff" ("user_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
ALTER TABLE "delivery_addresses" ADD CONSTRAINT "delivery_addresses_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_addon_groups" ADD CONSTRAINT "product_addon_groups_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_addon_items" ADD CONSTRAINT "product_addon_items_group_id_product_addon_groups_id_fkey" FOREIGN KEY ("group_id") REFERENCES "product_addon_groups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "product_sizes" ADD CONSTRAINT "product_sizes_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;