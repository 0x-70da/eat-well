import { Router } from "express";
import { createPaymentIntentController } from "./controllers/createPaymentIntent.controller.js";
import { createStripeCheckoutController } from "./controllers/createStripeCheckout.controller.js";
import { createPaymobCheckoutController } from "./controllers/createPaymobCheckout.controller.js";
import { getPaymentStatusController } from "./controllers/getPaymentStatus.controller.js";
import { getPaymentAvailabilityController } from "./controllers/getPaymentAvailability.controller.js";
import { expireOverduePaymentsController } from "./controllers/expireOverduePayments.controller.js";
import { verifyPaymentController } from "./controllers/verifyPayment.controller.js";
import { paymobWebhookController } from "./controllers/paymobWebhook.controller.js";
import { paymobCallbackController } from "./controllers/paymobCallback.controller.js";

const router: Router = Router();

// Availability & Status
router.get("/availability", getPaymentAvailabilityController);
router.get("/status", getPaymentStatusController);

// Checkout Sessions (Real Integrations)
router.post("/stripe/checkout", createStripeCheckoutController);
router.post("/paymob/checkout", createPaymobCheckoutController);

// Expiration
router.post("/expire-overdue", expireOverduePaymentsController);

// Legacy Intent & Verification (backward-compatibility)
router.post("/create-intent", createPaymentIntentController);
router.post("/verify", verifyPaymentController);

// Paymob Webhook & Callback
router.post("/paymob/webhook", paymobWebhookController);
router.get("/paymob/callback", paymobCallbackController);

export default router;
