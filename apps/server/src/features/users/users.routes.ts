import { Router } from "express";
import { getUsersController } from "./controllers/getUsers.controller.js";
import { updateUserRoleController } from "./controllers/updateUserRole.controller.js";
import { banUserController } from "./controllers/banUser.controller.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router: Router = Router();

router.get("/", requirePermission("users", "list"), getUsersController);
router.put("/:id/role", requirePermission("roles", "assign"), updateUserRoleController);
router.post("/:id/ban", requirePermission("users", "ban"), banUserController);

export default router;
