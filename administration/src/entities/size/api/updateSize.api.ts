import type { AxiosRequestConfig } from "axios";

import $api from "@/api/base";

import type { ISize, ISizePayload, ISizeResponse } from "../model/type";

export const updateSize = async (
  id: number,
  payload: Partial<ISizePayload>,
  config?: AxiosRequestConfig,
): Promise<ISize> => {
  const { data } = await $api.patch<ISizeResponse<ISize>>(
    `/administration/sizes/${id}/update/`,
    payload,
    config,
  );

  return data.result;
};
