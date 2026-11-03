import { z } from "zod";

// Base validation exports will be added here
export const basePaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type BasePaginationInput = z.infer<typeof basePaginationSchema>;
