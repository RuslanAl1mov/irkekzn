import qs from "qs";
import $api from "@/api/base";
import type { AxiosRequestConfig } from "axios";
import type { IUserGroupsListResponse } from "../model/type";

export type UserGroupsListGetParams = {
  search?: string;
  ordering?: string[];
};

export const getUserGroups = (
  params: UserGroupsListGetParams,
  config?: AxiosRequestConfig,
) =>
  $api.get<IUserGroupsListResponse>("/administration/users/groups/", {
    params,
    paramsSerializer: {
      serialize: (p) => qs.stringify(p, { arrayFormat: "comma" }),
    },
    ...config,
  });
