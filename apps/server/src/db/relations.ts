import { defineRelations } from "drizzle-orm";

import * as schema from "./schema.js";
import * as authSchema from "./auth-schema.js";

export const relations = defineRelations({ ...schema, ...authSchema }, (r) => ({
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
    orders: r.many.orders(),
    deliveryAddresses: r.many.deliveryAddresses(),
    favorites: r.many.favorites(),
    reviews: r.many.productReviews(),
    staffProfile: r.one.staff({
      from: r.user.id,
      to: r.staff.userId,
    }),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },
  categories: {
    products: r.many.products(),
    parent: r.one.categories({
      from: r.categories.parentId,
      to: r.categories.id,
    }),
  },
  products: {
    category: r.one.categories({
      from: r.products.categoryId,
      to: r.categories.id,
    }),
    images: r.many.productImages(),
    sizes: r.many.productSizes(),
    addonGroups: r.many.productAddonGroups(),
    reviews: r.many.productReviews(),
    favorites: r.many.favorites(),
    orderItems: r.many.orderItems(),
  },
  productImages: {
    product: r.one.products({
      from: r.productImages.productId,
      to: r.products.id,
    }),
  },
  productSizes: {
    product: r.one.products({
      from: r.productSizes.productId,
      to: r.products.id,
    }),
  },
  productAddonGroups: {
    product: r.one.products({
      from: r.productAddonGroups.productId,
      to: r.products.id,
    }),
    items: r.many.productAddonItems(),
  },
  productAddonItems: {
    group: r.one.productAddonGroups({
      from: r.productAddonItems.groupId,
      to: r.productAddonGroups.id,
    }),
  },
  deliveryAddresses: {
    user: r.one.user({
      from: r.deliveryAddresses.userId,
      to: r.user.id,
    }),
  },
  orders: {
    user: r.one.user({
      from: r.orders.userId,
      to: r.user.id,
    }),
    items: r.many.orderItems(),
    payments: r.many.payments(),
    statusHistory: r.many.orderStatusHistory(),
  },
  orderItems: {
    order: r.one.orders({
      from: r.orderItems.orderId,
      to: r.orders.id,
    }),
    product: r.one.products({
      from: r.orderItems.productId,
      to: r.products.id,
    }),
  },
  orderStatusHistory: {
    order: r.one.orders({
      from: r.orderStatusHistory.orderId,
      to: r.orders.id,
    }),
  },
  payments: {
    order: r.one.orders({
      from: r.payments.orderId,
      to: r.orders.id,
    }),
  },
  productReviews: {
    product: r.one.products({
      from: r.productReviews.productId,
      to: r.products.id,
    }),
    user: r.one.user({
      from: r.productReviews.userId,
      to: r.user.id,
    }),
  },
  favorites: {
    user: r.one.user({
      from: r.favorites.userId,
      to: r.user.id,
    }),
    product: r.one.products({
      from: r.favorites.productId,
      to: r.products.id,
    }),
  },
  staff: {
    user: r.one.user({
      from: r.staff.userId,
      to: r.user.id,
    }),
  },
}));
