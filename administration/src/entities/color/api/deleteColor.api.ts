import type { AxiosRequestConfig } from "axios";

import $api from "@/api/base";

export const deleteColor = async (
  id: number,
  config?: AxiosRequestConfig,
): Promise<void> => {
  await $api.delete(`/administration/color-palettes/${id}/delete/`, config);
};
