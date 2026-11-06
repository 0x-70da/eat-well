import { Router } from "express";
import { getProductReviewsController } from "./controllers/getProductReviews.controller.js";
import { createProductReviewController } from "./controllers/createProductReview.controller.js";

const router: Router = Router();

router.get("/product/:productId", getProductReviewsController);
router.post("/", createProductReviewController);

export default router;
