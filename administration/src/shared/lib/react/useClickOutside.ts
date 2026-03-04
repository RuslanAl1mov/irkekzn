import { type RefObject, useEffect } from "react";

type UseClickOutsideOptions = {
  enabled?: boolean;
  capture?: boolean;
};

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onClickOutside: (event: Event) => void,
  options: UseClickOutsideOptions = {},
) {
  const { enabled = true, capture = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleMouseDown = (event: MouseEvent) => {
      const node = ref.current;
      if (!node) return;

      const target = event.target as Node | null;
      if (target && !node.contains(target)) {
        onClickOutside(event);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClickOutside(event);
      }
    };

    document.addEventListener("mousedown", handleMouseDown, capture);
    document.addEventListener("keydown", handleKeyDown, capture);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown, capture);
      document.removeEventListener("keydown", handleKeyDown, capture);
    };
  }, [capture, enabled, onClickOutside, ref]);
}
