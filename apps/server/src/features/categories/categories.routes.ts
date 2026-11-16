import { Router } from "express";
import { getCategoriesController } from "./controllers/getCategories.controller.js";
import { getCategoryByIdController } from "./controllers/getCategoryById.controller.js";
import { createCategoryController } from "./controllers/createCategory.controller.js";
import { updateCategoryController } from "./controllers/updateCategory.controller.js";
import { deleteCategoryController } from "./controllers/deleteCategory.controller.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router: Router = Router();

router.get("/", getCategoriesController);
router.get("/:id", getCategoryByIdController);
router.post("/", requirePermission("categories", "create"), createCategoryController);
router.put("/:id", requirePermission("categories", "update"), updateCategoryController);
router.delete("/:id", requirePermission("categories", "delete"), deleteCategoryController);

export default router;
