import qs from "qs";
import $api from "@/api/base";
import type { AxiosRequestConfig } from "axios";
import type { IProductCategoriesListResponse } from "../model/type";


export type ProductCategoriesListGetParams = {
  search?: string;
  ordering?: string[];
  page?: number;
};

export const getProductCategories = (
  params: ProductCategoriesListGetParams,
  config?: AxiosRequestConfig,
) =>
  $api.get<IProductCategoriesListResponse>("/administration/product-categories/", {
    params,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "comma" }),
    ...config,
  });
