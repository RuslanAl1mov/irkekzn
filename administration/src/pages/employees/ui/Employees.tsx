import cls from "./Employees.module.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsers } from "@/entities/user/api/getUsers.api";

import type { IUser } from "@/entities/user";
import type { HeaderCell } from "@/shared/ui/virtual-table/table";
import type { RowItem } from "@/shared/ui/virtual-table/row";
import type { ContextMenuItem } from "@/shared/ui/virtual-table/context-menu";

import { formatDateTime, formatPhoneNumber, formatDate } from "@/shared/lib/formater";
import { VirtualTable } from "@/shared/ui/virtual-table/table";
import { VirtualCell } from "@/shared/ui/virtual-table/cell";

import ClientIcon from "@/assets/icons/users.svg?react";
import { Loader } from "@/widgets/loader";



export const Employees = () => {
    const [ordering, setOrdering] = useState<string[]>([]);
    const navigate = useNavigate();

    // параметры запроса
    const { params } = useMemo(() => {
        const p = {
            ...(ordering.length ? { ordering } : {}),
            ...({ is_staff: true }),
        };
        return { params: p };
    }, [
        ordering
    ]);

    // запрос с пагинацией
    const {
        data: employees,
        isLoading,
        hasNextPage,
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
    const totalUsers = employees?.pages?.[0]?.count || 0;
    const totalActiveUsers = employees?.pages?.[0]?.active || 0;


    // Плоский список клиентов
    const flatList = useMemo<IUser[]>(() => {
        if (!employees?.pages) return [];
        return employees.pages.flatMap((page) => page.result ?? []);
    }, [employees]);


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

        return list.map((employee: IUser) => {
            const rowActions: ContextMenuItem[] = [

                {
                    title: "Открыть",
                    icon: ClientIcon,
                    onClick: () => navigate(`/employee/${employee.id}`),
                },

            ];
            const row = {
                props: {
                    objName: "User",
                    obj: employee,
                    keys: { employees: [employee] },
                    actions: rowActions,
                },
                data: [
                    <VirtualCell
                        status={employee.is_active ? "active" : "archived"}
                        align="center"
                    />,
                    <VirtualCell
                        title={`${employee.first_name} ${employee.last_name}`}
                        secTitle={`ID: ${employee.id}`}
                        isCopible
                    />,
                    <VirtualCell
                        title={employee.email}
                        isCopible
                    />,
                    <VirtualCell
                        title={formatPhoneNumber(employee.phone_number)}
                        isCopible
                        align="center"
                    />,
                    <VirtualCell
                        title={formatDate(employee.last_login)}
                        align="center"
                    />,
                    <VirtualCell
                        title={formatDateTime(employee.date_joined)}
                        // secTitle={formatDateTime(employee.date_joined)}
                        align="center"
                    />,
                ],
            } satisfies RowItem;
            return row;
        });
    }, [
        flatList
    ]);

    return (
        <section className={cls.section}>
            <div className={cls.titleBlock}>
                <h1 className={cls.title}>
                    Управление сотрудниками
                </h1>
                <p className={cls.subTitle}>
                    Управляйте командой и активностью сотрудников
                </p>
            </div>


            {isLoading && (
                <div className={cls.loaderErrorBlock}>
                    <Loader size={30} strokeWidth={6}/>
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
