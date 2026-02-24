import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import i18n from "@/shared/config/i18n";
import { parseAxiosValidationError } from "@/shared/lib";

interface RetryConfig extends InternalAxiosRequestConfig {
  _isRetry?: boolean;
}

const $api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

$api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};
  (config.headers as Record<string, string>)["Accept-Language"] = i18n.language;
  return config;
});

$api.interceptors.response.use(
  (config) => config,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
          {},
          {
            withCredentials: true,
            headers: {
              "Accept-Language": i18n.language,
            },
          }
        );
        return $api.request(originalRequest);
      } catch {
        console.warn("Not authorized");
        throw error;
      }
    }

    (
      error as Error & {
        parsedValidation?: ReturnType<typeof parseAxiosValidationError>;
      }
    ).parsedValidation = parseAxiosValidationError(error);
    throw error;
  }
);

export default $api;
