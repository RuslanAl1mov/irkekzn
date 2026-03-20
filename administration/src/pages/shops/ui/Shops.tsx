import cls from "./Shops.module.css";

import { useEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

import { getShops } from "@/entities/shop";
import type { IShop, ShopsListGetParams } from "@/entities/shop";
import { useFiltersStore } from "@/entities/filters";

import { queryKeys } from "@/shared/lib/react-query/queryKeys";
import { FiltersBlock } from "@/shared/ui/filters-block";
import { Button } from "@/shared/ui/button";
import { ShopCard } from "@/shared/ui/shop-card";
import { Title } from "@/widgets/title";
import { Loader } from "@/widgets/loader";

import { useShopCreateStore } from "@/features/shop";

import PlusIcon from "@/assets/icons/plus.svg?react";


export const Shops = () => {
    const { open: openShopCreate } = useShopCreateStore();

    // Глобальные фильтры
    const searchTerm = useFiltersStore((s) => s.searchTerm);

    // Параметры запроса
    const { params } = useMemo(() => {
        const p: ShopsListGetParams = {
            ...(searchTerm?.trim() ? { search: searchTerm.trim() } : {}),
        };
        return { params: p };
    }, [
        searchTerm,
    ]);

    // запрос с пагинацией
    const {
        data: shops,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: queryKeys.shops(params),
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
            const page = typeof pageParam === "number" ? pageParam : 1;
            const res = await getShops({ ...params, page });
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
    const totalShops = shops?.pages?.[0]?.count || 0;
    const totalActiveShops = shops?.pages?.[0]?.active || 0;


    // Плоский список клиентов
    const flatList = useMemo<IShop[]>(() => {
        if (!shops?.pages) return [];
        return shops.pages.flatMap((page) => page.result ?? []);
    }, [shops]);


    return (
        <section className={cls.section}>

            <div className={cls.titleBlock}>
                <Title
                    title="Управление бутиками"
                    subTitle="Управляйте бутиками и их настройками"
                />
                <Button className={cls.addButton} onClick={openShopCreate}>
                    <PlusIcon className={cls.addButtonIcon} />
                    <p className={cls.addButtonText}>Добавить бутик</p>
                </Button>
            </div>

            <div className={cls.content}>
                <FiltersBlock filtersObject="shop" leftBlockChildren={
                    <div className={cls.summaryBlock}>
                        <p className={cls.summaryText}>Всего: {totalShops}</p>
                        <p className={cls.summaryText}>|</p>
                        <p className={cls.summaryText}>Активных: {totalActiveShops}</p>
                        <p className={cls.summaryText}>|</p>
                        <p className={cls.summaryText}>Архивированных: {totalShops - totalActiveShops}</p>
                    </div>
                } />

                {isLoading && (
                    <div className={cls.loaderErrorBlock}>
                        <Loader size={30} strokeWidth={6} />
                    </div>
                )}

                {flatList.length > 0 && (
                    <div className={cls.tableBlock}>
                        {flatList.map((shop: IShop) => (
                            <ShopCard key={shop.id} shop={shop} />
                        ))}
                    </div>
                )}
            </div>

        </section >
    );
}