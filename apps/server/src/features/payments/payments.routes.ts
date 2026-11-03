import { Router } from "express";
import {
  createPaymentIntentController,
  verifyPaymentController,
  stripeWebhookController,
  paymobWebhookController,
  paymobCallbackController,
} from "./controllers/payment.controller.js";

const router: Router = Router();

router.post("/create-intent", createPaymentIntentController);
router.post("/verify", verifyPaymentController);
router.post("/stripe/webhook", stripeWebhookController);
router.post("/paymob/webhook", paymobWebhookController);
router.get("/paymob/callback", paymobCallbackController);

export default router;
