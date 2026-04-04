import type { IProductCategory } from "@/entities/product-category";
import type { IUser } from "@/entities/user";

export interface IProductCard {
  id: number;
  categories: IProductCategory[];
  date_created: string;
  creator: IUser;
  is_active: boolean;
}

export interface IProductCardsListResponse {
  pages: number;
  count: number;
  active: number;
  next: string | null;
  previous: string | null;
  result: IProductCard[];
}
