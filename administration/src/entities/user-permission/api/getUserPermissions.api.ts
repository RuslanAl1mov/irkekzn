import qs from "qs";
import type { AxiosRequestConfig } from "axios";

import $api from "@/api/base";
import type { IUserPermissionsListResponse } from "../model/type";

export type UserPermissionsListGetParams = {
  search?: string;
  ordering?: string[];
};

export const getUserPermissions = (
  params: UserPermissionsListGetParams,
  config?: AxiosRequestConfig,
) =>
  $api.get<IUserPermissionsListResponse>("/administration/users/permissions/", {
    params,
    paramsSerializer: {
      serialize: (p) => qs.stringify(p, { arrayFormat: "comma" }),
    },
    ...config,
  });
