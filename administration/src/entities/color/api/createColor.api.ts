import type { AxiosRequestConfig } from "axios";

import $api from "@/api/base";
import type { IColor, IColorPayload, IColorResponse } from "@/entities/color";

export const createColor = async (
  payload: IColorPayload,
  config?: AxiosRequestConfig,
): Promise<IColor> => {
  const { data } = await $api.post<IColorResponse<IColor>>(
    `/administration/color-palettes/create/`,
    payload,
    config,
  );

  return data.result;
};
