import { API_DOMAIN, customGet } from "./http";
import { toast } from "react-toastify";

/** Базовый тип ответа от API */
export interface ApiResponse<T = any> {
  result?: T;
  detail?: string;
  [key: string]: any;
}

/* ------------------------- СПИСОК КАТЕГОРИЙ ------------------------- */

export interface CategoryListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  select?: string[];
  ordering?: string[];
  date_created_after?: string | null;
  date_created_before?: string | null;
}

export async function getProductCategoryList({
  page = 1,
  pageSize = 20,
  search = "",
  select = [],
  ordering = [],
  date_created_after = null,
  date_created_before = null,
}: CategoryListParams = {}): Promise<ApiResponse | false> {
  try {
    const params = new URLSearchParams();

    if (page) params.append("page", String(page));
    if (pageSize) params.append("page_size", String(pageSize));
    if (search) params.append("search", search);
    if (select.length) params.append("select", select.join(","));
    if (ordering.length) params.append("ordering", ordering.join(","));
    if (date_created_after) params.append("date_created_after", date_created_after);
    if (date_created_before) params.append("date_created_before", date_created_before);

    const url = `${API_DOMAIN}/administration/product-categories/${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await customGet(url);
    const data: ApiResponse = await response.json();

    if (response.ok) {
      if (!data.result) {
        toast.warn("Невозможно обработать список категорий товаров!");
        console.error("Отсутствует поле result:", data);
        return false;
      }
      return data;
    }

    toast.warn(
      response.status === 401 || response.status === 403
        ? "Недостаточно прав!"
        : "Что-то пошло не так..."
    );
    console.error(`Ошибка ${response.status}:`, data);
    return false;
  } catch (err) {
    console.error("Ошибка при запросе списка категорий товаров:", err);
    toast.error("Что-то пошло не так...");
    return false;
  }
}

/* -------------------------- СПИСОК ТЕГОВ ---------------------------- */

export interface TagListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  select?: string[];
  ordering?: string[];
}

export async function getProductTagList({
  page = 1,
  pageSize = 40,
  search = "",
  select = [],
  ordering = ["-id"],
}: TagListParams = {}): Promise<ApiResponse | false> {
  try {
    const params = new URLSearchParams();

    if (page) params.append("page", String(page));
    if (pageSize) params.append("page_size", String(pageSize));
    if (search) params.append("search", search);
    if (select.length) params.append("select", select.join(","));
    if (ordering.length) params.append("ordering", ordering.join(","));

    const url = `${API_DOMAIN}/administration/product-tags/${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await customGet(url);
    const data: ApiResponse = await response.json();

    if (response.ok) {
      if (!data.result) {
        toast.warn("Невозможно обработать список тегов!");
        console.error("Отсутствует поле result:", data);
        return false;
      }
      return data;
    }

    toast.warn(
      response.status === 401 || response.status === 403
        ? "Недостаточно прав!"
        : "Что-то пошло не так..."
    );
    console.error(`Ошибка ${response.status}:`, data);
    return false;
  } catch (err) {
    console.error("Ошибка при запросе списка тегов:", err);
    toast.error("Что-то пошло не так...");
    return false;
  }
}

/* -------------------------- СПИСОК ТОВАРОВ -------------------------- */

export interface ProductListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  select?: string[];
  ordering?: string[];
  date_created_after?: string | null;
  date_created_before?: string | null;
  category?: (number | string)[];
  tags?: (number | string)[];
  price_min?: string | null;
  price_max?: string | null;
}

export async function getProductList({
  page = 1,
  pageSize = 20,
  search = "",
  select = [],
  ordering = [],
  date_created_after = null,
  date_created_before = null,
  category = [],
  tags = [],
  price_min = null,
  price_max = null,
}: ProductListParams = {}): Promise<ApiResponse | false> {
  try {
    const params = new URLSearchParams();

    if (page) params.append("page", String(page));
    if (pageSize) params.append("page_size", String(pageSize));
    if (search) params.append("search", search);
    if (select.length) params.append("select", select.join(","));
    if (category.length) params.append("category", category.join(","));
    if (tags.length) params.append("tag", tags.join(","));
    if (price_min != null) params.append("price_min", price_min.replace(/\s+/g, ""));
    if (price_max != null) params.append("price_max", price_max.replace(/\s+/g, ""));
    if (ordering.length) params.append("ordering", ordering.join(","));
    if (date_created_after) params.append("date_created_after", date_created_after);
    if (date_created_before) params.append("date_created_before", date_created_before);

    const url = `${API_DOMAIN}/administration/products/${params.toString() ? "?" + params.toString() : ""}`;

    const response = await customGet(url);
    const data: ApiResponse = await response.json();

    if (response.ok) {
      if (!data.result) {
        toast.warn("Невозможно обработать список товаров!");
        console.error("Отсутствует поле result:", data);
        return false;
      }
      return data;
    }

    toast.warn(
      response.status === 401 || response.status === 403
        ? "Недостаточно прав!"
        : "Что-то пошло не так..."
    );
    console.error(`Ошибка ${response.status}:`, data);
    return false;
  } catch (err) {
    console.error("Ошибка при запросе списка товаров:", err);
    toast.error("Что-то пошло не так...");
    return false;
  }
}
