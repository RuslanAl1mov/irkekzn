import { useQuery } from "@tanstack/react-query";
import { getMe, useAuthStore } from "@/entities/user";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";

export function useCheckAuth({ enabled }: { enabled: boolean }) {
  const { setIsAuth, setUser } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.checkAuth(),
    queryFn: async () => {
      try {
        const user = await getMe();
        setIsAuth(true);
        setUser(user);
        return user;
      } catch (error) {
        setIsAuth(false);
        setUser(null);
        throw error;
      }
    },
    enabled,
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  });
}
