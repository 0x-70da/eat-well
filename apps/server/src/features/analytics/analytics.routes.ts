import { Router } from "express";
import { getDashboardStatsController } from "./controllers/analytics.controller.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router: Router = Router();

router.get("/dashboard", adminMiddleware, getDashboardStatsController);

export default router;
