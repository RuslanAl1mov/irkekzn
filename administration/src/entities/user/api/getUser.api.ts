import $api from "@/api/base";
import type { IUser, IUserResponse } from "@/entities/user";

export const getUser = async (id: number): Promise<IUser> => {
  const { data } = await $api.get<IUserResponse<IUser>>(
    `/administration/users/${id}/`
  );

  return data.result;
};
