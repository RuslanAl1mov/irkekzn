import type { IProduct } from "@/entities/product";
import type { IProductCategory } from "@/entities/product-category";
import type { IShop } from "@/entities/shop";
import type { ISize } from "@/entities/size";

export type DateRange = [Date | null, Date | null];

export type FiltersState = {
  // значения
  startDateRange: DateRange;
  archivationDateRange: DateRange;
  archivation: 0 | 1 | null;
  searchTerm: string;

  productFilter: IProduct[];
  productCategoryFilter: IProductCategory[];
  sizeFilter: ISize[];
  shopFilter: IShop[];

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

  setProductFilter: (items: IProduct[]) => void;
  setProductCategoryFilter: (items: IProductCategory[]) => void;
  setSizeFilter: (items: ISize[]) => void;
  setShopFilter: (items: IShop[]) => void;

  setIsStartDateOpen: (v: boolean) => void;
  setIsArchivationDateOpen: (v: boolean) => void;
  setIsArchivationOpen: (v: boolean) => void;

  reset: () => void;
};
