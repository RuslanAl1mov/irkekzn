// const floatFmt = new Intl.NumberFormat("ru-RU", {
//   minimumFractionDigits: 2,
//   maximumFractionDigits: 2,
// });
import Decimal from "decimal.js";

export const formatterCutNumber = (v: Decimal.Value, dp = 2) =>
  new Decimal(v ?? 0).toDecimalPlaces(dp, Decimal.ROUND_DOWN).toNumber();

export const formatFloatNum = (
  value: number | null | undefined,
  maxDecimals = 2,
  locale = "ru-RU"
): string | null | undefined => {
  if (value == null) return value;

  const d = new Decimal(value).toDecimalPlaces(
    maxDecimals,
    Decimal.ROUND_HALF_UP
  );

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: maxDecimals,
    maximumFractionDigits: maxDecimals,
  });

  return formatter.format(d.toNumber());
};

export const formatFloatNumber = (
  value: number | null,
  maxDecimals = 16
): number | null => {
  if (!Number.isFinite(value)) return value;

  const factor = 10 ** maxDecimals;

  return Math.trunc(value! * factor) / factor;
};

// Форматирует числовые значения с плавающей запятой в 1 123 123,00
// export const formatFloatNum = (value?: number | null) =>
//   value == null ? "N/A" : String(floatFmt.format(value));

const integerFmt = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// Форматирует целые числовые значения в 1 123 123
export const formatIntNum = (value?: number | null) =>
  value == null ? "N/A" : String(integerFmt.format(value));

// Возвращает ключ даты YYYY-MM-DD для группировки
export const toDateKey = (dateStr: string): string => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Возвращает «Сегодня» / «Вчера» / dd.mm.yyyy
export const getDateLabel = (
  dateStr: string,
  todayLabel: string,
  yesterdayLabel: string
): string => {
  const date = new Date(dateStr);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (target.getTime() === today.getTime()) return todayLabel;
  if (target.getTime() === yesterday.getTime()) return yesterdayLabel;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
};

// Форматирует дату в dd.mm.yyyy
export const formatDate = (date?: string | null) => {
  if (!date) return "N/A";
  const d = new Date(date.slice(0, 10));
  return Number.isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
};

// Форматирует дату и время в dd.mm.yyyy hh:mm
export const formatDateTime = (date: string | null) => {
  if (!date) return "N/A";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "N/A";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const isRawInProgress = (v: string) => {
  const s = v.trim();
  return s === "" || s === "-" || s.endsWith(",") || s.endsWith(".");
};

// Форматируем значения из инпута 123 123 31,231 в 12312331.231
export const parseFormattedNumber = (
  value?: string | number | null
): number | null => {
  if (value == null) return null;

  let v = String(value).trim();
  if (!v) return null;

  // убираем пробелы и меняем запятую на точку
  v = v.replace(/\s+/g, "").replace(",", ".");

  // промежуточные "сырые" состояния инпута — игнорируем
  if (v === "-" || v === "." || v === "-.") return null;

  // можно слегка провалидировать формат
  if (!/^-?\d+(\.\d+)?$/.test(v)) {
    return null;
  }

  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

// Минимум 0 максимум 100 для процентов комиссии
export const clampPercentString = (value: string): string => {
  const n = parseFormattedNumber(value);
  if (n == null) return value;
  if (n < 0) return "0";
  if (n > 100) return "100";
  return value;
};

// Минимум 0.01 для процентов лимита
export const clampMinLimit = (value: string, maxValue: string): string => {
  const number = parseFormattedNumber(value);
  const maxNumber = parseFormattedNumber(maxValue);
  if (maxNumber === null) return value;
  if (value.endsWith(",")) return value;
  if (number == null) return "0,01";
  if (number < 0.01) return "0,01";
  if (number > maxNumber) return String(maxNumber);
  return value;
};

// Минимум и максимум со своими значениями
export const clampValueWithFloatParams = (
  value: string,
  min: string,
  max: string
): string => {
  const number = parseFormattedNumber(value);
  if (number == null) return value;
  if (number < Number(min)) return min;
  if (number > Number(max)) return max;
  return value;
};


export function formatPhoneNumber(phone: string) {
  // Убираем все нецифровые символы
  const cleaned = String(phone).replace(/\D/g, '');
  
  // Проверяем, что это российский номер (11 цифр, начинается с 7 или 8)
  if (cleaned.length === 11 && (cleaned[0] === '7' || cleaned[0] === '8')) {
    // Формат: +7 (964) 625-63-66
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  
  // Если не подходит под формат, возвращаем как есть
  return phone;
}