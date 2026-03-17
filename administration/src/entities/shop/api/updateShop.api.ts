import type { AxiosRequestConfig } from "axios";

import $api from "@/api/base";
import type { IShop, IShopPayload, IShopResponse } from "@/entities/shop";

export const updateShop = async (
  id: number,
  payload: IShopPayload,
  config?: AxiosRequestConfig,
): Promise<IShop> => {
  const { data } = await $api.patch<IShopResponse<IShop>>(
    `/administration/shops/${id}/update/`,
    payload,
    config,
  );

  return data.result;
};
