import type { AxiosRequestConfig } from "axios";

import $api from "@/api/base";
import type { IShop, IShopPayload, IShopResponse } from "@/entities/shop";

export const createShop = async (
  payload: IShopPayload,
  config?: AxiosRequestConfig,
): Promise<IShop> => {
  const { data } = await $api.post<IShopResponse<IShop>>(
    `/administration/shops/create/`,
    payload,
    config,
  );

  return data.result;
};
