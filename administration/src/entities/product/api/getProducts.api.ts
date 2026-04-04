import qs from "qs";
import $api from "@/api/base";
import type { AxiosRequestConfig } from "axios";
import type { IProductCategory } from "@/entities/product-category";
import type { IProductCard } from "@/entities/product-card";
import type { IProductsListResponse } from "../model/type";

export type ProductsListGetParams = {
  search?: string;
  ordering?: string[];
  page?: number;
  product_card?: IProductCard[];
  category?: IProductCategory[];
  is_active?: boolean;
};

function paramsToQuery(
  p: ProductsListGetParams,
): Record<string, unknown> {
  const { product_card, category, ...rest } = p;
  return {
    ...rest,
    ...(product_card?.length ? { product_card: product_card.map((x) => x.id) } : {}),
    ...(category?.length ? { category: category.map((x) => x.id) } : {}),
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
