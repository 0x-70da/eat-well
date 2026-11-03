import { Router } from "express";
import {
  getSettingsController,
  updateSettingsController,
} from "./controllers/settings.controller.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router: Router = Router();

router.get("/", getSettingsController);
router.put("/", adminMiddleware, updateSettingsController);

export default router;
