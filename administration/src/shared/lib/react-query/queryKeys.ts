import type { ColorsListGetParams } from "@/entities/color";
import type { ShopsListGetParams } from "@/entities/shop";
import type { UsersListGetParams } from "@/entities/user";
import type { UserGroupsListGetParams } from "@/entities/user-group/api/getUserGroups.api";
import type { UserPermissionsListGetParams } from "@/entities/user-permission/api/getUserPermissions.api";

export const queryKeys = {
  checkAuth: () => ["auth", "me"] as const,
  userLists: () => ["users", "list"] as const,
  users: (params?: UsersListGetParams | null) =>
    ["users", "list", params ?? null] as const,
  userDetail: (id: number | null) => ["users", "detail", id] as const,
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
};
