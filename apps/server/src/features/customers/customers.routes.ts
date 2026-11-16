import { Router } from "express";
import { getCustomersController } from "./controllers/getCustomers.controller.js";
import { getCustomerByIdController } from "./controllers/getCustomerById.controller.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router: Router = Router();

router.get("/", requirePermission("customers", "list"), getCustomersController);
router.get("/:id", requirePermission("customers", "view"), getCustomerByIdController);

export default router;
