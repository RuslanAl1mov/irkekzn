export const parseFormattedNumber = (
  value?: string | number | null,
): number | null => {
  if (value == null) return null;

  let v = String(value).trim();
  if (!v) return null;

  v = v.replace(/\s+/g, "").replace(",", ".");
  if (v === "-" || v === "." || v === "-.") return null;
  if (!/^-?\d+(\.\d+)?$/.test(v)) return null;

  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

/**
 * Форматирует число с разделителями разрядов, БЕЗ округления
 * * @param locale - локаль (по умолчанию 'ru-RU')
 * 
 * formatNumber(1234.314213)  // "1 234.314213"
 * formatNumber(1234.5)        // "1 234.5"
 * formatNumber(1234)          // "1 234"
 * formatNumber(null)          // null
 */
export const formatNumber = (
  value: number | string | null | undefined,
  locale: string = "ru-RU",
): string | null | undefined => {
  if (value == null) return value;

  let numValue: number;
  if (typeof value === "string") {
    const parsed = parseFormattedNumber(value);
    if (parsed === null) return null;
    numValue = parsed;
  } else {
    numValue = value;
  }

  if (!Number.isFinite(numValue)) return null;

  // Определяем количество знаков из самого числа
  const str = numValue.toString();
  const decimalPlaces = str.includes(".") ? str.split(".")[1].length : 0;

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping: true,
  });

  return formatter.format(numValue);
};

// Форматтер дат (без изменений)
export const formatDate = (date?: string | null) => {
  if (!date) return "";
  const d = new Date(date.slice(0, 10));
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString();
};

// Форматирует дату и время в dd.mm.yyyy hh:mm
export const formatDateTime = (date: string | null) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

// Форматтер телефонов (без изменений)
export const formatPhoneNumber = (phone: string) => {
  if (!phone) return ""
  const cleaned = String(phone).replace(/\D/g, "");
  if (cleaned.length === 11 && (cleaned[0] === "7" || cleaned[0] === "8")) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  return phone;
};
