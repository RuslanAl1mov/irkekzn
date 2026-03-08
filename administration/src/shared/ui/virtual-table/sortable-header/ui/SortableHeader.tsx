import cn from "classnames";
import React from "react";

import OrderArrowDown from "@/assets/icons/order-arrow-down.svg?react";
import OrderArrowUp from "@/assets/icons/order-arrow-up.svg?react";
import {
  getNextOrdering,
  isOrderingAsc,
  isOrderingDesc,
} from "../lib/getNextOrdering";

import cls from "./SortableHeader.module.css";

type Props = {
  label: React.ReactNode;
  orderingKey: string;
  ordering: string[];
  onOrderChange: (next: string[]) => void;
  className?: string;
  contentClassName?: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
};

export const SortableHeader: React.FC<Props> = ({
  label,
  orderingKey,
  ordering,
  onOrderChange,
  className,
  contentClassName,
  sortable = true,
  align = "left"
}) => {
  const handleClick = () => {
    if (!sortable) return;
    onOrderChange(getNextOrdering(ordering, orderingKey));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!sortable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOrderChange(getNextOrdering(ordering, orderingKey));
    }
  };

  const isAsc = sortable && isOrderingAsc(ordering, orderingKey);
  const isDesc = sortable && isOrderingDesc(ordering, orderingKey);

  return (
    <div
      className={cn(className, sortable && cls.sortable)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={sortable ? "button" : undefined}
      tabIndex={sortable ? 0 : undefined}
      style={{justifyContent: align}}
    >
      <div className={cn(cls.content, contentClassName)}>
        <span>{label}</span>
        {sortable && (
          <div className={cls.orderBlock}>
            <OrderArrowUp
              className={cn(cls.orderIcon, isAsc && cls.orderIcon_Active)}
            />
            <OrderArrowDown
              className={cn(cls.orderIcon, isDesc && cls.orderIcon_Active)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
