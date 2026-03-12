import { format } from "date-fns";

import { useFiltersStore } from "./store";

export const useFiltersValues = () =>
  useFiltersStore((s) => ({
    startDateRange: s.startDateRange,
    archivationDateRange: s.archivationDateRange,

    archivation: s.archivation,
    searchTerm: s.searchTerm,
  }));

export const useFiltersUI = () =>
  useFiltersStore((s) => ({
    isStartDateOpen: s.isStartDateOpen,
    isArchivationDateOpen: s.isArchivationDateOpen,
    isArchivationOpen: s.isArchivationOpen,
    setIsStartDateOpen: s.setIsStartDateOpen,
    setIsArchivationDateOpen: s.setIsArchivationDateOpen,
    setIsArchivationOpen: s.setIsArchivationOpen,
  }));

export const useFiltersQueryParams = () => {
  const {
    startDateRange,
    archivationDateRange,
    archivation,
    searchTerm,
  } = useFiltersValues();

  const [start_from, start_to] = startDateRange;
  const [archivation_from, archivation_to] = archivationDateRange;
  return {
    start_date_after: start_from ? format(start_from, "yyyy-MM-dd") : undefined,
    start_date_before: start_to ? format(start_to, "yyyy-MM-dd") : undefined,
    archivation_date_after: archivation_from ? format(archivation_from, "yyyy-MM-dd") : undefined,
    archivation_date_before: archivation_to ? format(archivation_to, "yyyy-MM-dd") : undefined,
    archivation: archivation ?? undefined,
    q: searchTerm || undefined,
  };
};
