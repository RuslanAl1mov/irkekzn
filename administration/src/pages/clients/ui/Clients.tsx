import cls from "./Clients.module.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsers } from "@/entities/user/api/getUsers.api";

import type { IUser } from "@/entities/user";
import type { HeaderCell } from "@/shared/ui/virtual-table/table";
import type { RowItem } from "@/shared/ui/virtual-table/row";
import type { ContextMenuItem } from "@/shared/ui/virtual-table/context-menu";

import { formatDateTime, formatPhoneNumber } from "@/shared/lib/formater";
import { VirtualTable } from "@/shared/ui/virtual-table/table";
import { VirtualCell } from "@/shared/ui/virtual-table/cell";

import EyeIcon from "@/assets/icons/eye_open.svg?react";
import EditIcon from "@/assets/icons/edit.svg?react";
import { Loader } from "@/widgets/loader";
import { Title } from "@/widgets/title";
import { useClientEditStore } from "@/features/user-edit";


export const Clients = () => {
    const [ordering, setOrdering] = useState<string[]>([]);
    const navigate = useNavigate();
    const openEditModal = useClientEditStore((s) => s.open);

    // параметры запроса
    const { params } = useMemo(() => {
        const p = {
            ...(ordering.length ? { ordering } : {}),
            ...({ is_staff: false }),
        };
        return { params: p };
    }, [
        ordering
    ]);

    // запрос с пагинацией
    const {
        data: clients,
        hasNextPage,
        isLoading,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["users", params],
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


    // Получаем общее количество пользователей
    const totalUsers = clients?.pages?.[0]?.count || 0;
    const totalActiveUsers = clients?.pages?.[0]?.active || 0;


    // Плоский список клиентов
    const flatList = useMemo<IUser[]>(() => {
        if (!clients?.pages) return [];
        return clients.pages.flatMap((page) => page.result ?? []);
    }, [clients]);


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

    useEffect(
        () => () => {
            if (orderingDebounceRef.current)
                clearTimeout(orderingDebounceRef.current);
        },
        []
    );


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
                    onClick: () => navigate(`/clients/${client.id}`),
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
    ]);

    return (
        <section className={cls.section}>
            <Title
                title="Управление клиентами"
                subTitle="Управляйте отношениями с клиентами и персональной информацией"
            />

            {isLoading && (
                <div className={cls.loaderErrorBlock}>
                    <Loader size={30} strokeWidth={6} />
                </div>
            )}

            {!isLoading && (
                <div className={cls.tableBlock}>
                    <div className={cls.summaryBlock}>
                        <p className={cls.summaryText}>Всего: {totalUsers}</p>
                        <p className={cls.summaryText}>|</p>
                        <p className={cls.summaryText}>Активных: {totalActiveUsers}</p>
                        <p className={cls.summaryText}>|</p>
                        <p className={cls.summaryText}>Заблокированных: {totalUsers - totalActiveUsers}</p>

                    </div>

                    <VirtualTable
                        headers={headers}
                        data={rows}
                        ordering={ordering}
                        setOrdering={debouncedSetOrdering}
                        row_height={70}
                        loading={isFetchingNextPage}
                        onEndReached={() => {
                            if (hasNextPage && !isFetchingNextPage) {
                                fetchNextPage();
                            }
                        }}
                    />
                </div>
            )}

        </section>
    );
}
