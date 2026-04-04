import qs from "qs";
import $api from "@/api/base";
import type { AxiosRequestConfig } from "axios";
import type { IProductsListResponse } from "../model/type";
import type { IProductCard } from "@/entities/product-card";

export type ProductsListGetParams = {
  search?: string;
  ordering?: string[];
  page?: number;
  product_card?: IProductCard[];
  is_active?: boolean;
};

function paramsToQuery(
  p: ProductsListGetParams,
): Record<string, unknown> {
  const { product_card, ...rest } = p;
  return {
    ...rest,
    ...(product_card?.length ? { product_card: product_card.map((x) => x.id) } : {}),
  };
}

export const getProducts = (
  params: ProductsListGetParams,
  config?: AxiosRequestConfig,
) =>
  $api.get<IProductsListResponse>("/administration/products/", {
    params: paramsToQuery(params),
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "comma" }),
    ...config,
  });
