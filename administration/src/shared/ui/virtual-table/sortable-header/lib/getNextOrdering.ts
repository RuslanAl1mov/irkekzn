export function getNextOrdering(prev: string[], orderingKey: string): string[] {
  const idx = prev.findIndex((o) => o.replace(/^-/, "") === orderingKey);
  if (idx === -1) return [...prev, orderingKey];
  const curr = prev[idx];
  if (!curr.startsWith("-"))
    return [...prev.slice(0, idx), `-${orderingKey}`, ...prev.slice(idx + 1)];
  return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
}

export function isOrderingDesc(ordering: string[], key: string): boolean {
  return ordering
    .filter((o) => o.replace(/^-/, "") === key)
    .some((o) => o.startsWith("-"));
}

export function isOrderingAsc(ordering: string[], key: string): boolean {
  const isCurrent = ordering.some((o) => o.replace(/^-/, "") === key);
  return isCurrent && !isOrderingDesc(ordering, key);
}
