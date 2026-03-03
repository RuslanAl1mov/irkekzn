import $api from "@/api/base";
import type { AxiosResponse } from "axios";

export const logout = (): Promise<AxiosResponse<void>> => {
  return $api.post<void>("/auth/logout/", {}, { withCredentials: true });
};
