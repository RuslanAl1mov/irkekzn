export interface ISettings {
  id: number;
  set_custom_product_settings: boolean;
  is_all_colors_same_name: boolean;
  is_all_colors_same_price: boolean;
  is_all_colors_same_description: boolean;
  is_all_colors_same_model: boolean;
  date_updated: string;
}

export interface ISettingsResponse<T> {
  result: T;
}

export interface ISettingsPayload {
  set_custom_product_settings: boolean;
  is_all_colors_same_name: boolean;
  is_all_colors_same_price: boolean;
  is_all_colors_same_description: boolean;
  is_all_colors_same_model: boolean;
}

