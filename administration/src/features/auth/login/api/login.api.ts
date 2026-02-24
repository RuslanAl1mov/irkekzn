import type { IUser } from "@/entities/user";
import type { AxiosResponse } from "axios";
import axios from "axios";

export const login = (
  email: string,
  password: string
): Promise<AxiosResponse<IUser>> => {
  return axios.post<IUser>(
    `${import.meta.env.VITE_API_URL}/administration/auth/login/`,
    { email, password },
    { withCredentials: true }
  );
};
