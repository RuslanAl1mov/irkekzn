import type { AxiosRequestConfig } from "axios";

import $api from "@/api/base";

export const deleteSize = async (
  id: number,
  config?: AxiosRequestConfig,
): Promise<void> => {
  await $api.delete(`/administration/sizes/${id}/delete/`, config);
};
