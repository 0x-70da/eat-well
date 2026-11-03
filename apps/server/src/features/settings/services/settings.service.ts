import { getSettingsQuery, updateSettingsQuery } from "../queries/settings.query.js";
import type { UpdateSettingsInput } from "@workspace/validation";

export const getSettingsService = async () => {
  return await getSettingsQuery();
};

export const updateSettingsService = async (data: UpdateSettingsInput) => {
  return await updateSettingsQuery(data);
};
