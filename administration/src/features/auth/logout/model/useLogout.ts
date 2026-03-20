import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { useAuthStore } from "@/entities/user";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";
import { logout } from "../api/logout.api";

export function useLogout({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
} = {}) {
  const { reset } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      reset();
      queryClient.removeQueries({ queryKey: queryKeys.checkAuth() });
      onSuccess?.();
    },
    onError: (error: AxiosError) => {
      onError?.(error);
    },
  });
}