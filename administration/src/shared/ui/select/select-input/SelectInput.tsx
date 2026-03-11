import axios from "axios";
import cn from "classnames";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import PlusIcon from "@/assets/icons/plus.svg?react";
import SearchIcon from "@/assets/icons/search.svg?react";
import NothingFoundImg from "@/assets/app/404.png";
import ErrorForbiddenImg from "@/assets/app/403.png";
import ServerErrorImg from "@/assets/app/500.png";
import NetworkErrorImg from "@/assets/app/network-error.png";

import { useClickOutside } from "@/shared/lib/react";
import { Button } from "@/shared/ui";
import { Loader } from "@/widgets/loader";

import cls from "./SelectInput.module.css";

export type SelectItem = {
  id: number;
  img?: string;
  title?: string;
  secTitle?: string[] | string;

  textColor?: string;
  bgColor?: string;
};

type Props = {
  placeholder?: string;
  data: SelectItem[];
  selected: number[];
  onChange: (next: number[]) => void;

  search: string;
  onSearchChange: (v: string) => void;

  onCreateClick?: () => void;

  popoverHeight?: string;
  popoverWidth?: string;

  isMulti?: boolean;
  isCleareble?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
};

export const SelectInput: React.FC<Props> = ({
  placeholder,
  data,
  selected,
  onChange,
  search,
  onSearchChange,
  popoverHeight,
  onCreateClick,
  popoverWidth = "100%",
  isMulti = false,
  isCleareble = false,
  disabled = false,
  isLoading = false,
  isError = false,
  error,
}) => {
  const placeholderText = placeholder ?? "Выберите";
  const rootRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // автофокус поиска при открытии
  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [isOpen]);

  useClickOutside(rootRef, () => setIsOpen(false));

  // мап выбранных элементов для чипсов триггера
  const selectedItems: SelectItem[] = useMemo(() => {
    if (!selected?.length) return [];
    const map = new Map<number, SelectItem>(data.map((d) => [d.id, d]));
    return selected.map(
      (id) => map.get(id) ?? ({ id, title: String(id) } as SelectItem)
    );
  }, [data, selected]);

  const toggle = useCallback(
    (id: number) => {
      if (isMulti) {
        const next = selected.includes(id)
          ? selected.filter((x) => x !== id)
          : [...selected, id];
        onChange(next);
      } else {
        onChange([id]);
        setIsOpen(false);
      }
    },
    [isMulti, onChange, selected]
  );

  const canShowReset = (isMulti || isCleareble) && selectedItems.length > 0;
  const hasError = Boolean(isError || error);

  return (
    <div
      ref={rootRef}
      className={cn(cls.filter, { [cls.filterActive]: isOpen })}
    >
      <Button
        type="button"
        className={cn(
          cls.trigger,
          { [cls.trigger__active]: isOpen},
          { [cls.triggerSelected]: selectedItems.length },
          { [cls.filterDisabled]: disabled }
        )}
        disabled={disabled}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((v) => !v);
          }
        }}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={placeholderText}
      >
        <div className={cls.inputWrapper}>
          {selectedItems.length ? (
            <div className={cls.chips}>
              {selectedItems.map((item) => {
                const chipStyle = item.bgColor
                  ? { backgroundColor: item.bgColor, padding: "4px 10px" }
                  : undefined;
                const chipTextStyle = item.textColor
                  ? { color: item.textColor }
                  : undefined;

                return (
                  <span
                    key={item.id}
                    className={cn(
                      cls.overlayChip,
                      isMulti && cls.overlayChip__Multi
                    )}
                    style={chipStyle}
                  >
                    {item.img && (
                      <img
                        className={cls.overlayAvatar}
                        src={item.img}
                        alt=""
                      />
                    )}
                    <span className={cls.overlayText} style={chipTextStyle}>
                      {item.title || `ID ${item.id}`}
                    </span>
                  </span>
                );
              })}
            </div>
          ) : (
            <span className={cls.placeholder}>{placeholderText}</span>
          )}
        </div>
      </Button>

      {isOpen && (
        <div
          className={cls.popover}
          role="dialog"
          aria-label={placeholderText}
          style={{ maxHeight: popoverHeight, width: popoverWidth }}
        >
          {/* Поиск */}
          <div className={cls.searchRow}>
            <div className={cls.searchField}>
              <SearchIcon className={cls.searchIcon} />
              <input
                ref={searchInputRef}
                className={cls.searchInputDynamic}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Поиск"
              />
            </div>
            {onCreateClick && (
              <Button
                type="button"
                title="Создать"
                className={cls.searchActionButton}
                onClick={() => {
                  setIsOpen(false);
                  onCreateClick?.();
                }}
              >
                <PlusIcon className={cls.searchActionIcon} />
              </Button>
            )}
          </div>

          {/* Список / состояния */}
          <div className={cls.listSection}>
            {/* Загрузка */}
            {isLoading && !hasError && (
              <div className={cls.messageBlock}>
                <Loader
                  size={30}
                  strokeWidth={6}
                />
              </div>
            )}

            {/* Ошибка */}
            {hasError && (
              <div className={cls.messageBlock}>
                <img
                  alt="Ошибка"
                  className={cls.messageImg}
                  src={axios.isAxiosError(error) && error.response?.status === 403 ? ErrorForbiddenImg :
                    axios.isAxiosError(error) && error.response?.status === 500 ? ServerErrorImg :
                      axios.isAxiosError(error) && error.response?.status === 503 ? NetworkErrorImg :
                        NetworkErrorImg}
                />
                {axios.isAxiosError(error) && (
                  <p className={cls.messageText}>
                    {error.response?.status === 403 ? "Доступ запрещен" : error.response?.status === 500 ? "Ошибка сервера" : error.response?.status === 503 ? "Сетевая ошибка" : error.message}
                  </p>
                )}
              </div>
            )}

            {/* Ничего не найдено */}
            {!hasError && !isLoading && data.length === 0 && (
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

            {!hasError && !isLoading && data.length > 0 && (
              <ul
                className={cls.list}
                role={isMulti ? "listbox" : "menu"}
                aria-multiselectable={isMulti || undefined}
              >
                {data.map((item, idx) => {
                  const id = item.id;
                  const checked = selected.includes(id);
                  const inputId = `opt-${id}`;

                  const rowTextStyle = item.textColor
                    ? { color: item.textColor }
                    : undefined;
                  const textBlockStyle = item.bgColor
                    ? { backgroundColor: item.bgColor, padding: "5px 10px" }
                    : undefined;

                  return (
                    <li
                      key={idx}
                      className={cn(cls.item, isMulti && cls.multi)}
                      onClick={() => toggle(id)}
                      role={isMulti ? "checkbox" : "menuitem"}
                      aria-checked={isMulti ? checked : undefined}
                      tabIndex={0}
                    >
                      {isMulti && (
                        <input
                          id={inputId}
                          type="checkbox"
                          className={cls.checkbox}
                          checked={checked}
                          readOnly
                        />
                      )}

                      <label
                        htmlFor={inputId}
                        className={cls.itemLabel}
                        onClick={(e) => e.preventDefault()}
                      >
                        {item.img && (
                          <img className={cls.avatar} src={item.img} alt="" />
                        )}
                        <div
                          className={cls.itemTextContent}
                          style={textBlockStyle}
                        >
                          <p className={cls.itemText} style={rowTextStyle}>
                            {item.title || `ID ${id}`}
                          </p>
                          {item.secTitle && Array.isArray(item.secTitle) ? (
                            <div className={cls.permissionsList}>
                              {item.secTitle.map((perm, index) => (
                                <p key={index} className={cls.itemSecText} style={rowTextStyle}>
                                  {perm}
                                  {index < (item.secTitle?.length ?? 0) - 1 && <br />}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className={cls.itemSecText} style={rowTextStyle}>
                              {item.secTitle}
                            </p>
                          )}
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Кнопки */}
          {canShowReset && (
            <div className={cls.actions}>
              <div className={cls.actionsRow}>
                {canShowReset && (
                  <Button
                    className={cls.btn}
                    variant="gray"
                    onClick={() => {
                      onChange([]);
                      onSearchChange("");
                      setIsOpen(false);
                    }}
                  >
                    Сбросить
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
