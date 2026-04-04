import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { DateRange, FiltersActions, FiltersState } from "./type";

const DEFAULTS: FiltersState = {
  // значения
  startDateRange: [null, null],
  archivationDateRange: [null, null],
  archivation: null,
  searchTerm: "",

  productFilter: [],
  productCategoryFilter: [],
  sizeFilter: [],
  shopFilter: [],

  // UI состояния попапов
  isStartDateOpen: false,
  isArchivationDateOpen: false,
  isArchivationOpen: false,
};

type Store = FiltersState & FiltersActions;

export const useFiltersStore = create<Store>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      // значения
      setStartDateRange: (startDateRange: DateRange) => set({ startDateRange }),
      setArchivationDateRange: (archivationDateRange: DateRange) => set({ archivationDateRange }),
      setArchivation: (v) => set({ archivation: v }),
      setSearchTerm: (value) => set({ searchTerm: value }),

      setProductFilter: (productFilter) => set({ productFilter }),
      setProductCategoryFilter: (productCategoryFilter) => set({ productCategoryFilter }),
      setSizeFilter: (sizeFilter) => set({ sizeFilter }),
      setShopFilter: (shopFilter) => set({ shopFilter }),

      // UI
      setIsStartDateOpen: (v) => set({ isStartDateOpen: v }),
      setIsArchivationDateOpen: (v) => set({ isArchivationDateOpen: v }),
      setIsArchivationOpen: (v) => set({ isArchivationOpen: v }),

      reset: () => set(DEFAULTS),
    }),
    {
      name: "adskill_crm_filters@v1",
      partialize: (s) => ({
        // сохраняем только значения фильтров
        startDateRange: s.startDateRange,
        archivationDateRange: s.archivationDateRange,
        archivation: s.archivation,
        searchTerm: s.searchTerm,

        productFilter: s.productFilter,
        productCategoryFilter: s.productCategoryFilter,
        sizeFilter: s.sizeFilter,
        shopFilter: s.shopFilter,
      }),
    },
  ),
);
