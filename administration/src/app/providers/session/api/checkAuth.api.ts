import type { IUser } from "@/entities/user";
import type { AxiosResponse } from "axios";
import axios from "axios";

export async function checkAuth(): Promise<
  AxiosResponse<{ access: string; user: IUser }>
> {
  return axios.post<{ access: string; user: IUser }>(
    `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
    {},
    { withCredentials: true }
  );
}
