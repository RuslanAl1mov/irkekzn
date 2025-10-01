import React, { useContext, useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  subDays,
} from "date-fns";
import { FiltersContext } from "../../../context/FiltersContext";
import ScreenBlur from "../../content/ScreenBlur";
import "./AppFilters.css";
import "./DateFilter.css";

registerLocale("ru", ru);

interface DateFilterProps {
  label?: string;
}

const DateFilter: React.FC<DateFilterProps> = ({ label = "Фильтр по датам" }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const { isDateOpen, setIsDateOpen, dateRange, setDateRange } =
    useContext(FiltersContext)!;

  /** Временный диапазон, пока пользователь не нажал Apply */
  const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = tempRange;

  /* ─── Синхронизируем tempRange при открытии фильтра ─────────────────────── */
  useEffect(() => {
    if (isDateOpen) setTempRange(dateRange);
  }, [isDateOpen, dateRange]);

  /* ─── Закрываем поп-ап кликом вне его границ ────────────────────────────── */
  useEffect(() => {
    if (!isDateOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsDateOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [isDateOpen, setIsDateOpen]);

  /* ─── Отображаем подпись на кнопке фильтра ──────────────────────────────── */
  const renderLabel = () => {
    const [from, to] = dateRange;
    if (from && to) return `${format(from, "dd.MM.yyyy")} – ${format(to, "dd.MM.yyyy")}`;
    if (from) return format(from, "dd.MM.yyyy");
    return label;
  };

  /* ─── Пресеты дат ───────────────────────────────────────────────────────── */
  const today = new Date();
  const handlePreset = (type: string) => {
    let newRange: [Date | null, Date | null];
    switch (type) {
      case "today":
        newRange = [today, null];
        break;
      case "yesterday": {
        const yesterday = subDays(today, 1);
        newRange = [yesterday, null];
        break;
      }
      case "thisWeek":
        newRange = [startOfWeek(today), endOfWeek(today)];
        break;
      case "lastWeek": {
        const from = subDays(startOfWeek(today), 7);
        const to = subDays(endOfWeek(today), 7);
        newRange = [from, to];
        break;
      }
      case "thisMonth":
        newRange = [startOfMonth(today), endOfMonth(today)];
        break;
      case "lastMonth": {
        const from = startOfMonth(subMonths(today, 1));
        const to = endOfMonth(subMonths(today, 1));
        newRange = [from, to];
        break;
      }
      case "lastQuarter": {
        const from = startOfMonth(subMonths(today, 3));
        newRange = [from, today];
        break;
      }
      default:
        newRange = [null, null];
    }
    setTempRange(newRange);
  };

  /* ─── Утилита: нормализуем массив дат из react-datepicker ───────────────── */
  const normalizeRange = (dates: [Date | null, Date | null]): [Date | null, Date | null] => {
    const [start, end] = dates;
    const isSingleDay = !end || (start && end && start.getTime() === end.getTime());
    return [start || null, isSingleDay ? null : end];
  };

  return (
    <div>
      {isDateOpen && <ScreenBlur />}

      <div
        ref={wrapperRef}
        className={`fcb-component-filter-block ${
          isDateOpen ? "fcb-component-filter-block--active" : ""
        }`}
        style={{ zIndex: 95 }}
      >
        {/* ─── Кнопка-триггер фильтра ─────────────────────────────────────── */}
        <div
          className={`fcb-component-filter-block-clicker ${
            (dateRange[0] && dateRange[1]) || dateRange[0]
              ? "fcb-component-filter-block-clicker--selected"
              : ""
          }`}
          onClick={() => setIsDateOpen((prev: boolean) => !prev)}
        >
          <p>{renderLabel()}</p>
          <svg
            className="fcb-component-arrowdown-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="6"
            viewBox="0 0 12 6"
            fill="none"
          >
            <path d="M11.1913 0.279313C10.9958 0.100415 10.7314 0 10.4557 0C10.18 0 9.91553 0.100415 9.72002 0.279313L5.97391 3.67957L2.27997 0.279313C2.08446 0.100415 1.81999 0 1.54432 0C1.26864 0 1.00417 0.100415 0.808661 0.279313C0.710857 0.368606 0.633227 0.474841 0.580251 0.59189C0.527275 0.708939 0.5 0.834485 0.5 0.961285C0.5 1.08809 0.527275 1.21363 0.580251 1.33068C0.633227 1.44773 0.710857 1.55396 0.808661 1.64326L5.23304 5.71588C5.33004 5.80591 5.44545 5.87736 5.57261 5.92613C5.69977 5.97489 5.83616 6 5.97391 6C6.11166 6 6.24805 5.97489 6.37521 5.92613C6.50237 5.87736 6.61778 5.80591 6.71479 5.71588L11.1913 1.64326C11.2891 1.55396 11.3668 1.44773 11.4197 1.33068C11.4727 1.21363 11.5 1.08809 11.5 0.961285C11.5 0.834485 11.4727 0.708939 11.4197 0.59189C11.3668 0.474841 11.2891 0.368606 11.1913 0.279313Z" />
          </svg>
        </div>

        {/* ─── Поп-ап выбора дат ─────────────────────────────────────────── */}
        <div
          className={`fcb-component-abs-block ${
            isDateOpen ? "fcb-component-abs-block--show" : ""
          }`}
        >
          <div className="fcb-component-abs-content-block dpf-date-flex">
            {/* Пресеты */}
            <div className="dpf-date-presets">
              <ul className="dpf-presets-list">
                <li onClick={() => handlePreset("today")}>Сегодня</li>
                <li onClick={() => handlePreset("yesterday")}>Вчера</li>
                <li onClick={() => handlePreset("thisWeek")}>Эта неделя</li>
                <li onClick={() => handlePreset("lastWeek")}>Прошлая неделя</li>
                <li onClick={() => handlePreset("thisMonth")}>Этот месяц</li>
                <li onClick={() => handlePreset("lastMonth")}>Прошлый месяц</li>
                <li onClick={() => handlePreset("lastQuarter")}>Прошлый квартал</li>
              </ul>
            </div>

            {/* Календарь */}
            <div className="dpf-date-calendar-block">
              <DatePicker
                locale="ru"
                className="dpf-date-calendar"
                selected={startDate}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                onChange={(dates: [Date | null, Date | null]) =>
                  setTempRange(normalizeRange(dates))
                }
              />
            </div>
          </div>

          {/* Кнопки Apply / Reset */}
          <div className="fcb-filter-submit-block">
            <div className="fcb-filter-submit-btns-block">
              <button
                className="fcb-submit-filter-button fcb-submit-filter-button--active"
                onClick={() => {
                  setDateRange(tempRange);
                  setIsDateOpen(false);
                }}
              >
                Принять
              </button>
              <button
                className="fcb-submit-filter-button"
                onClick={() => {
                  setTempRange([null, null]);
                  setDateRange([null, null]);
                  setIsDateOpen(false);
                }}
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateFilter;
