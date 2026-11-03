import { Router } from "express";
import {
  getCustomersController,
  getCustomerByIdController,
} from "./controllers/customer.controller.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router: Router = Router();

router.get("/", adminMiddleware, getCustomersController);
router.get("/:id", adminMiddleware, getCustomerByIdController);

export default router;
