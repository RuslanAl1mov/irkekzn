import { API_DOMAIN, customGet } from "./http";
import { toast } from "react-toastify";

/** Базовый тип ответа от API */
export interface ApiResponse<T = any> {
  result?: T;
  detail?: string;
  [key: string]: any;
}

/* ----------------------------- DASHBOARD ----------------------------- */

export interface DashboardParams {
  dateAfter?: string;
  dateBefore?: string;
}

export async function getDashboardInfo({
  dateAfter = "",
  dateBefore = "",
}: DashboardParams = {}): Promise<ApiResponse | false> {
  try {
    const params = new URLSearchParams();
    if (dateAfter) params.append("date_after", dateAfter);
    if (dateBefore) params.append("date_before", dateBefore);

    const url =
      params.toString().length > 0
        ? `${API_DOMAIN}/administration/dashboard/?${params.toString()}`
        : `${API_DOMAIN}/administration/dashboard/`;

    const response = await customGet(url);
    const data: ApiResponse = await response.json();

    if (response.ok) {
      if (!data.result) {
        toast.warn("Невозможно обработать информацию для дашборда!");
        console.error("Ошибка: отсутствуют ожидаемые поля в ответе", data);
        return false;
      }
      return data;
    }

    toast.warn(
      response.status === 401 || response.status === 403
        ? "Недостаточно прав!"
        : "Что-то пошло не так..."
    );
    console.error(`Ошибка ${response.status}:`, data);
    return false;
  } catch (error) {
    console.error("Ошибка при запросе данных дашборда:", error);
    toast.error("Что-то пошло не так...");
    return false;
  }
}
