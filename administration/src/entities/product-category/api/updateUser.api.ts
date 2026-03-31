import type { AxiosRequestConfig } from "axios";

import $api from "@/api/base";
import type { IUser, IUserPayload, IUserResponse } from "@/entities/user";

export const updateUser = async (
  id: number,
  payload: IUserPayload,
  config?: AxiosRequestConfig,
): Promise<IUser> => {
  const { data } = await $api.patch<IUserResponse<IUser>>(
    `/administration/users/${id}/update/`,
    payload,
    config,
  );

  return data.result;
};
