import { Router } from "express";

const router: Router = Router();

// Feature routes will be mounted here dynamically
// e.g. router.use("/products", (await import("./features/products/products.routes.js")).default);

export default router;
