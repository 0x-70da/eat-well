import { get } from "@/lib/api";
import type { RestaurantSettings } from "@workspace/types";

export const getSettings = async (): Promise<RestaurantSettings> => {
  const res = await get<RestaurantSettings>("/settings", {
    next: { revalidate: 3600 },
  });
  return (
    res.data || {
      id: "default",
      restaurantName: "Eat Well Restaurant",
      restaurantNameAr: "مطعم إيت ويل",
      sloganAr: "أشهى المأكولات والمشاوي على الفحم بأعلى معايير الجودة",
      phone: "+20 100 000 0000",
      addressAr: "شارع النصر، المعادي، القاهرة، مصر",
      openingHour: "11:00 AM",
      closingHour: "02:00 AM",
      isDeliveryOpen: true,
      deliveryFee: "30.00",
      minOrderAmount: "100.00",
      estimatedPrepTimeMinutes: 25,
      currency: "ج.م",
      currencyCode: "EGP",
      taxRate: "14.00",
      updatedAt: new Date().toISOString(),
    }
  );
};
