import { Router } from "express";
import { getUsersController } from "./controllers/getUsers.controller.js";
import { updateUserRoleController } from "./controllers/updateUserRole.controller.js";
import { banUserController } from "./controllers/banUser.controller.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router: Router = Router();

router.get("/", adminMiddleware, getUsersController);
router.put("/:id/role", adminMiddleware, updateUserRoleController);
router.post("/:id/ban", adminMiddleware, banUserController);

export default router;
