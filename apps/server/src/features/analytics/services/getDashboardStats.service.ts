import { getDashboardStatsQuery } from "../queries/getDashboardStats.query.js";

export const getDashboardStatsService = async () => {
  return await getDashboardStatsQuery();
};
