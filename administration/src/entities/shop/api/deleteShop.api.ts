import type { AxiosRequestConfig } from "axios";

import $api from "@/api/base";

export const deleteShop = async (
  id: number,
  config?: AxiosRequestConfig,
): Promise<void> => {
  await $api.delete(`/administration/shops/${id}/delete/`, config);
};
