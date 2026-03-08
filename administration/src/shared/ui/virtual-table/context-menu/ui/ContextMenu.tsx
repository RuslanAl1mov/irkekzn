import cn from "classnames";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { ContextMenuItem } from "../model/types";

import cls from "./ContextMenu.module.css";

type ContextMenuProps = {
  isOpen: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
};

export const ContextMenu = ({
  isOpen,
  x,
  y,
  items,
  onClose,
}: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });

  useLayoutEffect(() => {
    if (!menuRef.current) return;
    const menuRect = menuRef.current.getBoundingClientRect();
    const margin = 8;
    let nextX = x;
    let nextY = y;

    if (x + menuRect.width > window.innerWidth) {
      nextX = Math.max(margin, x - menuRect.width);
    }
    if (y + menuRect.height > window.innerHeight) {
      nextY = Math.max(margin, y - menuRect.height);
    }

    setPos({ x: nextX, y: nextY });
  }, [x, y, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClick = () => onClose();

    window.addEventListener("keydown", handleKey);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("click", handleClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div ref={menuRef} className={cls.menu} style={{ top: pos.y, left: pos.x }}>
      <ul className={cls.menuList}>
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <li className={cls.menuItem} key={`${item.title}-${index}`}>
              <button
                type="button"
                className={cls.menuButton}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
              >
                {Icon && (
                  <Icon className={cn(cls.menuIcon, item.iconClassName)} />
                )}
                <span className={cn(cls.menuLabel, item.titleClassName)}>
                  {item.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>,
    document.body
  );
};

export default ContextMenu;
