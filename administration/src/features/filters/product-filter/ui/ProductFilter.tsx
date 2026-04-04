import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useCallback, useMemo, useState } from "react";

import { useFiltersStore } from "@/entities/filters";
import { getProducts } from "@/entities/product";
import type { IProduct } from "@/entities/product/model/type";

import { Filter, type FilterItem } from "../../filter/ui/Filter";

function productToFilterItem(p: { id: number; name: string; article: string }): FilterItem {
  return {
    id: p.id,
    title: p.name,
    secTitle: `Арт: ${p.article}`,
  };
}

type Props = {
  label?: string;
  triggerStyle?: "shadowed" | "bordered" | undefined;
  value?: IProduct[];
  setValue?: (items: IProduct[]) => void;
};

export const ProductFilter: React.FC<Props> = ({
  label,
  triggerStyle = "shadowed",
  value,
  setValue,
}) => {
  const storeSelected = useFiltersStore((s) => s.productFilter);
  const storeSetSelected = useFiltersStore((s) => s.setProductFilter);

  const isControlled = Array.isArray(value) && typeof setValue === "function";
  const selectedProducts = isControlled ? value : storeSelected;
  const setSelectedProducts = isControlled
    ? (setValue as (items: IProduct[]) => void)
    : storeSetSelected;

  const selectedIds = useMemo(
    () => selectedProducts.map((p) => p.id),
    [selectedProducts],
  );

  const [search, setSearch] = useState("");

  const { data: pageProducts = [], isLoading, error } = useQuery({
    queryKey: ["products", "filter", "first-page"] as const,
    queryFn: async () => {
      const res = await getProducts({ page: 1 });
      const payload = res?.data;
      if (payload && typeof payload === "object" && "result" in payload) {
        return payload.result as IProduct[];
      }
      return [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  /**
   * Полные объекты IProduct по id: сначала с первой страницы API,
   * затем из стора — только те, кого нет на странице (те же объекты, что в productFilter).
   * Map — это индекс по id; значения везде IProduct, не «просто id».
   */
  const productById = useMemo(() => {
    const m = new Map<number, IProduct>();
    for (const p of pageProducts) m.set(p.id, p);
    for (const p of selectedProducts) {
      if (!m.has(p.id)) m.set(p.id, p);
    }
    return m;
  }, [pageProducts, selectedProducts]);

  const filteredBySearch = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pageProducts;
    return pageProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.article.toLowerCase().includes(q),
    );
  }, [pageProducts, search]);

  const items = useMemo(() => {
    const ordered: FilterItem[] = [];
    const seen = new Set<number>();

    for (const p of filteredBySearch) {
      ordered.push(productToFilterItem(p));
      seen.add(p.id);
    }

    for (const sp of selectedProducts) {
      if (seen.has(sp.id)) continue;
      ordered.push(
        sp.name
          ? productToFilterItem(sp)
          : {
              id: sp.id,
              title: "Загрузка…",
              secTitle: `ID: ${sp.id}`,
            },
      );
      seen.add(sp.id);
    }

    return ordered;
  }, [filteredBySearch, selectedProducts]);

  const onIdsChange = useCallback(
    (ids: number[]) => {
      setSelectedProducts(
        ids.map(
          (id) =>
            productById.get(id) ?? ({ id, name: "", article: "" } as IProduct),
        ),
      );
    },
    [productById, setSelectedProducts],
  );

  return (
    <Filter
      label={label ?? "Товары"}
      data={items}
      selected={selectedIds}
      onChange={onIdsChange}
      triggerStyle={triggerStyle}
      isMulti
      isCleareble
      search={search}
      onSearchChange={setSearch}
      isLoading={isLoading}
      error={
        error && axios.isAxiosError(error) ? error : (error ?? undefined)
      }
    />
  );
};
