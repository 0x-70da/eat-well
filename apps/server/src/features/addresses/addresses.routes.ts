import { Router } from "express";
import {
  getUserAddressesController,
  createDeliveryAddressController,
  updateDeliveryAddressController,
  deleteDeliveryAddressController,
} from "./controllers/address.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router: Router = Router();

router.use(authMiddleware);

router.get("/", getUserAddressesController);
router.post("/", createDeliveryAddressController);
router.put("/:id", updateDeliveryAddressController);
router.delete("/:id", deleteDeliveryAddressController);

export default router;
