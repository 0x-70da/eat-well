import { updateSettingsQuery } from "../queries/updateSettings.query.js";
import type { UpdateSettingsInput } from "@workspace/validation";

export const updateSettingsService = async (data: UpdateSettingsInput) => {
  return await updateSettingsQuery(data);
};
