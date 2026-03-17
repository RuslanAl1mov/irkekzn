import qs from "qs";
import $api from "@/api/base";
import type { AxiosRequestConfig } from "axios";
import type { IShopsListResponse } from "../model/type";

export type ShopsListGetParams = {
  is_main_office?: boolean;
  is_active?: boolean;
  search?: string;
  ordering?: string[];
  page?: number;
};

export const getShops = (
  params: ShopsListGetParams,
  config?: AxiosRequestConfig,
) =>
    $api.get<IShopsListResponse>("/administration/shops/", {
    params,
    paramsSerializer: {
      serialize: (p) => qs.stringify(p, { arrayFormat: "comma" }),
    },
    ...config,
  });
