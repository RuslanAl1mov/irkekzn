import qs from "qs";
import $api from "@/api/base";
import type { AxiosRequestConfig } from "axios";
import type { IColorsListResponse } from "../model/type";

export type ColorsListGetParams = {
  search?: string;
  ordering?: string[];
  page?: number;
};

export const getColors = (
  params: ColorsListGetParams,
  config?: AxiosRequestConfig,
) =>
    $api.get<IColorsListResponse>("/administration/color-palettes/", {
    params,
    paramsSerializer: {
      serialize: (p) => qs.stringify(p, { arrayFormat: "comma" }),
    },
    ...config,
  });
