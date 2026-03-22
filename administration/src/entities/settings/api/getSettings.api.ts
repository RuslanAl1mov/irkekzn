import $api from "@/api/base";
import type { ISettings, ISettingsResponse } from "../model/type";

export const getSettings = async (): Promise<ISettings> => {
  const { data } = await $api.get<ISettingsResponse<ISettings>>(
    `/administration/settings/`,
  );

  return data.result;
};
