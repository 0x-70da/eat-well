import { getDashboardStatsQuery } from "../queries/analytics.query.js";

export const getDashboardStatsService = async () => {
  return await getDashboardStatsQuery();
};
