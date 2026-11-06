import { getSettingsQuery } from "../queries/getSettings.query.js";

export const getSettingsService = async () => {
  return await getSettingsQuery();
};
