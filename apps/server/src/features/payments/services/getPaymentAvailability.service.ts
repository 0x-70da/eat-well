import type { PaymentAvailability } from "@workspace/types";

export const getPaymentAvailabilityService = (): PaymentAvailability => {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const stripePublishable =
    process.env.STRIPE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  const paymobKey = process.env.PAYMOB_API_KEY;
  const paymobIntegration = process.env.PAYMOB_CARD_INTEGRATION_ID;
  const paymobIframe = process.env.PAYMOB_IFRAME_ID;

  return {
    cod: true,
    stripe: Boolean(stripeSecret),
    paymob: Boolean(paymobKey && paymobIntegration && paymobIframe),
    publishableKey: {
      stripe: stripePublishable,
    },
  };
};
