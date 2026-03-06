import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { useAuthStore } from "@/entities/user";
import { logout } from "../api/logout.api";

export function useLogout({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
} = {}) {
  const { reset } = useAuthStore();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      reset();
      onSuccess?.();
    },
    onError: (error: AxiosError) => {
      onError?.(error);
    },
  });
}