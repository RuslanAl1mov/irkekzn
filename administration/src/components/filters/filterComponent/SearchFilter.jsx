import React, { useContext, useState, useEffect } from "react";
import "./AppFilters.css";
import "./SearchFilter.css";
import { FiltersContext } from "../../../context/FiltersContext";

const SearchFilter = ({
  searchType,
  label = "Поиск",
  value: controlledValue,
  setValue: controlledSetValue,
  className = ""
}) => {
  // получаем из контекста все три типа поискового текста и их сеттеры
  const {
    productSearchText,
    setProductSearchText,
    categorySearchText,
    setCategorySearchText,
    callRequestSearchText,
    setCallRequestSearchText,
    productTagSearchText,
    setProductTagSearchText,
  } = useContext(FiltersContext);

  // выбираем текущее значение и функцию установки по типу поиска
  const valueMap = {
    product: productSearchText,
    category: categorySearchText,
    callRequest: callRequestSearchText,
    productTag: productTagSearchText
  };
  const setterMap = {
    product: setProductSearchText,
    category: setCategorySearchText,
    callRequest: setCallRequestSearchText,
    productTag: setProductTagSearchText
  };

  const contextValue = valueMap[searchType] ?? "";
  const setContextValue = setterMap[searchType] ?? (() => { });

  // определяем, контролируемый ли режим
  const isControlled = typeof controlledSetValue === "function";

  // локальный стейт для неконтролируемого режима
  const [localText, setLocalText] = useState(contextValue);

  // при изменении контекстного значения обновляем локальный (если не в контроле)
  useEffect(() => {
    if (!isControlled) {
      setLocalText(contextValue);
    }
  }, [contextValue, isControlled]);

  // обработчик ввода
  const handleChange = (e) => {
    const val = e.target.value;
    if (isControlled) {
      // контролируемый режим: зовём внешний колбэк
      controlledSetValue(val);
    } else {
      // неконтролируемый: обновляем локальный и контекстный стейт
      setLocalText(val);
      setContextValue(val);
    }
  };

  // значение для рендера: из пропсов или локального стейта
  const inputValue = isControlled ? controlledValue : localText;

  return (
    <div className={`fcb-component-filter-block ${className}`}>
      <div
        className={
          `fcb-component-filter-block-clicker fcb-sf-search-filter-block` +
          (inputValue ? " fcb-sf-search-filter-block--inserted" : "")
        }
      >
        <svg
          className="fcb-sf-search-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
        >
          <path d="M11.8315 10.9846L9.60683 8.77787C10.4704 7.70116 10.8886 6.3345 10.7754 4.95892C10.6623 3.58334 10.0264 2.30339 8.9985 1.38225C7.97062 0.46112 6.62888 -0.0311853 5.24917 0.0065685C3.86946 0.0443223 2.55665 0.609265 1.58069 1.58523C0.604718 2.5612 0.0397752 3.87401 0.00202138 5.25372C-0.0357324 6.63343 0.456573 7.97517 1.37771 9.00305C2.29884 10.0309 3.57879 10.6668 4.95437 10.78C6.32996 10.8931 7.69661 10.4749 8.77332 9.61138L10.98 11.8181C11.0358 11.8743 11.1021 11.9189 11.1752 11.9493C11.2482 11.9798 11.3266 11.9954 11.4058 11.9954C11.4849 11.9954 11.5633 11.9798 11.6364 11.9493C11.7094 11.9189 11.7758 11.8743 11.8315 11.8181C11.9396 11.7063 12 11.5568 12 11.4013C12 11.2458 11.9396 11.0964 11.8315 10.9846ZM5.40932 9.61138C4.57914 9.61138 3.76759 9.3652 3.07732 8.90397C2.38704 8.44274 1.84904 7.78718 1.53134 7.02019C1.21364 6.25319 1.13051 5.40922 1.29247 4.59498C1.45444 3.78074 1.85421 3.03282 2.44124 2.44579C3.02827 1.85876 3.7762 1.45898 4.59043 1.29702C5.40467 1.13506 6.24865 1.21818 7.01564 1.53588C7.78263 1.85358 8.4382 2.39159 8.89942 3.08186C9.36065 3.77214 9.60683 4.58368 9.60683 5.41387C9.60683 6.52712 9.16459 7.59477 8.37741 8.38196C7.59022 9.16914 6.52257 9.61138 5.40932 9.61138Z" />
        </svg>
        <input
          name="search-filter"
          className="fcb-sf-search-filter-input"
          type="text"
          placeholder={label}
          value={inputValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default SearchFilter;
