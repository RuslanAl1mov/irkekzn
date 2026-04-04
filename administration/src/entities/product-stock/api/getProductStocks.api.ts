import qs from "qs";
import $api from "@/api/base";
import type { IProduct } from "@/entities/product";
import type { IProductCategory } from "@/entities/product-category";
import type { IShop } from "@/entities/shop";
import type { ISize } from "@/entities/size";
import type { AxiosRequestConfig } from "axios";
import type { IProductStocksListResponse } from "../model/type";

export type ProductStocksListGetParams = {
  product?: IProduct[];
  category?: IProductCategory[];
  size?: ISize[];
  shop?: IShop[];

  search?: string;
  ordering?: string[];
  page?: number;
};

function paramsToQuery(
  p: ProductStocksListGetParams,
): Record<string, unknown> {
  const { product, category, size, shop, ...rest } = p;
  return {
    ...rest,
    ...(product?.length ? { product: product.map((x) => x.id) } : {}),
    ...(category?.length ? { category: category.map((x) => x.id) } : {}),
    ...(size?.length ? { size: size.map((x) => x.id) } : {}),
    ...(shop?.length ? { shop: shop.map((x) => x.id) } : {}),
  };
}

export const getProductStocks = (
  params: ProductStocksListGetParams,
  config?: AxiosRequestConfig,
) =>
  $api.get<IProductStocksListResponse>("/administration/product-stocks/", {
    params: paramsToQuery(params),
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "comma" }),
    ...config,
  });
