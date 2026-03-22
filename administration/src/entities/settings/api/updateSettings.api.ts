import type { AxiosRequestConfig } from "axios";

import $api from "@/api/base";
import type {
  ISettings,
  ISettingsPayload,
  ISettingsResponse,
} from "../model/type";

export const updateSettings = async (
  payload: ISettingsPayload,
  config?: AxiosRequestConfig,
): Promise<ISettings> => {
  const { data } = await $api.patch<ISettingsResponse<ISettings>>(
    `/administration/settings/update/`,
    payload,
    config,
  );

  return data.result;
};
