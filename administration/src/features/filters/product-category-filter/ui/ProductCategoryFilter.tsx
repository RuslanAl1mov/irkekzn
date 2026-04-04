import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useFiltersStore } from "@/entities/filters";
import { getProductCategories } from "@/entities/product-category";
import type { IProductCategory } from "@/entities/product-category/model/type";

import { Filter, type FilterItem } from "../../filter/ui/Filter";

const PAGE_SIZE = 100;

function categoryToItem(c: IProductCategory, rootLabel: string): FilterItem {
  return {
    id: c.id,
    title: c.name,
    secTitle: c.parent?.name ?? rootLabel,
  };
}

type Props = {
  label?: string;
  triggerStyle?: "shadowed" | "bordered" | undefined;
  value?: IProductCategory[];
  setValue?: (items: IProductCategory[]) => void;
};

export const ProductCategoryFilter: React.FC<Props> = ({
  label,
  triggerStyle = "shadowed",
  value,
  setValue,
}) => {
  const rootLabel = "Корневая";

  const storeSelected = useFiltersStore((s) => s.productCategoryFilter);
  const storeSetSelected = useFiltersStore((s) => s.setProductCategoryFilter);

  const isControlled = Array.isArray(value) && typeof setValue === "function";
  const selectedCategories = isControlled ? value : storeSelected;
  const setSelectedCategories = isControlled
    ? (setValue as (items: IProductCategory[]) => void)
    : storeSetSelected;

  const selectedIds = useMemo(
    () => selectedCategories.map((c) => c.id),
    [selectedCategories],
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(id);
  }, [search]);

  const {
    data: pickerCategories = [],
    isLoading: pickerLoading,
    error: pickerError,
  } = useQuery({
    queryKey: ["product-categories", "picker", debouncedSearch] as const,
    queryFn: () =>
      getProductCategories({
        search: debouncedSearch.trim() || undefined,
        page: 1,
        page_size: PAGE_SIZE,
      }),
    select: (res) => {
      const payload = res?.data ?? res;
      if (payload && typeof payload === "object" && "result" in payload) {
        return payload.result as IProductCategory[];
      }
      return [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  /**
   * Полные объекты IProductCategory по id: сначала из ответа пикера,
   * затем из стора — те же объекты, что в productCategoryFilter.
   */
  const categoryById = useMemo(() => {
    const m = new Map<number, IProductCategory>();
    for (const c of pickerCategories) m.set(c.id, c);
    for (const c of selectedCategories) {
      if (!m.has(c.id)) m.set(c.id, c);
    }
    return m;
  }, [pickerCategories, selectedCategories]);

  const items = useMemo(() => {
    const ordered: FilterItem[] = [];
    const seen = new Set<number>();

    for (const c of pickerCategories) {
      ordered.push(categoryToItem(c, rootLabel));
      seen.add(c.id);
    }

    for (const c of selectedCategories) {
      if (seen.has(c.id)) continue;
      ordered.push(
        c.name
          ? categoryToItem(c, rootLabel)
          : {
              id: c.id,
              title: "Загрузка…",
              secTitle: `ID: ${c.id}`,
            },
      );
      seen.add(c.id);
    }

    return ordered;
  }, [pickerCategories, selectedCategories, rootLabel]);

  const onIdsChange = useCallback(
    (ids: number[]) => {
      setSelectedCategories(
        ids.map(
          (id) =>
            categoryById.get(id) ??
            ({
              id,
              name: "",
              description: "",
              parent: null,
            } as IProductCategory),
        ),
      );
    },
    [categoryById, setSelectedCategories],
  );

  return (
    <Filter
      label={label ?? "Категория"}
      data={items}
      selected={selectedIds}
      onChange={onIdsChange}
      triggerStyle={triggerStyle}
      isMulti
      isCleareble
      search={search}
      onSearchChange={setSearch}
      isLoading={pickerLoading}
      error={
        pickerError && axios.isAxiosError(pickerError)
          ? pickerError
          : (pickerError ?? undefined)
      }
    />
  );
};
