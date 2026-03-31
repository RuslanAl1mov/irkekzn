import $api from "@/api/base";
import type { IUserResponse, IUser } from "@/entities/user";

export const getMe = async (): Promise<IUser> => {
  const { data } = await $api.get<IUserResponse<IUser>>("/auth/me/");
  return data.result;
};
