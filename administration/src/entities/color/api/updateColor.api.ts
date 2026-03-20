import type { AxiosRequestConfig } from "axios";

import $api from "@/api/base";

import type { IColor, IColorPayload, IColorResponse } from "../model/type";

export const updateColor = async (
  id: number,
  payload: Partial<IColorPayload>,
  config?: AxiosRequestConfig,
): Promise<IColor> => {
  const { data } = await $api.patch<IColorResponse<IColor>>(
    `/administration/color-palettes/${id}/update/`,
    payload,
    config,
  );

  return data.result;
};
