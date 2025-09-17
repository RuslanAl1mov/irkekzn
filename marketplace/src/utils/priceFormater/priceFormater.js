// utils.js

/**
 * Форматирует число, добавляя пробелы каждые три знака.
 * @param {number} num - Число, которое нужно отформатировать.
 * @returns {string} - Число, разделённое пробелами по тысячам.
 */
export function priceFormater(num) {
    if (num) {
      return num
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    return num
  }
  