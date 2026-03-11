import type { UserGroupsListGetParams } from "@/entities/user-group/api/getUserGroups.api";
import type { UserPermissionsListGetParams } from "@/entities/user-permission/api/getUserPermissions.api";

export const queryKeys = {
  checkAuth: () => ["check-auth"] as const,
  userDetail: (id: number) => ["users", id] as const,
  updateUser: () => ["users", "update"] as const,
  userGroups: (params: UserGroupsListGetParams) => ["user-groups", params] as const,
  userPermissions: (params: UserPermissionsListGetParams) =>
    ["user-permissions", params] as const,
};
