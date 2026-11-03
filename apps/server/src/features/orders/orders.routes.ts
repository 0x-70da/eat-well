import { Router } from "express";
import {
  createOrderController,
  trackOrderByNumberController,
  getMyOrdersController,
  getOrderByIdController,
  getAdminOrdersController,
  updateOrderStatusController,
  updatePaymentStatusController,
} from "./controllers/order.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router: Router = Router();

// Public / Guest routes
router.post("/", createOrderController);
router.get("/track/:orderNumber", trackOrderByNumberController);

// Authenticated customer routes
router.get("/my-orders", authMiddleware, getMyOrdersController);
router.get("/:id", authMiddleware, getOrderByIdController);

// Admin routes
router.get("/admin/all", adminMiddleware, getAdminOrdersController);
router.patch("/:id/status", adminMiddleware, updateOrderStatusController);
router.patch("/:id/payment-status", adminMiddleware, updatePaymentStatusController);

export default router;
