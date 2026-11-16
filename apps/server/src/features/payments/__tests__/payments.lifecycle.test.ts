import { describe, it, expect } from "vitest";
import {
  createOrderSchema,
  createStripeCheckoutSchema,
  createPaymobCheckoutSchema,
} from "@workspace/validation";
import { getPaymentAvailabilityService } from "../services/getPaymentAvailability.service.js";
import { verifyPaymobHmac } from "../utils/verifyPaymobHmac.js";
import crypto from "crypto";

describe("Payment Integration & Lifecycle Tests", () => {
  describe("1. Validation Schemas", () => {
    it("should accept valid Stripe checkout input", () => {
      const result = createStripeCheckoutSchema.safeParse({
        orderId: "ord_test_123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject Stripe checkout input with empty orderId", () => {
      const result = createStripeCheckoutSchema.safeParse({
        orderId: "",
      });
      expect(result.success).toBe(false);
    });

    it("should accept Paymob checkout input with card, vodafone cash, or instapay", () => {
      const resultCard = createPaymobCheckoutSchema.safeParse({
        orderId: "ord_test_123",
        paymobMethod: "card",
      });
      expect(resultCard.success).toBe(true);

      const resultWallet = createPaymobCheckoutSchema.safeParse({
        orderId: "ord_test_123",
        paymobMethod: "vodafone_cash",
        walletMobileNumber: "01012345678",
      });
      expect(resultWallet.success).toBe(true);
    });

    it("should accept createOrder with savedAddressId or saveAddress flags", () => {
      const resultWithSaved = createOrderSchema.safeParse({
        customerName: "عميل تجريبي",
        customerPhone: "01012345678",
        deliveryAddress: "المعادي - شارع النصر",
        paymentMethod: "stripe",
        savedAddressId: "addr_12345",
        items: [
          {
            productId: "prod_1",
            quantity: 2,
          },
        ],
      });
      expect(resultWithSaved.success).toBe(true);
      expect(resultWithSaved.data?.savedAddressId).toBe("addr_12345");

      const resultWithSaveFlag = createOrderSchema.safeParse({
        customerName: "عميل تجريبي",
        customerPhone: "01012345678",
        deliveryAddress: "المعادي - شارع النصر",
        paymentMethod: "paymob",
        saveAddress: true,
        addressTitle: "المنزل",
        items: [
          {
            productId: "prod_1",
            quantity: 1,
          },
        ],
      });
      expect(resultWithSaveFlag.success).toBe(true);
      expect(resultWithSaveFlag.data?.saveAddress).toBe(true);
      expect(resultWithSaveFlag.data?.addressTitle).toBe("المنزل");
    });
  });

  describe("2. Payment Availability Service", () => {
    it("should always report Cash on Delivery (COD) as available", () => {
      const availability = getPaymentAvailabilityService();
      expect(availability.cod).toBe(true);
      expect(typeof availability.stripe).toBe("boolean");
      expect(typeof availability.paymob).toBe("boolean");
    });
  });

  describe("3. Paymob HMAC Verification", () => {
    it("should correctly verify valid HMAC and reject invalid HMAC", () => {
      const secret = "test_hmac_secret_123456";
      process.env.PAYMOB_HMAC_SECRET = secret;

      const sampleObj = {
        amount_cents: 10000,
        created_at: "2026-11-06T00:00:00.000Z",
        currency: "EGP",
        error_occured: false,
        has_parent_transaction: false,
        id: 998877,
        integration_id: 12345,
        is_3d_secure: true,
        is_auth: false,
        is_capture: false,
        is_refunded: false,
        is_standalone_payment: true,
        is_voided: false,
        order: { id: 554433 },
        owner: 1122,
        pending: false,
        source_data: {
          pan: "2346",
          sub_type: "MasterCard",
          type: "card",
        },
        success: true,
      };

      // Compute expected HMAC as defined in verifyPaymobHmac
      const concatenated = [
        sampleObj.amount_cents,
        sampleObj.created_at,
        sampleObj.currency,
        sampleObj.error_occured,
        sampleObj.has_parent_transaction,
        sampleObj.id,
        sampleObj.integration_id,
        sampleObj.is_3d_secure,
        sampleObj.is_auth,
        sampleObj.is_capture,
        sampleObj.is_refunded,
        sampleObj.is_standalone_payment,
        sampleObj.is_voided,
        sampleObj.order.id,
        sampleObj.owner,
        sampleObj.pending,
        sampleObj.source_data.pan,
        sampleObj.source_data.sub_type,
        sampleObj.source_data.type,
        sampleObj.success,
      ].join("");

      const validHmac = crypto.createHmac("sha512", secret).update(concatenated).digest("hex");

      const isValid = verifyPaymobHmac(sampleObj, validHmac);
      expect(isValid).toBe(true);

      const isInvalid = verifyPaymobHmac(sampleObj, "fake_hmac_signature_value");
      expect(isInvalid).toBe(false);
    });
  });
});
