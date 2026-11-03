import { Router } from "express";
import {
  getProductReviewsController,
  createProductReviewController,
} from "./controllers/review.controller.js";

const router: Router = Router();

router.get("/product/:productId", getProductReviewsController);
router.post("/", createProductReviewController);

export default router;
