import cn from "classnames";
import React, { useRef } from "react";

import SearchIcon from "@/assets/icons/search.svg?react";
import { useFiltersStore } from "@/entities/filters";

import cls from "./Search.module.css";

type SearchProps = {
  placeholder?: string;
  value?: string;
  setValue?: (v: string) => void;
  style?: "default" | "noshadow";
};

export const Search: React.FC<SearchProps> = ({
  placeholder,
  value,
  setValue,
  style = "default",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const storeValue = useFiltersStore((s) => s.searchTerm);
  const storeSetValue = useFiltersStore((s) => s.setSearchTerm);

  const isLocalControlled =
    typeof value === "string" && typeof setValue === "function";

  const currentValue = isLocalControlled ? value : storeValue;
  const effectivePlaceholder = placeholder ?? "Поиск";

  const handleChange = (next: string) => {
    if (isLocalControlled) {
      setValue(next);
    } else {
      storeSetValue(next);
    }
  };

  const handleWrapperClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        cls.wrapper,
        style == "noshadow" && cls.wrapper_NoBorder,
        !!currentValue && cls.wrapper_Active
      )}
      onClick={handleWrapperClick}
    >
      <SearchIcon className={cls.searchIcon} />
      <input
        ref={inputRef}
        className={cls.input}
        placeholder={effectivePlaceholder}
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};