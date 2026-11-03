import { Router } from "express";
import { seedDatabaseController } from "./seed.controller.js";

const router: Router = Router();

router.post("/", seedDatabaseController);
router.get("/", seedDatabaseController); // Allow GET in development for easy browser setup

export default router;
