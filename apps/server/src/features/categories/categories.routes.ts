import { Router } from "express";
import {
  getCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "./controllers/category.controller.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router: Router = Router();

router.get("/", getCategoriesController);
router.get("/:id", getCategoryByIdController);
router.post("/", adminMiddleware, createCategoryController);
router.put("/:id", adminMiddleware, updateCategoryController);
router.delete("/:id", adminMiddleware, deleteCategoryController);

export default router;
