import qs from "qs";
import $api from "@/api/base";
import type { AxiosRequestConfig } from "axios";
import type { IProductsListResponse } from "../model/type";


export type ProductsListGetParams = {
  search?: string;
  ordering?: string[];
  page?: number;
};

export const getProducts = (
  params: ProductsListGetParams,
  config?: AxiosRequestConfig,
) =>
  $api.get<IProductsListResponse>("/administration/products/", {
    params,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "comma" }),
    ...config,
  });
