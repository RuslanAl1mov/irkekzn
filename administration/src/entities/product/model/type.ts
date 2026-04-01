import type { IColor } from "@/entities/color";
import type { IUser } from "@/entities/user";

export interface IProductImage {
  id: number;
  product: IProduct;
  image: string;
  preview: string | null;
  date_created: string;
  creator: IUser;
  is_active: boolean;
}

export interface IProduct {
  id: number;
  product_card: number;
  article: string;
  name: string;
  is_custom_color: boolean;
  color_name: string;
  color: IColor;
  description: string;
  model_params: string;
  material_and_care: string;
  price: number;
  sale_price: number;
  images: IProductImage[];
  date_created: string;
  is_active: boolean;
  creator: IUser;
}

export interface IProductPayload {
  product_card_id?: number;
  article?: string;
  name?: string;
  is_custom_color?: boolean;
  color_name?: string;
  color_id?: number;
  description?: string;
  model_params?: string;
  material_and_care?: string;
  price?: number;
  sale_price?: number;
  is_active?: boolean;
  creator_id?: number;
}

export interface IProductResponse<T> {
  result: T;
}

export interface IProductsListResponse {
  pages: number;
  count: number;
  active: number;
  next: string | null;
  previous: string | null;
  result: IProduct[];
}
