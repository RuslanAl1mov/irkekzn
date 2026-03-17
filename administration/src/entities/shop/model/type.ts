export interface IShop {
  id: number;
  name: string;
  email: string;
  phone_first: string;
  phone_second: string;
  phone_third: string;
  telegram_link: string;
  telegram_name: string;
  vk_link: string;
  vk_name: string;
  instagram_link: string;
  instagram_name: string;
  city: string;
  address: string;
  map_location: string;
  is_main_office: boolean;
  is_active: boolean;
}

export interface IShopResponse<T> {
  result: T;
}

export interface IShopPayload {
  name: string;
  email?: string;
  phone_first: string;
  phone_second?: string;
  phone_third?: string;
  telegram_link?: string;
  telegram_name?: string;
  vk_link?: string;
  vk_name?: string;
  instagram_link?: string;
  instagram_name?: string;
  city: string;
  address: string;
  map_location?: string;
  is_main_office: boolean;
  is_active: boolean;
}

export interface IShopsListResponse {
  pages: number;
  count: number;
  active: number;
  next: string | null;
  previous: string | null;
  result: IShop[];
}
