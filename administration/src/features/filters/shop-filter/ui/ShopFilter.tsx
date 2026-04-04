import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useCallback, useMemo, useState } from "react";

import { useFiltersStore } from "@/entities/filters";
import { getShops } from "@/entities/shop";
import type { IShop } from "@/entities/shop/model/type";

import { Filter, type FilterItem } from "../../filter/ui/Filter";

function shopToFilterItem(s: IShop): FilterItem {
  return {
    id: s.id,
    title: s.name,
    secTitle: s.city + ", " + s.address || "",
  };
}

type Props = {
  label?: string;
  triggerStyle?: "shadowed" | "bordered" | undefined;
  value?: IShop[];
  setValue?: (items: IShop[]) => void;
};

export const ShopFilter: React.FC<Props> = ({
  label,
  triggerStyle = "shadowed",
  value,
  setValue,
}) => {
  const storeSelected = useFiltersStore((s) => s.shopFilter);
  const storeSetSelected = useFiltersStore((s) => s.setShopFilter);

  const isControlled = Array.isArray(value) && typeof setValue === "function";
  const selectedShops = isControlled ? value : storeSelected;
  const setSelectedShops = isControlled
    ? (setValue as (items: IShop[]) => void)
    : storeSetSelected;

  const selectedIds = useMemo(
    () => selectedShops.map((s) => s.id),
    [selectedShops],
  );

  const [search, setSearch] = useState("");

  const { data: pageShops = [], isLoading, error } = useQuery({
    queryKey: ["shops", "filter", "first-page"] as const,
    queryFn: async () => {
      const res = await getShops({ page: 1 });
      const payload = res?.data;
      if (payload && typeof payload === "object" && "result" in payload) {
        return payload.result as IShop[];
      }
      return [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const shopById = useMemo(() => {
    const m = new Map<number, IShop>();
    for (const s of pageShops) m.set(s.id, s);
    for (const s of selectedShops) {
      if (!m.has(s.id)) m.set(s.id, s);
    }
    return m;
  }, [pageShops, selectedShops]);

  const filteredBySearch = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pageShops;
    return pageShops.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q),
    );
  }, [pageShops, search]);

  const items = useMemo(() => {
    const ordered: FilterItem[] = [];
    const seen = new Set<number>();

    for (const s of filteredBySearch) {
      ordered.push(shopToFilterItem(s));
      seen.add(s.id);
    }

    for (const ss of selectedShops) {
      if (seen.has(ss.id)) continue;
      ordered.push(
        ss.name
          ? shopToFilterItem(ss)
          : {
              id: ss.id,
              title: "Загрузка…",
              secTitle: `ID: ${ss.id}`,
            },
      );
      seen.add(ss.id);
    }

    return ordered;
  }, [filteredBySearch, selectedShops]);

  const onIdsChange = useCallback(
    (ids: number[]) => {
      setSelectedShops(
        ids.map(
          (id) =>
            shopById.get(id) ??
            ({
              id,
              name: "",
              email: "",
              phone_first: "",
              phone_second: "",
              phone_third: "",
              telegram_link: "",
              telegram_name: "",
              vk_link: "",
              vk_name: "",
              instagram_link: "",
              instagram_name: "",
              city: "",
              address: "",
              map_location: "",
              is_main_office: false,
              is_active: true,
            } as IShop),
        ),
      );
    },
    [shopById, setSelectedShops],
  );

  return (
    <Filter
      label={label ?? "Бутики"}
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
