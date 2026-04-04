import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useCallback, useMemo, useState } from "react";

import { useFiltersStore } from "@/entities/filters";
import { getSizes } from "@/entities/size";
import type { ISize } from "@/entities/size/model/type";

import { Filter, type FilterItem } from "../../filter/ui/Filter";

function sizeToFilterItem(s: ISize): FilterItem {
  return {
    id: s.id,
    title: s.international,
    secTitle: `RU ${s.russian} · EU ${s.european}`
  };
}

type Props = {
  label?: string;
  triggerStyle?: "shadowed" | "bordered" | undefined;
  value?: ISize[];
  setValue?: (items: ISize[]) => void;
};

export const SizeFilter: React.FC<Props> = ({
  label,
  triggerStyle = "shadowed",
  value,
  setValue,
}) => {
  const storeSelected = useFiltersStore((s) => s.sizeFilter);
  const storeSetSelected = useFiltersStore((s) => s.setSizeFilter);

  const isControlled = Array.isArray(value) && typeof setValue === "function";
  const selectedSizes = isControlled ? value : storeSelected;
  const setSelectedSizes = isControlled
    ? (setValue as (items: ISize[]) => void)
    : storeSetSelected;

  const selectedIds = useMemo(
    () => selectedSizes.map((s) => s.id),
    [selectedSizes],
  );

  const [search, setSearch] = useState("");

  const { data: pageSizes = [], isLoading, error } = useQuery({
    queryKey: ["sizes", "filter", "first-page"] as const,
    queryFn: async () => {
      const res = await getSizes({ page: 1 });
      const payload = res?.data;
      if (payload && typeof payload === "object" && "result" in payload) {
        return payload.result as ISize[];
      }
      return [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const sizeById = useMemo(() => {
    const m = new Map<number, ISize>();
    for (const s of pageSizes) m.set(s.id, s);
    for (const s of selectedSizes) {
      if (!m.has(s.id)) m.set(s.id, s);
    }
    return m;
  }, [pageSizes, selectedSizes]);

  const filteredBySearch = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pageSizes;
    return pageSizes.filter(
      (s) =>
        s.russian.toLowerCase().includes(q) ||
        s.international.toLowerCase().includes(q) ||
        s.european.toLowerCase().includes(q),
    );
  }, [pageSizes, search]);

  const items = useMemo(() => {
    const ordered: FilterItem[] = [];
    const seen = new Set<number>();

    for (const s of filteredBySearch) {
      ordered.push(sizeToFilterItem(s));
      seen.add(s.id);
    }

    for (const ss of selectedSizes) {
      if (seen.has(ss.id)) continue;
      ordered.push(
        ss.russian || ss.international
          ? sizeToFilterItem(ss)
          : {
              id: ss.id,
              title: "Загрузка…",
              secTitle: `ID: ${ss.id}`,
            },
      );
      seen.add(ss.id);
    }

    return ordered;
  }, [filteredBySearch, selectedSizes]);

  const onIdsChange = useCallback(
    (ids: number[]) => {
      setSelectedSizes(
        ids.map(
          (id) =>
            sizeById.get(id) ??
            ({
              id,
              russian: "",
              international: "",
              european: "",
              chest_circumference: "",
              waist_circumference: "",
              hip_circumference: "",
              order: 0,
            } as ISize),
        ),
      );
    },
    [sizeById, setSelectedSizes],
  );

  return (
    <Filter
      label={label ?? "Размер"}
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
