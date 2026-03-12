export type DateRange = [Date | null, Date | null];

export type FiltersState = {
  // значения
  startDateRange: DateRange;
  archivationDateRange: DateRange;
  archivation: 0 | 1 | null;
  searchTerm: string;

  // UI состояния попапов
  isStartDateOpen: boolean;
  isArchivationDateOpen: boolean;
  isArchivationOpen: boolean;
};

export type FiltersActions = {
  setStartDateRange: (range: DateRange) => void;
  setArchivationDateRange: (range: DateRange) => void;
  setArchivation: (v: 0 | 1 | null) => void;
  setSearchTerm: (v: string) => void;

  setIsStartDateOpen: (v: boolean) => void;
  setIsArchivationDateOpen: (v: boolean) => void;
  setIsArchivationOpen: (v: boolean) => void;

  reset: () => void;
};
