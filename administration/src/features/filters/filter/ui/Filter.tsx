import axios from "axios";
import cn from "classnames";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import ArrowIcon from "@/assets/icons/listArrow.svg?react";
import SearchIcon from "@/assets/icons/search.svg?react";
import NothingFoundImg from "@/assets/app/404.png";
import ErrorImg from "@/assets/app/500.png";
import UserImage from "@/assets/app/user.jpg";
import { useClickOutside } from "@/shared/lib/react";
import { Button } from "@/shared/ui";
import { Loader } from "@/widgets/loader";

import cls from "./Filter.module.css";

export type FilterItem = {
  id: number;
  img?: string;
  title?: string;
  secTitle?: string;

  textColor?: string;
  bgColor?: string;
};

export type FilterProps = {
  label?: string;
  data?: FilterItem[];

  selected: number[];
  onChange: (next: number[]) => void;

  /** Управляемый поиск */
  search?: string;
  onSearchChange?: (q: string) => void;
  triggerStyle?: "shadowed" | "bordered" | undefined;

  isMulti?: boolean;
  isCleareble?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
};

export const Filter: React.FC<FilterProps> = ({
  label,
  data,
  selected,
  onChange,

  /** управляемые пропы поиска */
  search = "",
  onSearchChange,

  triggerStyle = "shadowed",

  isMulti = true,
  isCleareble = false,
  disabled = false,
  isLoading = false,
  isError = false,
  error,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const labelText = label ?? "Фильтр";

  // локальное открытие/закрытие поповера
  const [isOpen, setIsOpen] = useState(false);

  // временный выбор, чтобы применять по кнопке "Apply"
  const [tempSelected, setTempSelected] = useState<number[]>(selected);

  // При открытии — синк временного выбора
  useEffect(() => {
    if (isOpen) setTempSelected(selected);
  }, [isOpen, selected]);

  useClickOutside(rootRef, () => setIsOpen(false));

  // Список отображаем как есть — без локальной фильтрации
  const list: FilterItem[] = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  // Выбор элемента (с учетом isMulti)
  const toggle = useCallback(
    (id: number) => {
      setTempSelected((prev) => {
        const isChecked = prev.includes(id);
        if (isMulti) {
          return isChecked ? prev.filter((x) => x !== id) : [...prev, id];
        }
        return isChecked ? [] : [id];
      });
    },
    [isMulti]
  );

  const handleApply = useCallback(() => {
    onChange(tempSelected);
    setIsOpen(false);
  }, [onChange, tempSelected]);

  const handleReset = useCallback(() => {
    setTempSelected([]);
    onChange([]);
    // поиск теперь контролируемый — обнуляем его только если передан коллбэк
    onSearchChange?.("");
    setIsOpen(false);
  }, [onChange, onSearchChange]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = UserImage;
  };

  const hasError = Boolean(error) || isError;

  return (
    <div ref={rootRef} className={cn(cls.filter, isOpen && cls.filterActive)}>
      <button
        type="button"
        className={cn(
          cls.trigger,
          selected.length && cls.triggerSelected,
          triggerStyle == "bordered" && cls.trigger_Bordered
        )}
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="filter-popover"
        disabled={disabled}
      >
        <p className={cls.triggerLabel}>{labelText}</p>
        {selected.length > 0 && (
          <span className={cls.counterBadge}>{selected.length}</span>
        )}
        <ArrowIcon className={cls.chevronIcon} />
      </button>

      {isOpen && (
        <div
          id="filter-popover"
          className={cls.popover}
          role="dialog"
          aria-label={labelText}
        >
          <div className={cls.titleBlock}>
            <p className={cls.popoverTitle}>{labelText}</p>

            <div className={cls.searchRow}>
              <SearchIcon className={cls.searchIcon} />
              <input
                className={cls.searchInput}
                placeholder="Поиск"
                value={search}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          </div>

          <div className={cls.listSection}>
            {/* Загрузка */}
            {!hasError && isLoading && (
              <div className={cls.messageBlock}>
                <Loader
                  size={28}
                  color="var(--blue)"
                  strokeWidth={5}
                />
              </div>
            )}

            {/* Ошибка */}
            {hasError && (
              <div className={cls.messageBlock}>
                <img
                  alt="Ошибка"
                  className={cls.messageImg}
                  src={ErrorImg}
                />
                {error && axios.isAxiosError(error) ? (
                  <p className={cls.messageText}>
                    {error.response?.data?.detail ?? error.message}
                  </p>
                ) : (
                  <p className={cls.messageText}>
                    Произошла ошибка
                  </p>
                )}
              </div>
            )}

            {/* Ничего не найдено */}
            {!hasError && !isLoading && list.length === 0 && (
              <div className={cls.messageBlock}>
                <img
                  alt="Ничего не найдено"
                  className={cls.messageImg}
                  src={NothingFoundImg}
                />
                <p className={cls.messageText}>
                  Ничего не найдено
                </p>
              </div>
            )}

            {/* Список */}
            {!hasError && !(isLoading && !data) && list.length > 0 && (
              <>
                <ul className={cls.list}>
                  {list.map(
                    ({ id, title, secTitle, img, textColor, bgColor }) => {
                      const inputId = `item-${id}`;
                      const checked = tempSelected.includes(id);

                      const textStyle = textColor
                        ? { color: textColor }
                        : undefined;
                      const blockStyle = {
                        backgroundColor: bgColor,
                        padding: "5px 10px",
                      };
                      return (
                        <li
                          key={id}
                          className={cls.item}
                          onClick={() => toggle(id)}
                          role="checkbox"
                          aria-checked={checked}
                          tabIndex={0}
                        >
                          <input
                            id={inputId}
                            type="checkbox"
                            className={cls.checkbox}
                            checked={checked}
                            readOnly
                            aria-label={title || secTitle || String(id)}
                          />

                          <label
                            htmlFor={inputId}
                            className={cls.itemLabel}
                            onClick={(e) => e.preventDefault()}
                          >
                            {img && (
                              <img
                                className={cls.itemAvatar}
                                src={img}
                                alt=""
                                aria-hidden="true"
                                onError={handleImageError}
                              />
                            )}

                            <div
                              className={cls.itemTextContent}
                              title={title}
                              style={blockStyle}
                            >
                              {title && (
                                <p
                                  className={cls.itemTitleText}
                                  title={title}
                                  style={textStyle}
                                >
                                  {title}
                                </p>
                              )}
                              {secTitle && (
                                <span
                                  className={cls.itemSubText}
                                  title={secTitle}
                                >
                                  {secTitle}
                                </span>
                              )}
                            </div>
                          </label>
                        </li>
                      );
                    }
                  )}
                </ul>

                <div className={cls.actions}>
                  <div className={cls.actionsRow}>
                    <Button onClick={handleApply} disabled={disabled}>
                      Применить
                    </Button>

                    {isCleareble && (
                      <Button
                        variant="gray"
                        onClick={handleReset}
                        disabled={disabled}
                      >
                        Сбросить
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
