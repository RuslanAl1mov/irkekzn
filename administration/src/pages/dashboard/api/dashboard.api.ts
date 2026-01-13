import type { IDashboard } from "../model/types";
import $api from "@/api/base";

export const getDashboard = async (): Promise<IDashboard> => {
  const { data } = await $api.get<IDashboard>(`${import.meta.env.VITE_API_URL}/administration/dashboard/`);
  return data;
};
