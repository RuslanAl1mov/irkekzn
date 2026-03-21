import type { AxiosRequestConfig } from "axios";

import $api from "@/api/base";
import type { ISize, ISizePayload, ISizeResponse } from "@/entities/size";

export const createSize = async (
  payload: ISizePayload,
  config?: AxiosRequestConfig,
): Promise<ISize> => {
  const { data } = await $api.post<ISizeResponse<ISize>>(
    "/administration/sizes/create/",
    payload,
    config,
  );

  return data.result;
};
