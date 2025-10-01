export const getDiscountPercent = (price, salePrice) => {
  const p = Number(price);
  const s = Number(salePrice);

  // 1. нет цены или цена ≤ 0
  if (!p || p <= 0) return 0;

  // 2. нет salePrice (null, undefined, NaN)
  if (salePrice === null || salePrice === undefined || Number.isNaN(s)) return 0;

  // 3. цена со скидкой ≤ 0  → 100 %
  if (s <= 0) return 100;

  // 4. скидка не меньше обычной цены → 0 %
  if (s >= p) return 0;

  // 5. обычный случай
  return Math.round(((p - s) / p) * 100);
};