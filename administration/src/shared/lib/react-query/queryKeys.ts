import type { ColorsListGetParams } from "@/entities/color";
import type { SizesListGetParams } from "@/entities/size";
import type { ShopsListGetParams } from "@/entities/shop";
import type { UsersListGetParams } from "@/entities/user";
import type { UserGroupsListGetParams } from "@/entities/user-group";
import type { UserPermissionsListGetParams } from "@/entities/user-permission";
import type { ProductCategoriesListGetParams } from "@/entities/product-category";
import type { ProductsListGetParams } from "@/entities/product";
import type { ProductStocksListGetParams } from "@/entities/product-stock";
import type { ProductCardsListGetParams } from "@/entities/product-card";

export const queryKeys = {
  checkAuth: () => ["auth", "me"] as const,
  settings: () => ["settings"] as const,
  userLists: () => ["users", "list"] as const,
  users: (params?: UsersListGetParams | null) =>
    ["users", "list", params ?? null] as const,
  userDetail: (id: number | null) => ["users", "detail", id] as const,
  userLogs: (userId: number | null) => ["users", "logs", userId] as const,
  userGroups: (params: UserGroupsListGetParams) =>
    ["user-groups", "list", params] as const,
  userPermissions: (params: UserPermissionsListGetParams) =>
    ["user-permissions", "list", params] as const,
  shopLists: () => ["shops", "list"] as const,
  shops: (params?: ShopsListGetParams | null) =>
    ["shops", "list", params ?? null] as const,
  shopDetail: (id: number | null) => ["shops", "detail", id] as const,
  colorLists: () => ["colors", "list"] as const,
  colors: (params?: ColorsListGetParams | null) =>
    ["colors", "list", params ?? null] as const,
  colorDetail: (id: number | null) => ["colors", "detail", id] as const,
  sizeLists: () => ["sizes", "list"] as const,
  sizes: (params?: SizesListGetParams | null) =>
    ["sizes", "list", params ?? null] as const,
  sizeDetail: (id: number | null) => ["sizes", "detail", id] as const,
  productCategories: (params?: ProductCategoriesListGetParams | null) =>
    ["product-categories", "list", params ?? null] as const,
  products: (params?: ProductsListGetParams | null) =>
    ["products", "list", params ?? null] as const,
  productStocks: (params?: ProductStocksListGetParams | null) =>
    ["product-stocks", "list", params ?? null] as const,
  productCards: (params?: ProductCardsListGetParams | null) =>
    ["product-cards", "list", params ?? null] as const,
};
