import { Router } from "express";
import { getDashboardStatsController } from "./controllers/getDashboardStats.controller.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router: Router = Router();

router.get("/dashboard", requirePermission("dashboard", "view"), getDashboardStatsController);

export default router;
