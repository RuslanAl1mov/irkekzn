import cls from "./Employees.module.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsers } from "@/entities/user/api/getUsers.api";

import { useAuthStore, type IUser } from "@/entities/user";
import type { HeaderCell } from "@/shared/ui/virtual-table/table";
import type { RowItem } from "@/shared/ui/virtual-table/row";
import type { ContextMenuItem } from "@/shared/ui/virtual-table/context-menu";

import { formatDateTime, formatPhoneNumber, formatDate } from "@/shared/lib/formater";
import { VirtualTable } from "@/shared/ui/virtual-table/table";
import { VirtualCell } from "@/shared/ui/virtual-table/cell";

import EyeIcon from "@/assets/icons/eye_open.svg?react";
import EditIcon from "@/assets/icons/edit.svg?react";
import PlusIcon from "@/assets/icons/plus.svg?react";

import { Loader } from "@/widgets/loader";
import { Title } from "@/widgets/title";
import { useEmployeeEditStore } from "@/features/employee-edit";
import { useEmployeeInfoStore } from "@/features/employee-info";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Button } from "@/shared/ui";
import { useEmployeeCreateStore } from "@/features/employee-create/model/store";


export const Employees = () => {
    const [ordering, setOrdering] = useState<string[]>([]);
    const openCreateModal = useEmployeeCreateStore((s) => s.open);
    const openEditModal = useEmployeeEditStore((s) => s.open);
    const openInfoModal = useEmployeeInfoStore((s) => s.open);
    const user = useAuthStore((s) => s.user);

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
        isError,
        error,
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

    // обработка ошибок
    useEffect(() => {
        if (isError) {
            const err = error as AxiosError<{ error: string }>;
            toast.error(err.message, { toastId: err.message });
        }
    }, [isError, error]);


    // Получаем общее количество пользователей
    const totalUsers = employees?.pages?.[0]?.count || 0;
    const totalActiveUsers = employees?.pages?.[0]?.active || 0;


    // Плоский список клиентов
    const flatList = useMemo<IUser[]>(() => {
        if (!employees?.pages) return [];
        return employees.pages.flatMap((page) => page.result ?? []);
    }, [employees]);

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
                name: "Контакты",
                width: "0.5fr",
                ordering: "email",
            },
            {
                name: "Группы",
                width: "0.5fr",
                ordering: "groups__name",
                align: "center",
            },
            {
                name: "Доступы",
                width: "0.5fr",
                ordering: "permission_codes",
                align: "center",
            },
            {
                name: "Логин",
                width: "125px",
                ordering: "last_login",
                align: "center",
            },
            {
                name: "Регистрация",
                width: "135px",
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
                    icon: EyeIcon,
                    onClick: () => openInfoModal(employee),
                },
                ...(employee.id !== user?.id ? [{
                    title: "Редактировать",
                    icon: EditIcon,
                    onClick: () => openEditModal(employee),
                }] : []),
            ];
            const row: RowItem = {
                ...(employee.id === user?.id ? { customRowStyle: { backgroundColor: "var(--gray6)" } } : {}),
                props: {
                    objName: "User",
                    obj: employee,
                    keys: { employees: [employee] },
                    actions: rowActions
                },
                data: [
                    <VirtualCell
                        status={employee.is_active ? "active" : "archived"}
                        align="center"
                    />,
                    <VirtualCell
                        title={`${employee.first_name} ${employee.last_name} ${employee.id === user?.id ? "(Вы)" : ""}`}
                        secTitle={`ID: ${employee.id}`}
                        isCopible
                    />,
                    <VirtualCell
                        title={formatPhoneNumber(employee.phone_number)}
                        secTitle={employee.email}
                        isCopible
                    />,
                    <VirtualCell
                        textColor="var(--gray3)"
                        title={employee.groups?.map((group) => group.name) ?? null}
                        align="center"
                    />,
                    <VirtualCell
                        textColor="var(--gray3)"
                        title={employee.user_permissions?.map(perm => perm.name) ?? null}
                        align="center"
                    />,
                    <VirtualCell
                        title={formatDate(employee.last_login)}
                        align="center"
                    />,
                    <VirtualCell
                        title={formatDateTime(employee.date_joined)}
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

            <div className={cls.titleBlock}>
                <Title
                    title="Управление сотрудниками"
                    subTitle="Управляйте командой и активностью сотрудников"
                />
                <Button onClick={openCreateModal} className={cls.addButton}>
                    <PlusIcon className={cls.addButtonIcon} />
                    <p className={cls.addButtonText}>Добавить сотрудника</p>
                </Button>

            </div>


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
