import type { IProduct } from "@/entities/product";
import type { IShop } from "@/entities/shop";
import type { ISize } from "@/entities/size";

export interface IProductStock {
  id: number;
  product: IProduct;
  size: ISize;
  shop: IShop;
  amount: number;
}

export interface IProductStockPayload {
  product_id: number;
  size_id: number;
  shop_id: number;
  amount: number;
}

export interface IProductStockResponse<T> {
  result: T;
}

export interface IProductStocksListResponse {
  pages: number;
  count: number;
  total_amount: number;
  unique_products: number;
  next: string | null;
  previous: string | null;
  result: IProductStock[];
}
