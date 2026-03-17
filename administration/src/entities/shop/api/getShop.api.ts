import $api from "@/api/base";
import type { IShop, IShopResponse } from "@/entities/shop";

export const getShop = async (id: number): Promise<IShop> => {
  const { data } = await $api.get<IShopResponse<IShop>>(
    `/administration/shops/${id}/`
  );

  return data.result;
};
