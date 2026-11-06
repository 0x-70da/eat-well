import { Router } from "express";
import { getCategoriesController } from "./controllers/getCategories.controller.js";
import { getCategoryByIdController } from "./controllers/getCategoryById.controller.js";
import { createCategoryController } from "./controllers/createCategory.controller.js";
import { updateCategoryController } from "./controllers/updateCategory.controller.js";
import { deleteCategoryController } from "./controllers/deleteCategory.controller.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router: Router = Router();

router.get("/", getCategoriesController);
router.get("/:id", getCategoryByIdController);
router.post("/", adminMiddleware, createCategoryController);
router.put("/:id", adminMiddleware, updateCategoryController);
router.delete("/:id", adminMiddleware, deleteCategoryController);

export default router;
