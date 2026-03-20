import cls from "./ColorsTab.module.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

import { Title } from "@/widgets/title";
import { Loader } from "@/widgets/loader";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui";
import { VirtualTable } from "@/shared/ui/virtual-table/table/ui/VirtualTable";
import { VirtualCell } from "@/shared/ui/virtual-table/cell";

import PlusIcon from "@/assets/icons/plus.svg?react";
import EditIcon from "@/assets/icons/edit.svg?react";
import TrashBinIcon from "@/assets/icons/trash-bin.svg?react";

import { deleteColor, getColors, updateColor } from "@/entities/color";
import type { ColorsListGetParams, IColor } from "@/entities/color";

import { useColorCreateStore } from "@/features/color";
import { useColorEditStore } from "@/features/color";
import { useConfirmationStore } from "@/widgets/confirmation";

import { queryKeys } from "@/shared/lib/react-query/queryKeys";
import type { HeaderCell } from "@/shared/ui/virtual-table/table/model/types";
import type { ContextMenuItem } from "@/shared/ui/virtual-table/context-menu";
import type { RowItem } from "@/shared/ui/virtual-table/row";


export const ColorsTab = () => {
    const { open: openColorCreateModal } = useColorCreateStore();
    const { open: openColorEditModal } = useColorEditStore();
    const { open: openConfirmation } = useConfirmationStore();

    const [ordering, setOrdering] = useState<string[]>([]);
    const queryClient = useQueryClient();

    // Дебаунс сортировки
    const orderingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const debouncedSetOrdering = useCallback(
        (next: string[] | ((prev: string[]) => string[])) => {
            if (orderingDebounceRef.current) clearTimeout(orderingDebounceRef.current);
            orderingDebounceRef.current = setTimeout(() => {
                setOrdering((prev) => (typeof next === "function" ? next(prev) : next));
            }, 3);
        },
        []
    );

    // Параметры запроса
    const { params } = useMemo(() => {
        const p: ColorsListGetParams = {
            ...(ordering.length ? { ordering } : {}),
        };
        return { params: p };
    }, [ordering]);

    // Запрос с пагинацией
    const {
        data: colors,
        isLoading,
        isError,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: queryKeys.colors(params),
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const page = typeof pageParam === "number" ? pageParam : 1;
            const res = await getColors({ ...params, page });
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

    // Получаем общее количество цветов
    const totalColors = colors?.pages?.[0]?.count || 0;
    const totalActiveColors = colors?.pages?.[0]?.active || 0;

    // Плоский список цветов
    const flatList = useMemo<IColor[]>(() => {
        if (!colors?.pages) return [];
        return colors.pages.flatMap((page) => page.result ?? []);
    }, [colors]);

    const updateColorMutation = useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: number;
            payload: {
                hex?: string;
                is_active?: boolean;
            };
        }) => updateColor(id, payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: queryKeys.colorLists() });
            toast.success("Цвет успешно обновлен");
        },
        onError: (mutationError) => {
            const err = mutationError as AxiosError<{ error?: string; detail?: string }>;
            const message = err.response?.data?.error
                || err.response?.data?.detail
                || err.message
                || "Не удалось обновить цвет";

            toast.error(message, { toastId: message });
        },
    });

    // Запрос на удаление цвета
    const deleteMutation = useMutation({
        mutationFn: (colorId: number) => deleteColor(colorId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: queryKeys.colorLists() });
            toast.success("Цвет успешно удален");
        },
        onError: (mutationError) => {
            const err = mutationError as AxiosError<{ error: string }>;
            toast.error(err.message, { toastId: err.message });
        },
    });

    // Обработка удаления цвета
    const handleDeleteColor = (color: IColor) => {
        openConfirmation({
            type: "deletion_confirm",
            title: `Удалить цвет "${color.name}"?`,
            subTitle: "Цвет будет удален без возможности восстановления. Подтвердите действие.",
            confirmBtnTitle: "Удалить",
            closeBtnTitle: "Отмена",
            onConfirm: () => deleteMutation.mutate(color.id),
        });
    };

    // Обработка ошибок
    useEffect(() => {
        if (isError) {
            const err = error as AxiosError<{ error: string }>;
            toast.error(err.message, { toastId: err.message });
        }
    }, [isError, error]);


    // Обработка изменения статуса из таблицы
    const handleStatusChange = useCallback((colorId: number, value: boolean) => {
        updateColorMutation.mutate({
            id: colorId,
            payload: {
                is_active: value,
            },
        });
    }, [updateColorMutation]);


    // Заголовки таблицы
    const headers = useMemo<HeaderCell[]>(
        () => [
            {
                name: "Название",
                width: "1fr",
                ordering: "name",
            },
            {
                name: "Код",
                width: "1fr",
                ordering: "hex",
                align: "center",
            },
            {
                name: "Цвет",
                width: "1fr",
                align: "center",
            },
            {
                name: "Статус",
                width: "1fr",
                ordering: "is_active",
                align: "center",
            },
        ],
        []
    );

    // Данные таблицы
    const rows = useMemo(() => {
        const list = flatList ?? [];

        return list.map((color: IColor) => {
            const rowActions: ContextMenuItem[] = [
                ...(color.id !== undefined ? [{
                    title: "Редактировать",
                    icon: EditIcon,
                    onClick: () => openColorEditModal(color),
                },
                {
                    title: "Удалить",
                    icon: TrashBinIcon,
                    onClick: () => handleDeleteColor(color),
                },
            ] : []),
            ];

            const row: RowItem = {
                props: {
                    objName: "Color",
                    obj: color,
                    keys: { colors: [color] },
                    actions: rowActions,
                },
                data: [
                    <VirtualCell title={color.name}>
                        <div className={cls.colorPreview} style={{ backgroundColor: color.hex }} aria-hidden />
                    </VirtualCell>,
                    <VirtualCell title={color.hex} align="center" />,
                    <VirtualCell align="center">
                        <div className={cls.colorPreview} style={{ backgroundColor: color.hex }} aria-hidden />
                    </VirtualCell>,
                    <VirtualCell align="center">
                        <div>
                            <Switch
                                value={color.is_active}
                                setValue={(value) => { handleStatusChange(color.id, value) }}
                                disabled={updateColorMutation.isPending}
                            />
                        </div>
                    </VirtualCell>,
                ],
            } satisfies RowItem;
            return row;
        });
    }, [
        flatList,
        handleDeleteColor,
        handleStatusChange,
        openColorEditModal,
        updateColorMutation.isPending,
    ]);

    return (
        <div className={cls.wrapper}>
            <div className={cls.header}>
                <Title
                    size="h2"
                    title="Цветовая палитра"
                    subTitle="Управляйте цветовыми палитрами и их настройками"
                />
                <Button className={cls.addButton} onClick={openColorCreateModal}>
                    <PlusIcon className={cls.addButtonIcon} />
                    <p className={cls.addButtonText}>Добавить цвет</p>
                </Button>
            </div>

            <div className={cls.content}>
                <div className={cls.summaryBlock}>
                    <p className={cls.summaryText}>Всего: {totalColors}</p>
                    <p className={cls.summaryText}>|</p>
                    <p className={cls.summaryText}>Активных: {totalActiveColors}</p>
                    <p className={cls.summaryText}>|</p>
                    <p className={cls.summaryText}>Скрытых: {totalColors - totalActiveColors}</p>
                </div>

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
                            row_height={47}
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
        </div>
    );
};