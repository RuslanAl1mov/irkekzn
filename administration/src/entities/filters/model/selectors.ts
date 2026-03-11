import { format } from "date-fns";

import { useFiltersStore } from "./store";

export const useFiltersValues = () =>
  useFiltersStore((s) => ({
    dateRange: s.dateRange,
    archivation: s.archivation,
    searchTerm: s.searchTerm,
  }));

export const useFiltersUI = () =>
  useFiltersStore((s) => ({
    isDateOpen: s.isDateOpen,
    isArchivationOpen: s.isArchivationOpen,
    setIsDateOpen: s.setIsDateOpen,
    setIsArchivationOpen: s.setIsArchivationOpen,
  }));

export const useFiltersQueryParams = () => {
  const {
    dateRange,
    archivation,
    searchTerm,
  } = useFiltersValues();

  const [from, to] = dateRange;

  return {
    date_after: from ? format(from, "yyyy-MM-dd") : undefined,
    date_before: to ? format(to, "yyyy-MM-dd") : undefined,
    archivation: archivation ?? undefined,
    q: searchTerm || undefined,
  };
};
