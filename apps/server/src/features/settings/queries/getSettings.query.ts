import { db } from "../../../db/index.js";
import { restaurantSettings } from "../../../db/schema.js";
import { nullToUndefined } from "../../../lib/nullToUndefined.js";

export const getSettingsQuery = async () => {
  const [row] = await db.select().from(restaurantSettings).limit(1);
  if (!row) {
    // Create default settings if not exists
    const [inserted] = await db
      .insert(restaurantSettings)
      .values({
        id: "default",
        restaurantName: "Eat Well Restaurant",
        restaurantNameAr: "مطعم إيت ويل",
        slogan: "Authentic Oriental Cuisine & Grills",
        sloganAr: "أشهى المأكولات والمشاوي الشرقية بأعلى معايير الجودة",
        phone: "+20 100 000 0000",
        addressAr: "شارع النصر، المعادي، القاهرة، مصر",
        deliveryFee: "30.00",
        minOrderAmount: "100.00",
      })
      .returning();
    return inserted ? nullToUndefined(inserted) : undefined;
  }
  return nullToUndefined(row);
};
