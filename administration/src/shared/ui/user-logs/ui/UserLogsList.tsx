import cls from "./UserLogsList.module.css";

import { useCallback, useEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

import { getUserLogsList } from "@/entities/user-logs";
import type { IUserLog } from "@/entities/user-logs";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";
import { Loader } from "@/widgets/loader";

import { UserLogsListItem } from "./UserLogsListItem";

type UserLogsListProps = {
  userId: number | null;
};

export const UserLogsList = ({ userId }: UserLogsListProps) => {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.userLogs(userId),
    queryFn: async ({ pageParam }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      const res = await getUserLogsList(userId!, { page });
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.next) return undefined;
      return allPages.length + 1;
    },
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const flatList = useMemo<IUserLog[]>(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.result ?? []);
  }, [data]);

  useEffect(() => {
    if (!isError) return;
    const err = error as AxiosError<{ error?: string; detail?: string }>;
    const message =
      err.response?.data?.error ||
      err.response?.data?.detail ||
      err.message ||
      "Не удалось загрузить журнал действий";
    toast.error(message, { toastId: message });
  }, [isError, error]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const bottom =
        Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 1;
      if (bottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  if (!userId) {
    return (
      <div className={cls.wrapper}>
        <p className={cls.empty}>Войдите в систему, чтобы видеть действия</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cls.wrapper}>
        <div className={cls.loaderBlock}>
          <Loader size={28} strokeWidth={6} />
        </div>
      </div>
    );
  }

  if (!flatList.length) {
    return (
      <div className={cls.wrapper}>
        <p className={cls.empty}>Пока нет записей о действиях</p>
      </div>
    );
  }

  return (
    <div className={cls.wrapper}>
      <div className={cls.list} onScroll={handleScroll}>
        {flatList.map((log) => (
          <UserLogsListItem key={log.id} log={log} />
        ))}
        {isFetchingNextPage && (
          <div className={cls.footerLoader}>
            <Loader size={22} strokeWidth={5} />
          </div>
        )}
      </div>
    </div>
  );
};
