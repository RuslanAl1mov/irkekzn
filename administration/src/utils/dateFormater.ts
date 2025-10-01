import { parseISO, format } from "date-fns";

/**
 * Преобразует ISO-строку («2025-06-17T10:46:56.326194+05:00»)
 * в «dd.MM.yyyy» или «dd.MM.yyyy HH:mm» в зависимости от showTime.
 *
 * @param date      ISO-строка даты (может быть undefined или null)
 * @param showTime  Показывать ли время (по умолчанию false)
 * @returns         Отформатированная строка или пустая строка
 */
export function dateFormater(date?: string | null, showTime: boolean = false): string {
  if (!date) return "";
  const dateISO = parseISO(date);
  return format(dateISO, showTime ? "dd.MM.yyyy HH:mm" : "dd.MM.yyyy");
}
