import $api from "@/api/base";
import type { IColor, IColorResponse } from "@/entities/color";

export const getColor = async (id: number): Promise<IColor> => {
  const { data } = await $api.get<IColorResponse<IColor>>(
    `/administration/color-palettes/${id}/`
  );

  return data.result;
};
