import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { DateRange, FiltersActions, FiltersState } from "./type";

const DEFAULTS: FiltersState = {
  // значения
  dateRange: [null, null],
  archivation: null,
  searchTerm: "",

  // UI состояния попапов
  isDateOpen: false,
  isArchivationOpen: false,
};

type Store = FiltersState & FiltersActions;

export const useFiltersStore = create<Store>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      // значения
      setDateRange: (dateRange: DateRange) => set({ dateRange }),
      setArchivation: (v) => set({ archivation: v }),
      setSearchTerm: (value) => set({ searchTerm: value }),

      // UI
      setIsDateOpen: (v) => set({ isDateOpen: v }),
      setIsArchivationOpen: (v) => set({ isArchivationOpen: v }),

      reset: () => set(DEFAULTS),
    }),
    {
      name: "adskill_crm_filters@v1",
      partialize: (s) => ({
        // сохраняем только значения фильтров
        dateRange: s.dateRange,
        archivation: s.archivation,
        searchTerm: s.searchTerm,
      }),
    }
  )
);
