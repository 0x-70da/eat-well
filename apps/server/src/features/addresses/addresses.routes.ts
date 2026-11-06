import { Router } from "express";
import { getUserAddressesController } from "./controllers/getUserAddresses.controller.js";
import { createDeliveryAddressController } from "./controllers/createDeliveryAddress.controller.js";
import { updateDeliveryAddressController } from "./controllers/updateDeliveryAddress.controller.js";
import { deleteDeliveryAddressController } from "./controllers/deleteDeliveryAddress.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router: Router = Router();

router.use(authMiddleware);

router.get("/", getUserAddressesController);
router.post("/", createDeliveryAddressController);
router.put("/:id", updateDeliveryAddressController);
router.delete("/:id", deleteDeliveryAddressController);

export default router;
