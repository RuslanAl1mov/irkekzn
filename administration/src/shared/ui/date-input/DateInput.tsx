import "react-datepicker/dist/react-datepicker.css";

import cn from "classnames";
import { addDays, format, isValid, parse, parseISO } from "date-fns";
import { enUS, ru } from "date-fns/locale";
import React, { useEffect, useMemo, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";

import CalendarIcon from "@/assets/icons/calendar.svg?react";
import { useI18n } from "@/shared/lib/i18n/hooks";
import { useClickOutside } from "@/shared/lib/react";
import { Button } from "@/shared/ui";

import cls from "./DateInput.module.css";

registerLocale("en", enUS);
registerLocale("ru", ru);

type Props = {
  value: string | null | undefined;
  setValue?: (next: string | null | undefined) => void;
  placeholder?: string;
  label?: string;
  formatStr?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  autofillIfEmpty?: boolean;
};

const INPUT_MASK = "dd.MM.yyyy";

// ISO "YYYY-MM-DD" из Date
function toISODateLocal(d: Date): string {
  return format(d, "yyyy-MM-dd"); // форматирует по локальному времени
}

// Преобразовать входящее value (ISO|null) в Date|null
function coerceToDateFromISO(v: string | null | undefined): Date | null {
  if (!v) return null;
  const parsed = parseISO(v);
  return isValid(parsed) ? parsed : null;
}

export const DateInput: React.FC<Props> = ({
  value,
  setValue,
  placeholder,
  label,
  formatStr = "dd.MM.yyyy",
  minDate,
  maxDate,
  disabled = false,
  autofillIfEmpty = true,
}) => {
  const { t, language } = useI18n();
  const placeholderText = placeholder ?? t("dateInput.placeholder");
  const labelAriaText = label ?? t("dateInput.label");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const didAutofillRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [typed, setTyped] = useState<string>("");

  const currentDate = useMemo(() => coerceToDateFromISO(value), [value]);

  useEffect(() => {
    const cd = currentDate;
    const td = tempDate;
    const cdTime = cd ? cd.getTime() : null;
    const tdTime = td ? td.getTime() : null;

    if (cdTime !== tdTime) {
      setTempDate(cd);
      setTyped(cd ? format(cd, INPUT_MASK) : "");
    }
  }, [value]);

  // Автоподстава даты на сегодняшнее если даты нет в value
  useEffect(() => {
    if (!autofillIfEmpty) return;
    if (isOpen) return; // не перетираем при открытом поповере
    if (didAutofillRef.current) return;
    if (value != null) return; // родитель уже что-то установил

    let init = new Date();
    if (minDate && init < minDate) init = minDate;
    if (maxDate && init > maxDate) init = maxDate;

    setTempDate(init);
    setTyped(format(init, INPUT_MASK));
    if (setValue) {
      setValue(toISODateLocal(init)); // эмитим в родителя
    }
    didAutofillRef.current = true; // больше не автозаполняем
  }, [value, isOpen, minDate, maxDate, autofillIfEmpty]);

  // При открытии поповера — синхронизируем состояние календаря и поле
  useEffect(() => {
    if (!isOpen) return;
    const d = tempDate ?? currentDate ?? new Date();
    setTempDate(d);
    setTyped(d ? format(d, INPUT_MASK) : "");
  }, [isOpen]);

  useClickOutside(rootRef, () => setIsOpen(false));

  const displayText = useMemo(
    () => (currentDate ? format(currentDate, formatStr) : placeholderText),
    [currentDate, placeholderText, formatStr]
  );

  // Автоформат dd.MM.yyyy
  const normalizeTyped = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
  };

  const parseTyped = (s: string) => {
    if (s.length !== 10) return null;
    const parsed = parse(s, INPUT_MASK, new Date());
    if (!isValid(parsed)) return null;
    if (format(parsed, INPUT_MASK) !== s) return null; // строгая проверка
    if (minDate && parsed < minDate) return null;
    if (maxDate && parsed > maxDate) return null;
    return parsed;
  };

  const emitISO = (d: Date | null) => { if (setValue) { setValue(d ? toISODateLocal(d) : null); } };

  const commitTypedIfValid = () => {
    const d = parseTyped(typed);
    if (d) {
      setTempDate(d);
      emitISO(d);
      return true;
    }
    return false;
  };

  // Применить дату с учётом min/max, записать ISO и закрыть поповер
  const selectAndClose = (d: Date) => {
    let next = d;
    if (minDate && next < minDate) next = minDate;
    if (maxDate && next > maxDate) next = maxDate;
    setTempDate(next);
    setTyped(format(next, INPUT_MASK));
    emitISO(next);
    setIsOpen(false);
  };

  const handleApply = () => {
    emitISO(tempDate ?? null);
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempDate(null);
    setTyped("");
    emitISO(null);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className={cls.filter}>
      {label && <p className={cls.label}>{label}</p>}

      <div
        className={cn(
          cls.trigger,
          currentDate && cls.triggerSelected,
          disabled && cls.filterDisabled
        )}
      >
        <input
          className={cls.input}
          type="text"
          inputMode="numeric"
          placeholder={currentDate ? displayText : INPUT_MASK}
          disabled={disabled}
          value={typed}
          onChange={(e) => setTyped(normalizeTyped(e.target.value))}
          onBlur={() => {
            if (!typed) {
              setTempDate(null);
              emitISO(null);
              return;
            }
            commitTypedIfValid();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitTypedIfValid();
          }}
          aria-label={labelAriaText}
        />

        <button
          type="button"
          className={cls.calendarButton}
          aria-label={t("dateInput.openCalendar")}
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <CalendarIcon className={cls.calendarIcon} />
        </button>
      </div>

      {isOpen && (
        <div className={cls.popover} role="dialog" aria-label={labelAriaText}>
          <div className={cls.popoverContent}>
            <DatePicker
              selected={tempDate}
              onChange={(date: Date | null) => {
                setTempDate(date);
                setTyped(date ? format(date, INPUT_MASK) : "");
              }}
              inline
              locale={language === "ru" ? "ru" : "en"}
              minDate={minDate}
              maxDate={maxDate}
              openToDate={tempDate ?? new Date()}
            />

            <div className={cls.actions}>
              <div className={cls.listSection}>
                <ul className={cls.list}>
                  <li
                    className={cls.item}
                    onClick={() => selectAndClose(new Date())}
                  >
                    <button type="button" className={cls.itemButton}>
                      Сегодня
                    </button>
                  </li>
                  <li
                    className={cls.item}
                    onClick={() => selectAndClose(addDays(new Date(), -1))}
                  >
                    <button type="button" className={cls.itemButton}>
                      Вчера
                    </button>
                  </li>
                  <li
                    className={cls.item}
                    onClick={() => selectAndClose(addDays(new Date(), 1))}
                  >
                    <button type="button" className={cls.itemButton}>
                      Завтра
                    </button>
                  </li>
                </ul>
              </div>

              <div className={cls.actionsRow}>
                <Button
                  className={cls.btn}
                  type="button"
                  onClick={handleApply}
                >
                  Применить
                </Button>
                <Button
                  className={cls.btn}
                  variant="gray"
                  type="button"
                  onClick={handleReset}
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
