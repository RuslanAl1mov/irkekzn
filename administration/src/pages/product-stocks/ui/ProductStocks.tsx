import cls from "./ProductStocks.module.css";

import { Title } from "@/widgets/title";
import { FiltersBlock } from "@/shared/ui/filters-block";
import { useState } from "react";
import { useFiltersStore } from "@/entities/filters";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";
import type { ProductStocksListGetParams } from "@/entities/product-stock";
import { formatNumber, toApiDate } from "@/shared/lib/formater";
import { getProductStocks } from "@/entities/product-stock";
import type { IProductStock } from "@/entities/product-stock/model/type";
import { VirtualTable, type HeaderCell } from "@/shared/ui/virtual-table/table";
import { VirtualCell } from "@/shared/ui/virtual-table/cell";
import type { RowItem } from "@/shared/ui/virtual-table/row";
import { Loader } from "@/widgets/loader";
import { Button } from "@/shared/ui/button";
import PlusIcon from "@/assets/icons/plus.svg?react";
import { WideImagesGallery } from "@/shared/ui/wide-images-gallery";

export const ProductStocks = () => {
    const [ordering, setOrdering] = useState<string[]>([]);

    const searchTerm = useFiltersStore((s) => s.searchTerm);
    const [product_created_after, product_created_before] = useFiltersStore(
        (s) => s.startDateRange,
    );
    const productFilter = useFiltersStore((s) => s.productFilter);
    const productCategoryFilter = useFiltersStore((s) => s.productCategoryFilter);
    const sizeFilter = useFiltersStore((s) => s.sizeFilter);
    const shopFilter = useFiltersStore((s) => s.shopFilter);

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

    const { params } = useMemo(() => {
        const p: ProductStocksListGetParams = {
            ...(searchTerm?.trim() ? { search: searchTerm.trim() } : {}),
            ...(ordering.length ? { ordering } : {}),
            ...(product_created_after
                ? { product_date_created_after: toApiDate(product_created_after) }
                : {}),
            ...(product_created_before
                ? { product_date_created_before: toApiDate(product_created_before) }
                : {}),
            ...(productFilter.length ? { product: productFilter } : {}),
            ...(productCategoryFilter.length ? { category: productCategoryFilter } : {}),
            ...(sizeFilter.length ? { size: sizeFilter } : {}),
            ...(shopFilter.length ? { shop: shopFilter } : {}),
        };
        return { params: p };
    }, [
        ordering,
        searchTerm,
        product_created_after,
        product_created_before,
        productFilter,
        productCategoryFilter,
        sizeFilter,
        shopFilter,
    ]);

    const {
        data: productStocks,
        hasNextPage,
        isLoading,
        isError,
        error,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: queryKeys.productStocks(params),
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const page = typeof pageParam === "number" ? pageParam : 1;
            const res = await getProductStocks({ ...params, page });
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

    useEffect(() => {
        if (isError) {
            const err = error as AxiosError<{ error: string }>;
            toast.error(err.message, { toastId: err.message });
        }
    }, [isError, error]);

    const firstPage = productStocks?.pages?.[0];
    const totalStocks = firstPage?.count ?? 0;
    const totalAmount = firstPage?.total_amount ?? 0;
    const uniqueProducts = firstPage?.unique_products ?? 0;

    const flatList = useMemo<IProductStock[]>(() => {
        if (!productStocks?.pages) return [];
        return productStocks.pages.flatMap((page) => page.result ?? []);
    }, [productStocks]);

    const headers = useMemo<HeaderCell[]>(
        () => [
            {
                name: "",
                width: "50px",
                ordering: "product__is_active",
                align: "center",
            },
            {
                name: "Товар",
                width: "0.45fr",
                ordering: "product__name",
            },
            {
                name: "Изображения",
                width: "180px",
                align: "center",
            },
            {
                name: "Цвет",
                width: "0.35fr",
                align: "center",
            },
            {
                name: "Размер",
                width: "0.3fr",
                ordering: "size__russian",
                align: "center",
            },
            {
                name: "Бутик",
                width: "0.3fr",
                ordering: "shop__name",
                align: "center",
            },
            {
                name: "Количество",
                width: "0.25fr",
                ordering: "amount",
                align: "center",
            },
        ],
        []
    );

    const rows = useMemo(() => {
        const list = flatList ?? [];

        return list.map((stock: IProductStock) => {
            const { product } = stock;
            const images = product.images ?? [];

            const row = {
                props: {
                    objName: "ProductStock",
                    obj: stock,
                    keys: { productStocks: [stock] },
                },
                data: [
                    <VirtualCell
                        align="center"
                        status={product.is_active ? "active" : "archived"}
                    />,
                    <VirtualCell
                        title={product.name}
                        secTitle={`Арт: ${product.article}`}
                        isCopible
                        titleWhiteSpace="normal"
                    />,
                    <VirtualCell align="center">
                        {images.length > 0 ? (
                            <WideImagesGallery images={images} />
                        ) : (
                            "—"
                        )}
                    </VirtualCell>,
                    <VirtualCell
                        title={product.color_name}
                        secTitle={product.is_custom_color ? "Кастомный цвет" : product.color?.hex}
                        align="center"
                    >
                        {!product.is_custom_color && product.color?.hex && (
                            <div
                                className={cls.colorPreview}
                                style={{ backgroundColor: product.color.hex }}
                                aria-hidden
                            />
                        )}
                    </VirtualCell>,
                    <VirtualCell
                        title={stock.size.international}
                        secTitle={`rus: ${stock.size.russian} / eur: ${stock.size.european}`}
                        align="center"
                    />,
                    <VirtualCell
                        title={stock.shop.name}
                        secTitle={`(${stock.shop.city}) ${stock.shop.address}`}
                        secTitleWhiteSpace="normal"
                        align="center"
                    />,
                    <VirtualCell title={`${formatNumber(stock.amount)} шт.`} align="center" />,
                ],
            } satisfies RowItem;
            return row;
        });
    }, [flatList]);

    const loadedRows = flatList.length;

    return (
        <section className={cls.section}>
            <div className={cls.titleBlock}>
                <Title
                    title="Складской учёт"
                    subTitle="Остатки товаров по размерам и бутикам"
                />
                <Button className={cls.addButton}>
                    <PlusIcon className={cls.addButtonIcon} />
                    <p className={cls.addButtonText}>Добавить остаток</p>
                </Button>
            </div>

            <div className={cls.content}>
                <FiltersBlock
                    filtersObject="product-stock"
                    leftBlockChildren={
                        <div className={cls.summaryBlock}>
                            <p className={cls.summaryText}>Всего: {formatNumber(totalStocks)}</p>
                            <p className={cls.summaryText}>|</p>
                            <p className={cls.summaryText}>Уникальных товаров: {formatNumber(uniqueProducts)} шт.</p>
                            <p className={cls.summaryText}>|</p>
                            <p className={cls.summaryText}>Кол-во на складе: {formatNumber(totalAmount)} шт.</p>
                        </div>
                    }
                />

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
};
