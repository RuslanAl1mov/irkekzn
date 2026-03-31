import type { IUser } from "@/entities/user";

export interface IProductCategoryCover {
  id: number;
  image: string;
  creator: IUser;
  is_active: boolean;
  date_created: string;
}

export interface IProductCategory {
  id: number;
  name: string;
  description: string;
  parent: IProductCategory | null;
  date_created: string;
  creator: IUser;
  covers: IProductCategoryCover[];
  product_cards_count: number;
  active_product_cards_count: number;
  products_count: number;
  active_products_count: number;
  is_active: boolean;
}
    
export interface IProductCategoryPayload {
  name?: string;
  description?: string;
  parent_id?: number | null;
  covers_ids?: number[]
  is_active?: boolean;
}

export interface IProductCategoryResponse<T> {
  result: T;
}

export interface IProductCategoriesListResponse {
  pages: number;
  count: number;
  active: number;
  next: string | null;
  previous: string | null;
  result: IProductCategory[];
}
