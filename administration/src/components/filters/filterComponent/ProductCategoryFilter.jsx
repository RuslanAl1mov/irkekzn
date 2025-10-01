import React, { useContext, useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import "./AppFilters.css";
import "./ProductCategoryFilter.css";
import Checkbox from "../../inputs/checkbox/Checkbox";
import CenteredCircularLoader from "../../loaders/centeredCircularLoader/CenteredCircularLoader";
import { FiltersContext } from "../../../context/FiltersContext";
import ScreenBlur from "../../content/ScreenBlur";
import { getProductCategoryList } from "../../../api/admin";


const ProductCategoryFilter = ({ label = "Категории" }) => {
  const wrapperRef = useRef(null);
  const {
    isCategoryOpen,
    setIsCategoryOpen,
    selectedProductCategories,
    setSelectedProductCategories,
  } = useContext(FiltersContext);

  const [tempSelected, setTempSelected] = useState([]);
  const [search, setSearch] = useState("");

  // Синхронизируем временный state с контекстом при открытии фильтра
  useEffect(() => {
    if (isCategoryOpen) {
      setTempSelected(selectedProductCategories);
      setSearch("");
    }
  }, [isCategoryOpen, selectedProductCategories]);

  // Загружаем список АМ (кэш 10 часов)
  const { data: accountManagersOptions = { result: [] }, error, isLoading } = useQuery({
    queryKey: ["ProductCategoryList"],
    queryFn: () => getProductCategoryList(["id", "name", "photo"]),
    staleTime: 10 * 60 * 60 * 1000,
    cacheTime: 10 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: isCategoryOpen,
  });

  // Закрываем фильтр кликом вне блока
  useEffect(() => {
    if (!isCategoryOpen) return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [isCategoryOpen, setIsCategoryOpen]);

  // Тоглим выбор в tempSelected
  const toggle = useCallback((id) => {
    setTempSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, []);

  const handleSearchChange = useCallback((e) => setSearch(e.target.value), []);

  // Фильтрация по поиску
  const filteredOptions = useMemo(() => {
    if (!accountManagersOptions.result) return [];
    const lower = search.trim().toLowerCase();
    if (!lower) return accountManagersOptions.result;
    return accountManagersOptions.result.filter(({ name }) =>
      `${name}`.toLowerCase().includes(lower)
    );
  }, [accountManagersOptions, search]);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {isCategoryOpen && <ScreenBlur />} {/* затемняем экран */}
      <div ref={wrapperRef} className={`fcb-component-filter-block ${isCategoryOpen && "fcb-component-filter-block--active"}`} style={{ zIndex: 95 }}>
        {/* Кликер */}
        <div className={`fcb-component-filter-block-clicker ${selectedProductCategories.length > 0 && "fcb-component-filter-block-clicker--selected"}`}
          onClick={() => { setIsCategoryOpen((prev) => !prev); }}
        >
          <p>{label}</p>
          {selectedProductCategories.length > 0 && (
            <div className="fcb-component-filter-counter">
              {selectedProductCategories.length}
            </div>
          )}
          {/* стрелочка */}
          <svg className="fcb-component-arrowdown-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
            <path d="M11.1913 0.279313C10.9958 0.100415 10.7314 0 10.4557 0C10.18 0 9.91553 0.100415 9.72002 0.279313L5.97391 3.67957L2.27997 0.279313C2.08446 0.100415 1.81999 0 1.54432 0C1.26864 0 1.00417 0.100415 0.808661 0.279313C0.710857 0.368606 0.633227 0.474841 0.580251 0.59189C0.527275 0.708939 0.5 0.834485 0.5 0.961285C0.5 1.08809 0.527275 1.21363 0.580251 1.33068C0.633227 1.44773 0.710857 1.55396 0.808661 1.64326L5.23304 5.71588C5.33004 5.80591 5.44545 5.87736 5.57261 5.92613C5.69977 5.97489 5.83616 6 5.97391 6C6.11166 6 6.24805 5.97489 6.37521 5.92613C6.50237 5.87736 6.61778 5.80591 6.71479 5.71588L11.1913 1.64326C11.2891 1.55396 11.3668 1.44773 11.4197 1.33068C11.4727 1.21363 11.5 1.08809 11.5 0.961285C11.5 0.834485 11.4727 0.708939 11.4197 0.59189C11.3668 0.474841 11.2891 0.368606 11.1913 0.279313Z" />
          </svg>
        </div>

        {/* Выпадающий фильтр */}
        <div className={`fcb-component-abs-block ${isCategoryOpen && "fcb-component-abs-block--show catf-component-settings"}`}>
          <div className="fcb-component-abs-content-block">
            <p>{label}</p>

            <div className="fcb-component-abs-search-block">
              <svg className="fcb-search-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M11.8315 10.9847L9.60683 8.77796C10.4704 7.70125 10.8886 6.33459 10.7754 4.95901C10.6623 3.58343 10.0264 2.30348 8.9985 1.38235C7.97062 0.461211 6.62888 -0.0310938 5.24917 0.00666005C3.86946 0.0444138 2.55665 0.609357 1.58069 1.58532C0.604718 2.56129 0.0397752 3.8741 0.00202138 5.25381C-0.0357324 6.63352 0.456573 7.97526 1.37771 9.00314C2.29884 10.031 3.57879 10.6669 4.95437 10.7801C6.32996 10.8932 7.69661 10.475 8.77332 9.61147L10.98 11.8182C11.0358 11.8744 11.1021 11.919 11.1752 11.9494C11.2482 11.9799 11.3266 11.9955 11.4058 11.9955C11.4849 11.9955 11.5633 11.9799 11.6364 11.9494C11.7094 11.919 11.7758 11.8744 11.8315 11.8182C11.9396 11.7063 12 11.5569 12 11.4014C12 11.2459 11.9396 11.0965 11.8315 10.9847ZM5.40932 9.61147C4.57914 9.61147 3.76759 9.36529 3.07732 8.90406C2.38704 8.44283 1.84904 7.78727 1.53134 7.02028C1.21364 6.25329 1.13051 5.40931 1.29247 4.59507C1.45444 3.78083 1.85421 3.03291 2.44124 2.44588C3.02827 1.85885 3.7762 1.45907 4.59043 1.29711C5.40467 1.13515 6.24865 1.21828 7.01564 1.53597C7.78263 1.85367 8.4382 2.39168 8.89942 3.08195C9.36065 3.77223 9.60683 4.58378 9.60683 5.41396C9.60683 6.52721 9.16459 7.59486 8.37741 8.38205C7.59022 9.16923 6.52257 9.61147 5.40932 9.61147Z" />
              </svg>
              <input className="fcb-filter-search" type="text" placeholder="Найти категорию" value={search} onChange={handleSearchChange} />
            </div>

            <div className="fcb-abs-filter-list-block">
              {!isLoading ? (
                <>
                  <ul>
                    {filteredOptions.map(({ id, name, photo }) => {
                      const checked = tempSelected.includes(id);
                      return (
                        <li key={id} className="list-item" onClick={() => toggle(id)}>
                          <Checkbox value={checked} />
                          <div className="list-item__filter-data-block">
                            {photo && (<img alt="fcb-filter-img" className="fcb-user-photo" src={photo} />)}
                            <span>{`${name ? name : "-"}`}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="fcb-filter-submit-block">
                    <div className="fcb-filter-submit-btns-block">
                      <button className="fcb-submit-filter-button fcb-submit-filter-button--active"
                        onClick={() => {
                          setSelectedProductCategories(tempSelected);
                          setIsCategoryOpen(false);
                        }}
                      >
                        Принять
                      </button>
                      <button
                        className="fcb-submit-filter-button"
                        onClick={() => {
                          setTempSelected([]);
                          setSelectedProductCategories([]);
                          setSearch("");
                          setIsCategoryOpen(false);
                        }}
                      >
                        Сбросить
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <CenteredCircularLoader className="cteb-loader-margin" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryFilter;
