import { Router } from "express";
import { getProductsController } from "./controllers/getProducts.controller.js";
import { getFeaturedProductsController } from "./controllers/getFeaturedProducts.controller.js";
import { getPopularProductsController } from "./controllers/getPopularProducts.controller.js";
import { getProductByIdOrSlugController } from "./controllers/getProductByIdOrSlug.controller.js";
import { createProductController } from "./controllers/createProduct.controller.js";
import { updateProductController } from "./controllers/updateProduct.controller.js";
import { deleteProductController } from "./controllers/deleteProduct.controller.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router: Router = Router();

router.get("/", getProductsController);
router.get("/featured", getFeaturedProductsController);
router.get("/popular", getPopularProductsController);
router.get("/:idOrSlug", getProductByIdOrSlugController);
router.post("/", requirePermission("products", "create"), createProductController);
router.put("/:id", requirePermission("products", "update"), updateProductController);
router.delete("/:id", requirePermission("products", "delete"), deleteProductController);

export default router;
