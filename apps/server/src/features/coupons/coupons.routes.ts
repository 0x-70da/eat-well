import { Router } from "express";
import { getCouponsController } from "./controllers/getCoupons.controller.js";
import { validateCouponController } from "./controllers/validateCoupon.controller.js";
import { createCouponController } from "./controllers/createCoupon.controller.js";
import { updateCouponController } from "./controllers/updateCoupon.controller.js";
import { deleteCouponController } from "./controllers/deleteCoupon.controller.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router: Router = Router();

router.post("/validate", validateCouponController);
router.get("/", requirePermission("coupons", "list"), getCouponsController);
router.post("/", requirePermission("coupons", "create"), createCouponController);
router.put("/:id", requirePermission("coupons", "update"), updateCouponController);
router.delete("/:id", requirePermission("coupons", "delete"), deleteCouponController);

export default router;
