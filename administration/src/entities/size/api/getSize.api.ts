import $api from "@/api/base";
import type { ISize, ISizeResponse } from "@/entities/size";

export const getSize = async (id: number): Promise<ISize> => {
  const { data } = await $api.get<ISizeResponse<ISize>>(`/administration/sizes/${id}/`);

  return data.result;
};
