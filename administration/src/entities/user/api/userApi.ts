import $api from "@/api/base";
import type { ApiResult, IUser } from "@/entities/user";

export const userApi = {
  getMe: async (): Promise<IUser> => {
    const { data } = await $api.get<ApiResult<IUser>>("/auth/me/");
    return data.result;
  },
};
