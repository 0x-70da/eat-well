import { Router } from "express";
import {
  getProductsController,
  getFeaturedProductsController,
  getPopularProductsController,
  getProductByIdOrSlugController,
  createProductController,
  updateProductController,
  deleteProductController,
} from "./controllers/product.controller.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router: Router = Router();

router.get("/", getProductsController);
router.get("/featured", getFeaturedProductsController);
router.get("/popular", getPopularProductsController);
router.get("/:idOrSlug", getProductByIdOrSlugController);
router.post("/", adminMiddleware, createProductController);
router.put("/:id", adminMiddleware, updateProductController);
router.delete("/:id", adminMiddleware, deleteProductController);

export default router;
