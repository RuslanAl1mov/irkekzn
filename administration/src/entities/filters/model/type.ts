export type DateRange = [Date | null, Date | null];

export type FiltersState = {
  // значения
  dateRange: DateRange;
  archivation: 0 | 1 | null;
  searchTerm: string;

  // UI состояния попапов
  isDateOpen: boolean;
  isArchivationOpen: boolean;
};

export type FiltersActions = {
  setDateRange: (range: DateRange) => void;
  setArchivation: (v: 0 | 1 | null) => void;
  setSearchTerm: (v: string) => void;

  setIsDateOpen: (v: boolean) => void;
  setIsArchivationOpen: (v: boolean) => void;

  reset: () => void;
};
