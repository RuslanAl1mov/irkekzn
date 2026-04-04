import qs from "qs";
import $api from "@/api/base";
import type { AxiosRequestConfig } from "axios";
import type { IProductCardsListResponse } from "../model/type";

export type ProductCardsListGetParams = {
  search?: string;
  ordering?: string[];
  page?: number;
  page_size?: number;
};

export const getProductCards = (
  params: ProductCardsListGetParams,
  config?: AxiosRequestConfig,
) =>
  $api.get<IProductCardsListResponse>("/administration/product-cards/", {
    params,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "comma" }),
    ...config,
  });
