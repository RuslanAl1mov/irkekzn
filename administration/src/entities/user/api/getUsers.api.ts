import qs from "qs";
import $api from "@/api/base";
import type { AxiosRequestConfig } from "axios";
import type { IUsersListResponse } from "../model/type";

export type ClientsListGetParams = {
  date_joined_after?: string;
  date_joined_before?: string;
  last_login_after?: string;
  last_login_before?: string;

  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;

  search?: string;
  ordering?: string[];
  page?: number;
};

export const getUsers = (
  params: ClientsListGetParams,
  config?: AxiosRequestConfig,
) =>
  $api.get<IUsersListResponse>("/administration/users/", {
    params,
    paramsSerializer: {
      serialize: (p) => qs.stringify(p, { arrayFormat: "comma" }),
    },
    ...config,
  });
