import { Router } from "express";
import { getSettingsController } from "./controllers/getSettings.controller.js";
import { updateSettingsController } from "./controllers/updateSettings.controller.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router: Router = Router();

router.get("/", getSettingsController);
router.put("/", adminMiddleware, updateSettingsController);

export default router;
