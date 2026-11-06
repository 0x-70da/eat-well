import type { Request, Response } from "express";
import { success } from "../../../lib/response.js";
import { seedDatabaseService } from "../services/seedDatabase.service.js";

export const seedDatabaseController = async (_req: Request, res: Response) => {
  const result = await seedDatabaseService();
  return success(res, result.message, result);
};
