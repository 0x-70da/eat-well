import { get, put } from "@/lib/api";
import type { RestaurantSettings } from "@workspace/types";
import type { UpdateSettingsInput } from "@workspace/validation";

export const getAdminSettings = async (): Promise<RestaurantSettings> => {
  const res = await get<RestaurantSettings>("/settings", { cache: "no-store" });
  return (
    res.data || {
      id: "default",
      restaurantName: "Eat Well Restaurant",
      restaurantNameAr: "مطعم إيت ويل",
      phone: "+20 100 000 0000",
      addressAr: "شارع النصر، المعادي، القاهرة، مصر",
      openingHour: "11:00 AM",
      closingHour: "01:00 AM",
      isDeliveryOpen: true,
      deliveryFee: "30.00",
      minOrderAmount: "100.00",
      estimatedPrepTimeMinutes: 30,
      currency: "ج.م",
      currencyCode: "EGP",
      taxRate: "14.00",
      updatedAt: new Date().toISOString(),
    }
  );
};

export const updateAdminSettings = async (payload: UpdateSettingsInput) => {
  return await put<RestaurantSettings, UpdateSettingsInput>("/settings", payload);
};
