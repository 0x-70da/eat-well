import { Router } from "express";
import { getCouponsController } from "./controllers/getCoupons.controller.js";
import { validateCouponController } from "./controllers/validateCoupon.controller.js";
import { createCouponController } from "./controllers/createCoupon.controller.js";
import { updateCouponController } from "./controllers/updateCoupon.controller.js";
import { deleteCouponController } from "./controllers/deleteCoupon.controller.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router: Router = Router();

router.post("/validate", validateCouponController);
router.get("/", adminMiddleware, getCouponsController);
router.post("/", adminMiddleware, createCouponController);
router.put("/:id", adminMiddleware, updateCouponController);
router.delete("/:id", adminMiddleware, deleteCouponController);

export default router;
