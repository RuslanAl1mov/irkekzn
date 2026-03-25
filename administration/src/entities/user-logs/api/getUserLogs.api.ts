import $api from "@/api/base";
import type { AxiosRequestConfig } from "axios";
import type { IUserLogsListResponse } from "../model/type";

export type UserLogsListGetParams = {
  page?: number;
  page_size?: number;
};

export const getUserLogsList = (
  user_id: number,
  params?: UserLogsListGetParams,
  config?: AxiosRequestConfig,
) =>
  $api.get<IUserLogsListResponse>(`/administration/users/logs/${user_id}/`, {
    params,
    ...config,
  });
