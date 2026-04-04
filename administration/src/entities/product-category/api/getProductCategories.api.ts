import qs from "qs";
import $api from "@/api/base";
import type { AxiosRequestConfig } from "axios";
import type { IProductCategoriesListResponse, IProductCategory } from "../model/type";

export type ProductCategoriesListGetParams = {
  search?: string;
  ordering?: string[];
  page?: number;
  parent?: IProductCategory[];
  page_size?: number;
  is_active?: boolean;
};

function paramsToQuery(
  p: ProductCategoriesListGetParams,
): Record<string, unknown> {
  const { parent, ...rest } = p;
  return {
    ...rest,
    ...(parent?.length ? { parent: parent.map((x) => x.id) } : {}),
  };
} 

export const getProductCategories = (
  params: ProductCategoriesListGetParams,
  config?: AxiosRequestConfig,
) =>
  $api.get<IProductCategoriesListResponse>("/administration/product-categories/", {
    params: paramsToQuery(params),
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "comma" }),
    ...config,
  });
