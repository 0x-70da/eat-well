import { Router } from "express";
import { getSettingsController } from "./controllers/getSettings.controller.js";
import { updateSettingsController } from "./controllers/updateSettings.controller.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router: Router = Router();

router.get("/", getSettingsController);
router.put("/", requirePermission("settings", "update"), updateSettingsController);

export default router;
