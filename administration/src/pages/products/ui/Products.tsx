import cls from "./Products.module.css";

import { Title } from "@/widgets/title";
import { FiltersBlock } from "@/shared/ui/filters-block";
import { useState } from "react";
import { useFiltersStore } from "@/entities/filters";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";
import type { ProductsListGetParams } from "@/entities/product";
import { formatDateTime, formatNumber, toApiDate } from "@/shared/lib/formater";
import { getProducts } from "@/entities/product";
import type { IProduct } from "@/entities/product/model/type";
import { VirtualTable, type HeaderCell } from "@/shared/ui/virtual-table/table";
import { VirtualCell } from "@/shared/ui/virtual-table/cell";
import type { RowItem } from "@/shared/ui/virtual-table/row";
import { Loader } from "@/widgets/loader";
import { Button } from "@/shared/ui/button";
import PlusIcon from "@/assets/icons/plus.svg?react";
import { WideImagesGallery } from "@/shared/ui/wide-images-gallery";


export const Products = () => {
    const [ordering, setOrdering] = useState<string[]>([]);

    // Глобавльные фильтры
    const searchTerm = useFiltersStore((s) => s.searchTerm);
    const [start_date_after, start_date_before] = useFiltersStore((s) => s.startDateRange);

    // Дебаунс сортировки
    const orderingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        const p: ProductsListGetParams = {
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
        data: products,
        hasNextPage,
        isLoading,
        isError,
        error,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: queryKeys.products(params),
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const page = typeof pageParam === "number" ? pageParam : 1;
            const res = await getProducts({ ...params, page });
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
    const totalProducts = products?.pages?.[0]?.count || 0;
    const totalActiveProducts = products?.pages?.[0]?.active || 0;

    // Плоский список категорий
    const flatList = useMemo<IProduct[]>(() => {
        if (!products?.pages) return [];
        return products.pages.flatMap((page) => page.result ?? []);
    }, [products]);


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
                name: "Изображения",
                width: "180px",
                align: "center",
            },
            {
                name: "Цвет",
                width: "0.4fr",
                ordering: "color_name",
                align: "center"
            },
            {
                name: "Описание",
                width: "0.6fr",
                ordering: "description",
                align: "center"
            },
            {
                name: "Цена",
                width: "0.4fr",
                ordering: "price",
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

        return list.map((product: IProduct) => {

            const row = {
                props: {
                    objName: "Product",
                    obj: product,
                    keys: { products: [product] },
                },
                data: [
                    <VirtualCell
                        status={product.is_active ? "active" : "archived"}
                        align="center"
                    />,
                    <VirtualCell
                        title={product.name}
                        secTitle={`Арт: ${product.article}`}
                        isCopible
                        titleWhiteSpace="normal"
                    />,
                    <VirtualCell>
                        <WideImagesGallery images={product.images} />
                    </VirtualCell>,
                    <VirtualCell
                        title={product.color_name}
                        secTitle={product.is_custom_color ? "Кастомный цвет" : product.color?.hex}
                        align="center"
                    >
                        {!product.is_custom_color && (
                            <div className={cls.colorPreview} style={{ backgroundColor: product.color.hex }} aria-hidden />
                        )}
                    </VirtualCell>,
                    <VirtualCell
                        secTitle={product.description}
                        isCopible
                        secTitleWhiteSpace="normal"
                        align="center"
                    />,
                    <VirtualCell
                        title={product.sale_price ? formatNumber(product.sale_price) : formatNumber(product.price)}
                        secTitle={product.sale_price ? formatNumber(product.price) : ""}
                        align="center"
                    />,
                    <VirtualCell
                        title={formatDateTime(product.date_created)}
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
                    title="Товары"
                    subTitle="Управляйте товарами и их свойствами"
                />
                <Button className={cls.addButton}>
                    <PlusIcon className={cls.addButtonIcon} />
                    <p className={cls.addButtonText}>Добавить товар</p>
                </Button>
            </div>

            <div className={cls.content}>
                <FiltersBlock filtersObject="product" leftBlockChildren={(
                    <div className={cls.summaryBlock}>
                        <p className={cls.summaryText}>Всего: {totalProducts}</p>
                        <p className={cls.summaryText}>|</p>
                        <p className={cls.summaryText}>Активных: {totalActiveProducts}</p>
                        <p className={cls.summaryText}>|</p>
                        <p className={cls.summaryText}>Заблокированных: {totalProducts - totalActiveProducts}</p>
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
                            row_height={150}
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