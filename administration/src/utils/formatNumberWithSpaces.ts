/**
 * Форматирует число: добавляет пробелы по тысячам, обрезает лишние нули в дробной части
 * и работает, даже если передать строку, содержащую число.
 *
 * @param value - Число или строка, содержащая число.
 * @returns Отформатированная строка с пробелами или оригинальное значение, если его нельзя распознать как число.
 */
export function formatNumberWithSpaces(value: number | string): string {
  let num: number;

  if (typeof value === "string") {
    const normalized = value.trim().replace(/\s+/g, "").replace(",", ".");
    num = parseFloat(normalized);
    if (isNaN(num)) {
      return value;
    }
  } else if (typeof value === "number") {
    num = value;
  } else {
    // сюда по типам попасть невозможно, но для безопасности можно вернуть пустую строку
    return String(value);
  }

  let str = num.toFixed(2);
  // Убираем необязательную часть ".00" или превращаем "123.40" → "123.4"
  str = str.replace(/\.?0+$/, "");

  const parts = str.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1] || "";

  const integerWithSpaces = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return decimalPart ? `${integerWithSpaces}.${decimalPart}` : integerWithSpaces;
}
