import { createContext, useEffect, useState, ReactNode } from "react";

const STORAGE_KEY = "ards_crm_backend-administration-user_filters";

export interface FiltersState {
  dateRange: [Date | null, Date | null];
  selectedProductCategories: (string | number)[];
  selectedProductTags: (string | number)[];
  productSearchText: string;
  categorySearchText: string;
  callRequestSearchText: string;
  productTagSearchText: string;
  minPrice: string;
  maxPrice: string;
}

export interface FiltersContextType extends FiltersState {
  isDateOpen: boolean;
  setIsDateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCategoryOpen: boolean;
  setIsCategoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTagOpen: boolean;
  setIsTagOpen: React.Dispatch<React.SetStateAction<boolean>>;

  setDateRange: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>;
  setSelectedProductCategories: React.Dispatch<React.SetStateAction<(string | number)[]>>;
  setSelectedProductTags: React.Dispatch<React.SetStateAction<(string | number)[]>>;
  setProductSearchText: React.Dispatch<React.SetStateAction<string>>;
  setCategorySearchText: React.Dispatch<React.SetStateAction<string>>;
  setCallRequestSearchText: React.Dispatch<React.SetStateAction<string>>;
  setProductTagSearchText: React.Dispatch<React.SetStateAction<string>>;
  setMinPrice: React.Dispatch<React.SetStateAction<string>>;
  setMaxPrice: React.Dispatch<React.SetStateAction<string>>;
}

export const FiltersContext = createContext<FiltersContextType | null>(null);

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const loadInitialState = (): FiltersState => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return {
          dateRange: [null, null],
          selectedProductCategories: [],
          selectedProductTags: [],
          productSearchText: "",
          categorySearchText: "",
          callRequestSearchText: "",
          productTagSearchText: "",
          minPrice: "",
          maxPrice: "",
        };
      }
      const parsed = JSON.parse(raw);

      return {
        dateRange:
          Array.isArray(parsed.dateRange) && parsed.dateRange.length === 2
            ? [
                parsed.dateRange[0] ? new Date(parsed.dateRange[0]) : null,
                parsed.dateRange[1] ? new Date(parsed.dateRange[1]) : null,
              ]
            : [null, null],
        selectedProductCategories: Array.isArray(parsed.selectedProductCategories)
          ? parsed.selectedProductCategories
          : [],
        selectedProductTags: Array.isArray(parsed.selectedProductTags)
          ? parsed.selectedProductTags
          : [],
        productSearchText: typeof parsed.productSearchText === "string" ? parsed.productSearchText : "",
        categorySearchText: typeof parsed.categorySearchText === "string" ? parsed.categorySearchText : "",
        callRequestSearchText: typeof parsed.callRequestSearchText === "string" ? parsed.callRequestSearchText : "",
        productTagSearchText: typeof parsed.productTagSearchText === "string" ? parsed.productTagSearchText : "",
        minPrice: typeof parsed.minPrice === "string" ? parsed.minPrice : "",
        maxPrice: typeof parsed.maxPrice === "string" ? parsed.maxPrice : "",
      };
    } catch (e) {
      console.error("Ошибка при чтении фильтров из localStorage:", e);
      return {
        dateRange: [null, null],
        selectedProductCategories: [],
        selectedProductTags: [],
        productSearchText: "",
        categorySearchText: "",
        callRequestSearchText: "",
        productTagSearchText: "",
        minPrice: "",
        maxPrice: "",
      };
    }
  };

  const initial = loadInitialState();

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(initial.dateRange);
  const [selectedProductCategories, setSelectedProductCategories] = useState<(string | number)[]>(initial.selectedProductCategories);
  const [selectedProductTags, setSelectedProductTags] = useState<(string | number)[]>(initial.selectedProductTags);
  const [productSearchText, setProductSearchText] = useState(initial.productSearchText);
  const [categorySearchText, setCategorySearchText] = useState(initial.categorySearchText);
  const [callRequestSearchText, setCallRequestSearchText] = useState(initial.callRequestSearchText);
  const [productTagSearchText, setProductTagSearchText] = useState(initial.productTagSearchText);
  const [minPrice, setMinPrice] = useState(initial.minPrice);
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice);

  useEffect(() => {
    const toStore = {
      dateRange: dateRange.map((d) => (d ? d.toISOString() : null)),
      selectedProductCategories,
      selectedProductTags,
      productSearchText,
      categorySearchText,
      callRequestSearchText,
      productTagSearchText,
      minPrice,
      maxPrice,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (e) {
      console.error("Не удалось сохранить фильтры в localStorage:", e);
    }
  }, [
    dateRange,
    selectedProductCategories,
    selectedProductTags,
    productSearchText,
    categorySearchText,
    callRequestSearchText,
    productTagSearchText,
    minPrice,
    maxPrice,
  ]);

  return (
    <FiltersContext.Provider
      value={{
        isDateOpen,
        setIsDateOpen,
        isCategoryOpen,
        setIsCategoryOpen,
        isTagOpen,
        setIsTagOpen,
        dateRange,
        setDateRange,
        selectedProductCategories,
        setSelectedProductCategories,
        selectedProductTags,
        setSelectedProductTags,
        productSearchText,
        setProductSearchText,
        categorySearchText,
        setCategorySearchText,
        callRequestSearchText,
        setCallRequestSearchText,
        productTagSearchText,
        setProductTagSearchText,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};
