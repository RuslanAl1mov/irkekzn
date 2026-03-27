export interface ISettings {
  id: number;
  set_custom_product_card_settings: boolean;
  is_all_products_same_name: boolean;
  is_all_products_same_price: boolean;
  is_all_products_same_description: boolean;
  is_all_products_same_model: boolean;
  date_updated: string;
}

export interface ISettingsResponse<T> {
  result: T;
}

export interface ISettingsPayload {
  set_custom_product_card_settings: boolean;
  is_all_products_same_name: boolean;
  is_all_products_same_price: boolean;
  is_all_products_same_description: boolean;
  is_all_products_same_model: boolean;
}

