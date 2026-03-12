import "react-datepicker/dist/react-datepicker.css";

import cn from "classnames";
import {
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { ru } from "date-fns/locale";
import React, { useEffect, useMemo, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";

import ArrowIcon from "@/assets/icons/listArrow.svg?react";
import { useFiltersStore } from "@/entities/filters";
import { useClickOutside } from "@/shared/lib/react";
import { Button } from "@/shared/ui";

import cls from "./DateFilter.module.css";

registerLocale("en", enUS);
registerLocale("ru", ru);

type DateRange = [Date | null, Date | null];

type Props = {
  label?: string;
  /** Локально контролируемый диапазон */
  value?: DateRange;
  setValue?: (range: DateRange) => void;
  /** Локально контролируемое открытие поповера */
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  style?: "default" | "bordered" | "noshadow";
  className?: string;
  type: "start" | "archivation";
};

export const DateFilter: React.FC<Props> = ({
  label,
  value,
  setValue,
  isOpen,
  setIsOpen,
  style = "default",
  className,
  type,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // ----- Глобальный стор (fallback, если пропсов нет) -----
  let storeIsOpen: boolean;
  let storeSetIsOpen: (open: boolean) => void;
  let storeRange: DateRange;
  let storeSetRange: (range: DateRange) => void;
  let labelAriaText: string;

  if (type === "start") {
    storeIsOpen = useFiltersStore((s) => s.isStartDateOpen);
    storeSetIsOpen = useFiltersStore((s) => s.setIsStartDateOpen);
    storeRange = useFiltersStore((s) => s.startDateRange);
    storeSetRange = useFiltersStore((s) => s.setStartDateRange);
    labelAriaText = label ?? "Дата старта";
  } else if (type === "archivation") {
    storeIsOpen = useFiltersStore((s) => s.isArchivationDateOpen);
    storeSetIsOpen = useFiltersStore((s) => s.setIsArchivationDateOpen);
    storeRange = useFiltersStore((s) => s.archivationDateRange);
    storeSetRange = useFiltersStore((s) => s.setArchivationDateRange);
    labelAriaText = label ?? "Дата архивации";
  } else {
    throw new Error(`Invalid type: ${type}`);
  }

  // ----- Режимы -----
  const isRangeControlled =
    Array.isArray(value) && typeof setValue === "function";
  const isOpenControlled =
    typeof isOpen === "boolean" && typeof setIsOpen === "function";

  // Источник правды
  const effectiveOpen = isOpenControlled ? isOpen : storeIsOpen;
  const effectiveRange = isRangeControlled ? value : storeRange;

  // Временное состояние выбора
  const [tempRange, setTempRange] = useState<DateRange>([null, null]);
  const [startDate, endDate] = tempRange;

  // Синхронизация tempRange при открытии
  useEffect(() => {
    if (effectiveOpen) setTempRange(effectiveRange);
  }, [effectiveOpen, effectiveRange]);

  const triggerText = useMemo(() => {
    const [from, to] = effectiveRange;
    if (from && to) {
      if (isSameDay(from, to)) return format(from, "dd.MM.yyyy");
      return `${format(from, "dd.MM.yyyy")} – ${format(to, "dd.MM.yyyy")}`;
    }
    if (from) return format(from, "dd.MM.yyyy");
    return labelAriaText;
  }, [effectiveRange, labelAriaText]);

  // Пресеты
  const today = new Date();
  const handlePreset = (preset: string) => {
    let newRange: DateRange = [null, null];
    switch (preset) {
      case "today":
        newRange = [today, null];
        break;
      case "yesterday":
        newRange = [subDays(today, 1), null];
        break;
      case "thisWeek":
        newRange = [startOfWeek(today), endOfWeek(today)];
        break;
      case "lastWeek":
        newRange = [
          subDays(startOfWeek(today), 7),
          subDays(endOfWeek(today), 7),
        ];
        break;
      case "thisMonth":
        newRange = [startOfMonth(today), endOfMonth(today)];
        break;
      case "lastMonth":
        newRange = [
          startOfMonth(subMonths(today, 1)),
          endOfMonth(subMonths(today, 1)),
        ];
        break;
      case "lastQuarter":
        newRange = [startOfMonth(subMonths(today, 3)), today];
        break;
      default:
        newRange = [null, null];
    }
    setTempRange(newRange);
  };

  // Нормализация выбора
  const normalizeRange = ([start, end]: DateRange): DateRange => {
    if (!start && !end) return [null, null];
    if (start && end && isSameDay(start, end)) return [start, null];
    return [start || null, end || null];
  };

  const close = () =>
    isOpenControlled ? setIsOpen(false) : storeSetIsOpen(false);

  useClickOutside(rootRef, () => close());

  // Применение
  const applyRange = (range: DateRange) => {
    const [from, to] = range;
    const next: DateRange = [from ?? null, to ?? from ?? null];

    if (isRangeControlled) {
      (setValue as (r: DateRange) => void)(next);
    } else {
      storeSetRange(next);
    }
  };

  // Тоггл открытия
  const toggleOpen = () => {
    if (isOpenControlled) setIsOpen(!effectiveOpen);
    else storeSetIsOpen(!effectiveOpen);
  };

  return (
    <div
      ref={rootRef}
      className={cn(cls.filter, effectiveOpen && cls.filterActive, className)}
    >
      <div
        className={cn(
          cls.trigger,
          (style === "bordered" || style === "noshadow") && cls.triggerBordered,
          ((effectiveRange[0] && effectiveRange[1]) || effectiveRange[0]) &&
          cls.triggerSelected
        )}
        onClick={toggleOpen}
        role="button"
        aria-expanded={effectiveOpen}
        aria-haspopup="dialog"
      >
        <p className={cls.triggerLabel}>{triggerText}</p>
        <ArrowIcon className={cls.chevronIcon} />
      </div>

      {effectiveOpen && (
        <div className={cls.popover} role="dialog" aria-label={labelAriaText}>
          <div className={cls.content}>
            <div className={cls.layout}>
              <div className={cls.presets}>
                <ul className={cls.presetList}>
                  <li
                    className={cls.presetItem}
                    onClick={() => handlePreset("today")}
                  >
                    Сегодня
                  </li>
                  <li
                    className={cls.presetItem}
                    onClick={() => handlePreset("yesterday")}
                  >
                    Вчера
                  </li>
                  <li
                    className={cls.presetItem}
                    onClick={() => handlePreset("thisWeek")}
                  >
                    Эта неделя
                  </li>
                  <li
                    className={cls.presetItem}
                    onClick={() => handlePreset("lastWeek")}
                  >
                    Прошлая неделя
                  </li>
                  <li
                    className={cls.presetItem}
                    onClick={() => handlePreset("thisMonth")}
                  >
                    Этот месяц
                  </li>
                  <li
                    className={cls.presetItem}
                    onClick={() => handlePreset("lastMonth")}
                  >
                    Прошлый месяц
                  </li>
                  <li
                    className={cls.presetItem}
                    onClick={() => handlePreset("lastQuarter")}
                  >
                    Прошлый квартал
                  </li>
                </ul>
              </div>

              <div className={cls.calendarBox}>
                <DatePicker
                  className={cls.calendar}
                  selected={startDate}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  onChange={(dates) =>
                    setTempRange(normalizeRange(dates as DateRange))
                  }
                  locale="ru"
                />
              </div>
            </div>

            <div className={cls.actions}>
              <div className={cls.actionsRow}>
                <Button
                  onClick={() => {
                    applyRange(tempRange);
                    if (isOpenControlled) setIsOpen(false);
                    else storeSetIsOpen(false);
                  }}
                >
                  Применить
                </Button>
                <Button
                  className={cls.resetBtn}
                  variant="gray"
                  onClick={() => {
                    setTempRange([null, null]);
                    applyRange([null, null]);
                    if (isOpenControlled) setIsOpen(false);
                    else storeSetIsOpen(false);
                  }}
                >
                  Сбросить
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
