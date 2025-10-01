/**
 * Преобразует строку с пробелами / запятой в Number.
 *   "12 345,00"  -> 12345
 *   "9 999.50"   -> 9999.5
 *   "" / null    -> NaN
 */
export function toNumber(str) {
  if (str == null) return NaN;
  return Number(String(str).replace(/\s/g, "").replace(",", "."));
}


export function sanitizeIdArray(arr = []) {
  return arr
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0);
}