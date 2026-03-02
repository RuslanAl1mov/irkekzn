import type { IUser } from "@/entities/user";
import type { AxiosResponse } from "axios";
import $api from "@/api/base";

export const login = (
  email: string,
  password: string,
): Promise<AxiosResponse<IUser>> => {
  return $api.post<IUser>("/auth/login/admin/", { email, password });
};
