import { Router } from "express";
import {
  getCouponsController,
  validateCouponController,
  createCouponController,
  updateCouponController,
  deleteCouponController,
} from "./controllers/coupon.controller.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router: Router = Router();

router.post("/validate", validateCouponController);
router.get("/", adminMiddleware, getCouponsController);
router.post("/", adminMiddleware, createCouponController);
router.put("/:id", adminMiddleware, updateCouponController);
router.delete("/:id", adminMiddleware, deleteCouponController);

export default router;
