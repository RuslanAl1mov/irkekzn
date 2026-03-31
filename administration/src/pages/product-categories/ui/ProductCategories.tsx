import cls from "./ProductCategories.module.css";

import { Title } from "@/widgets/title";
import { FiltersBlock } from "@/shared/ui/filters-block";
import { useState } from "react";
import { useFiltersStore } from "@/entities/filters";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";
import type { ProductCategoriesListGetParams } from "@/entities/product-category/api/getProductCategories.api";
import { formatDateTime, formatNumber, toApiDate } from "@/shared/lib/formater";
import { getProductCategories } from "@/entities/product-category";
import type { IProductCategory } from "@/entities/product-category/model/type";
import { VirtualTable, type HeaderCell } from "@/shared/ui/virtual-table/table";
import { VirtualCell } from "@/shared/ui/virtual-table/cell";
import type { RowItem } from "@/shared/ui/virtual-table/row";
import { Loader } from "@/widgets/loader";
import { Button } from "@/shared/ui/button";
import PlusIcon from "@/assets/icons/plus.svg?react";
import { WideImagesGallery } from "@/shared/ui/wide-images-gallery";


export const ProductCategories = () => {
    const [ordering, setOrdering] = useState<string[]>([]);

    // Глобавльные фильтры
    const searchTerm = useFiltersStore((s) => s.searchTerm);
    const [start_date_after, start_date_before] = useFiltersStore((s) => s.startDateRange);

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
        const p: ProductCategoriesListGetParams = {
            ...(searchTerm?.trim() ? { search: searchTerm.trim() } : {}),
            ...(ordering.length ? { ordering } : {}),
            ...(start_date_after ? { date_created_after: toApiDate(start_date_after) } : {}),
            ...(start_date_before ? { date_created_before: toApiDate(start_date_before) } : {}),
        };
        return { params: p };
    }, [
        ordering,
        searchTerm,
        start_date_after,
        start_date_before,
    ]);

    // запрос с пагинацией
    const {
        data: productCategories,
        hasNextPage,
        isLoading,
        isError,
        error,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: queryKeys.productCategories(params),
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const page = typeof pageParam === "number" ? pageParam : 1;
            const res = await getProductCategories({ ...params, page });
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
    const totalProductCategories = productCategories?.pages?.[0]?.count || 0;
    const totalActiveProductCategories = productCategories?.pages?.[0]?.active || 0;

    // Плоский список категорий
    const flatList = useMemo<IProductCategory[]>(() => {
        if (!productCategories?.pages) return [];
        return productCategories.pages.flatMap((page) => page.result ?? []);
    }, [productCategories]);


    // Заголовки таблицы
    const headers = useMemo<HeaderCell[]>(
        () => [
            {
                name: "",
                width: "50px",
                ordering: "is_active",
            },
            {
                name: "Название",
                width: "0.5fr",
                ordering: "name",
            },
            {
                name: "Обложки",
                width: "260px",
                align: "center",
            },

            {
                name: "Описание",
                width: "0.6fr",
                ordering: "description",
                align: "center"
            },

            {
                name: "Карточек",
                width: "0.3fr",
                ordering: "active_product_cards_count",
                align: "center"
            },
            {
                name: "Товаров",
                width: "0.3fr",
                ordering: "active_products_count",
                align: "center"
            },

            {
                name: "Дата создания",
                width: "0.4fr",
                ordering: "date_created",
                align: "center",
            },

        ],
        []
    );

    // Данные таблицы
    const rows = useMemo(() => {
        const list = flatList ?? [];

        return list.map((productCategory: IProductCategory) => {

            const row = {
                props: {
                    objName: "ProductCategory",
                    obj: productCategory,
                    keys: { productCategories: [productCategory] },
                },
                data: [
                    <VirtualCell
                        status={productCategory.is_active ? "active" : "archived"}
                        align="center"
                    />,
                    <VirtualCell
                        title={productCategory.name}
                        secTitle={productCategory.parent?.name}
                        isCopible
                        titleWhiteSpace="normal"
                    />,
                    <VirtualCell>
                        <WideImagesGallery images={productCategory.covers} />
                    </VirtualCell>,
                    <VirtualCell
                        title={productCategory.description}
                        isCopible
                        titleWhiteSpace="normal"
                        align="center"
                    />,
                    <VirtualCell
                        title={formatNumber(productCategory.active_product_cards_count)}
                        secTitle={formatNumber(productCategory.product_cards_count)}
                        align="center"
                    />,
                    <VirtualCell
                        title={formatNumber(productCategory.active_products_count)}
                        secTitle={formatNumber(productCategory.products_count)}
                        align="center"
                    />,
                    <VirtualCell
                        title={formatDateTime(productCategory.date_created)}
                        align="center"
                    />,
                ],
            } satisfies RowItem;
            return row;
        });
    }, [
        flatList,
    ]);


    return (
        <section className={cls.section}>
            <div className={cls.titleBlock}>
                <Title
                    title="Категории товаров"
                    subTitle="Управляйте категориями товаров и их свойствами"
                />
                <Button className={cls.addButton}>
                    <PlusIcon className={cls.addButtonIcon} />
                    <p className={cls.addButtonText}>Добавить категорию</p>
                </Button>
            </div>

            <div className={cls.content}>
                <FiltersBlock filtersObject="product-category" leftBlockChildren={(
                    <div className={cls.summaryBlock}>
                        <p className={cls.summaryText}>Всего: {totalProductCategories}</p>
                        <p className={cls.summaryText}>|</p>
                        <p className={cls.summaryText}>Активных: {totalActiveProductCategories}</p>
                        <p className={cls.summaryText}>|</p>
                        <p className={cls.summaryText}>Заблокированных: {totalProductCategories - totalActiveProductCategories}</p>
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
                            row_height={200}
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