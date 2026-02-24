import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { useAuthStore } from "@/entities/user";
import { userApi } from "@/entities/user";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";

import { login } from "../api/login.api";

export function useLogin({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
} = {}) {
  const { setIsAuth, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: async () => {
      try {
        const userData = await userApi.getMe();
        setIsAuth(true);
        setUser(userData);
        queryClient.setQueryData(queryKeys.checkAuth(), userData);
        onSuccess?.();
      } catch (error) {
        setIsAuth(false);
        setUser(null);
        onError?.(error as AxiosError);
      }
    },
    onError: (error: AxiosError) => {
      setIsAuth(false);
      setUser(null);
      onError?.(error);
    },
  });
}
