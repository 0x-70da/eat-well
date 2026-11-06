import "dotenv/config";
import app from "./app.js";
import { expireOverduePaymentsService } from "./features/payments/services/expireOverduePayments.service.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// Periodic background worker to expire overdue unpaid payment sessions (every 2 minutes)
const EXPIRATION_INTERVAL_MS = 2 * 60 * 1000;
setInterval(async () => {
  try {
    const res = await expireOverduePaymentsService();
    if (res.expiredCount > 0) {
      console.log(
        `[Expiration Worker] Automatically expired ${res.expiredCount} overdue payment sessions:`,
        res.expiredOrders,
      );
    }
  } catch (err) {
    console.error("[Expiration Worker Error]", err);
  }
}, EXPIRATION_INTERVAL_MS);
