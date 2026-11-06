import { Router } from "express";

const router: Router = Router();

router.use(
  "/categories",
  (await import("./features/categories/categories.routes.js")).default,
);

router.use(
  "/products",
  (await import("./features/products/products.routes.js")).default,
);

router.use(
  "/orders",
  (await import("./features/orders/orders.routes.js")).default,
);

router.use(
  "/coupons",
  (await import("./features/coupons/coupons.routes.js")).default,
);

router.use(
  "/payments",
  (await import("./features/payments/payments.routes.js")).default,
);

router.use(
  "/settings",
  (await import("./features/settings/settings.routes.js")).default,
);

router.use(
  "/analytics",
  (await import("./features/analytics/analytics.routes.js")).default,
);

router.use(
  "/customers",
  (await import("./features/customers/customers.routes.js")).default,
);

router.use(
  "/users",
  (await import("./features/users/users.routes.js")).default,
);

router.use(
  "/addresses",
  (await import("./features/addresses/addresses.routes.js")).default,
);

router.use(
  "/reviews",
  (await import("./features/reviews/reviews.routes.js")).default,
);

router.use("/seed", (await import("./features/seed/seed.routes.js")).default);

export default router;
