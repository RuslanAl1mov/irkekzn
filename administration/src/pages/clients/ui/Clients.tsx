import cls from "./Clients.module.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

import { useFiltersStore } from "@/entities/filters";
import { getUsers } from "@/entities/user";
import type { UsersListGetParams, IUser } from "@/entities/user";

import { queryKeys } from "@/shared/lib/react-query/queryKeys";
import { formatDateTime, formatPhoneNumber, toApiDate } from "@/shared/lib/formater";
import { FiltersBlock } from "@/shared/ui/filters-block";
import { VirtualTable } from "@/shared/ui/virtual-table/table";
import { VirtualCell } from "@/shared/ui/virtual-table/cell";
import type { HeaderCell } from "@/shared/ui/virtual-table/table";
import type { RowItem } from "@/shared/ui/virtual-table/row";
import type { ContextMenuItem } from "@/shared/ui/virtual-table/context-menu";

import { useClientEditStore, useClientInfoStore } from "@/features/client";

import { Loader } from "@/widgets/loader";
import { Title } from "@/widgets/title";

import EditIcon from "@/assets/icons/edit.svg?react";
import EyeIcon from "@/assets/icons/eye_open.svg?react";


export const Clients = () => {
    const [ordering, setOrdering] = useState<string[]>([]);
    const openEditModal = useClientEditStore((s) => s.open);
    const openInfoModal = useClientInfoStore((s) => s.open);

    // Глобавльные фильтры
    const searchTerm = useFiltersStore((s) => s.searchTerm);
    const [start_date_after, start_date_before] = useFiltersStore((s) => s.startDateRange);
    const [archivation_date_after, archivation_date_before] = useFiltersStore((s) => s.archivationDateRange);

    // Дебаунс сортировки
    const orderingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
        null
    );
    const debouncedSetOrdering = useCallback(
        (next: string[] | ((prev: string[]) => string[])) => {
            if (orderingDebounceRef.current)
                clearTimeout(orderingDebounceRef.current);
            orderingDebounceRef.current = setTimeout(() => {
                setOrdering((prev) => (typeof next === "function" ? next(prev) : next));
            }, 3);
        },
        []
    );

    // Параметры запроса
    const { params } = useMemo(() => {
        const p: UsersListGetParams = {
            ...(searchTerm?.trim() ? { search: searchTerm.trim() } : {}),
            ...(ordering.length ? { ordering } : {}),
            ...(start_date_after ? { date_joined_after: toApiDate(start_date_after) } : {}),
            ...(start_date_before ? { date_joined_before: toApiDate(start_date_before) } : {}),
            ...(archivation_date_after ? { date_archived_after: toApiDate(archivation_date_after) } : {}),
            ...(archivation_date_before ? { date_archived_before: toApiDate(archivation_date_before) } : {}),
            ...({ is_staff: false }),

        };
        return { params: p };
    }, [
        ordering,
        searchTerm,
        start_date_after,
        start_date_before,
        archivation_date_after,
        archivation_date_before,
    ]);

    // запрос с пагинацией
    const {
        data: clients,
        hasNextPage,
        isLoading,
        isError,
        error,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: queryKeys.users(params),
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const page = typeof pageParam === "number" ? pageParam : 1;
            const res = await getUsers({ ...params, page });
            return res.data;
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage?.next) return undefined;
            return allPages.length + 1;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    // обработка ошибок
    useEffect(() => {
        if (isError) {
            const err = error as AxiosError<{ error: string }>;
            toast.error(err.message, { toastId: err.message });
        }
    }, [isError, error]);


    // Получаем общее количество пользователей
    const totalUsers = clients?.pages?.[0]?.count || 0;
    const totalActiveUsers = clients?.pages?.[0]?.active || 0;

    // Плоский список клиентов
    const flatList = useMemo<IUser[]>(() => {
        if (!clients?.pages) return [];
        return clients.pages.flatMap((page) => page.result ?? []);
    }, [clients]);


    // Заголовки таблицы
    const headers = useMemo<HeaderCell[]>(
        () => [
            {
                name: "",
                width: "50px",
                ordering: "is_active",
            },
            {
                name: "Имя",
                width: "1fr",
                ordering: "first_name",
                align: "left",
            },
            {
                name: "Email",
                width: "0.5fr",
                ordering: "email",
            },
            {
                name: "Номер телефона",
                width: "0.5fr",
                ordering: "phone_number",
                align: "center",
            },

            {
                name: "Логин",
                width: "0.5fr",
                ordering: "last_login",
                align: "center",
            },
            {
                name: "Регистрация",
                width: "0.5fr",
                ordering: "date_joined",
                align: "center",
            },

        ],
        []
    );

    // Данные таблицы
    const rows = useMemo(() => {
        const list = flatList ?? [];

        return list.map((client: IUser) => {
            const rowActions: ContextMenuItem[] = [

                {
                    title: "Открыть",
                    icon: EyeIcon,
                    onClick: () => openInfoModal(client),
                },
                {
                    title: "Редактировать",
                    icon: EditIcon,
                    onClick: () => openEditModal(client),
                },

            ];
            const row = {
                props: {
                    objName: "User",
                    obj: client,
                    keys: { clients: [client] },
                    actions: rowActions,
                },
                data: [
                    <VirtualCell
                        status={client.is_active ? "active" : "archived"}
                        align="center"
                    />,
                    <VirtualCell
                        title={`${client.first_name} ${client.last_name}`}
                        secTitle={`ID: ${client.id}`}
                        isCopible
                    />,
                    <VirtualCell
                        title={client.email}
                        isCopible
                    />,
                    <VirtualCell
                        title={formatPhoneNumber(client.phone_number)}
                        isCopible
                        align="center"
                    />,
                    <VirtualCell
                        title={formatDateTime(client.last_login)}
                        align="center"
                    />,
                    <VirtualCell
                        title={formatDateTime(client.date_joined)}
                        align="center"
                    />,
                ],
            } satisfies RowItem;
            return row;
        });
    }, [
        flatList,
        openEditModal,
        openInfoModal,
    ]);

    return (
        <section className={cls.section}>
            <Title
                title="Управление клиентами"
                subTitle="Управляйте отношениями с клиентами и персональной информацией"
            />

            <div className={cls.content}>

                <FiltersBlock filtersObject="client" leftBlockChildren={(
                    <div className={cls.summaryBlock}>
                        <p className={cls.summaryText}>Всего: {totalUsers}</p>
                        <p className={cls.summaryText}>|</p>
                        <p className={cls.summaryText}>Активных: {totalActiveUsers}</p>
                        <p className={cls.summaryText}>|</p>
                        <p className={cls.summaryText}>Заблокированных: {totalUsers - totalActiveUsers}</p>
                    </div>
                )} />

                {isLoading ? (
                    <div className={cls.loaderErrorBlock}>
                        <Loader size={30} strokeWidth={6} />
                    </div>

                ) : (
                    <div className={cls.tableBlock}>
                        <VirtualTable
                            headers={headers}
                            data={rows}
                            ordering={ordering}
                            setOrdering={debouncedSetOrdering}
                            row_height={75}
                            isError={isError}
                            error={error}
                            isLoading={isFetchingNextPage}
                            onEndReached={() => {
                                if (hasNextPage && !isFetchingNextPage) {
                                    fetchNextPage();
                                }
                            }}
                        />
                    </div>
                )}
            </div>

        </section>
    );
}
