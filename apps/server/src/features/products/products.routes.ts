import { Router } from "express";
import { getProductsController } from "./controllers/getProducts.controller.js";
import { getFeaturedProductsController } from "./controllers/getFeaturedProducts.controller.js";
import { getPopularProductsController } from "./controllers/getPopularProducts.controller.js";
import { getProductByIdOrSlugController } from "./controllers/getProductByIdOrSlug.controller.js";
import { createProductController } from "./controllers/createProduct.controller.js";
import { updateProductController } from "./controllers/updateProduct.controller.js";
import { deleteProductController } from "./controllers/deleteProduct.controller.js";
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
