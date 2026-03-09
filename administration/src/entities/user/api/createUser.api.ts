import type { AxiosRequestConfig } from "axios";

import $api from "@/api/base";
import type { IUser, IUserPayload, IUserResponse } from "@/entities/user";

export const createUser = async (
  payload: IUserPayload,
  config?: AxiosRequestConfig,
): Promise<IUser> => {
  const { data } = await $api.post<IUserResponse<IUser>>(
    `/administration/users/employee/create/`,
    payload,
    config,
  );

  return data.result;
};
