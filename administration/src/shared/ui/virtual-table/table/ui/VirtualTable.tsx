import cls from "./VirtualTable.module.css";
import cn from "classnames";
import React, { useCallback, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";

import { ContextMenu } from "../../context-menu";
import type { ContextMenuItem } from "../../context-menu";
import { SortableHeader } from "../../sortable-header";

import NothingFoundImg from "@/assets/app/404.png";
import ErrorForbiddenImg from "@/assets/app/403.png";
import ServerErrorImg from "@/assets/app/500.png";
import NetworkErrorImg from "@/assets/app/network-error.png";

import { Loader } from "@/widgets/loader";
import { type RowData, VirtualRow } from "@/shared/ui/virtual-table/row"
import type { VirtualTableProps } from "../model/types";
import axios from "axios";


// ---------- утилиты ----------
const cssVarNumber = (varName: string): number => {
  if (typeof window === "undefined") return NaN;
  const val = getComputedStyle(document.documentElement).getPropertyValue(
    varName
  );
  return parseFloat(val);
};

// ---------- компонент ----------
export function VirtualTable({
  data,
  headers,
  row_height,
  isLoading,
  isError,
  error,
  expandedBlock = null,
  setOrdering,
  ordering = [],
  onEndReached,
}: VirtualTableProps) {
  // размеры (все строки и блоки — одинаковые)
  const ROW_HEIGHT = useMemo(
    () => (row_height ? row_height : cssVarNumber("--row-height")),
    [row_height]
  );

  console.log("ROW_HEIGHT", ROW_HEIGHT)
  const EXPANDED_EXTRA = useMemo(() => {
    // полная высота раскрытой строки задаётся CSS-переменной
    const cssVal = cssVarNumber("--expanded-block-height");
    return cssVal - ROW_HEIGHT - 10;
  }, [ROW_HEIGHT]);

  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // колонки и стили
  const { rowStyle, headerStyle } = useMemo(() => {
    const columns = headers.map((h) => h.width || "1fr").join(" ");
    return {
      columns,
      rowStyle: {
        display: "grid",
        gridTemplateColumns: columns,
        height: ROW_HEIGHT,
      } as React.CSSProperties,
      headerStyle: {
        display: "grid",
        gridTemplateColumns: columns,
      } as React.CSSProperties,
    };
  }, [headers, ROW_HEIGHT]);

  const handleOrderChange = useCallback(
    (next: string[]) => {
      setOrdering?.(next);
    },
    [setOrdering]
  );

  // раскрытие (Virtuoso сам пересчитывает высоты через ResizeObserver)
  const toggleExpandedRow = useCallback((rowIndex: number): void => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowIndex)) next.delete(rowIndex);
      else {
        next.clear(); // аккордеон; убрать для множественного раскрытия
        next.add(rowIndex);
      }
      return next;
    });
  }, []);

  // высота строки (единая логика)
  const getRowHeight = useCallback(
    (index: number): number =>
      expandedRows.has(index) ? ROW_HEIGHT + EXPANDED_EXTRA : ROW_HEIGHT,
    [expandedRows, ROW_HEIGHT, EXPANDED_EXTRA]
  );

  // состояние контекстного меню
  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    items: ContextMenuItem[];
    rowIndex: number;
  } | null>(null);

  const openContextMenu = useCallback(
    (x: number, y: number, items: ContextMenuItem[], rowIndex: number) => {
      setMenu({ x, y, items, rowIndex });
    },
    []
  );

  const closeContextMenu = useCallback(() => {
    setMenu(null);
  }, []);

  // кастомный Scroller: закрытие контекстного меню при скролле
  const Scroller = useMemo(() => {
    const Scrollable = React.forwardRef<
      HTMLDivElement,
      React.HTMLAttributes<HTMLDivElement>
    >((props, ref) => (
      <div
        {...props}
        ref={ref}
        onScroll={(e) => {
          props.onScroll?.(e);
          closeContextMenu();
        }}
      />
    ));
    Scrollable.displayName = "VirtualTableScroller";
    return Scrollable;
  }, [closeContextMenu]);

  // данные для строки
  const rowData = useMemo<RowData>(
    () => ({
      data,
      headers,
      rowStyle,
      expandedRows,
      toggleExpandedRow,
      rowHeight: ROW_HEIGHT,
      expandedBlock,
      openContextMenu,
      activeRowIndex: menu?.rowIndex ?? null,
    }),
    [
      data,
      headers,
      rowStyle,
      expandedRows,
      ROW_HEIGHT,
      expandedBlock,
      toggleExpandedRow,
      openContextMenu,
      menu?.rowIndex,
    ]
  );

  const itemContent = useCallback(
    (index: number) => (
      <VirtualRow
        index={index}
        style={{ height: getRowHeight(index) }}
        {...rowData}
      />
    ),
    [getRowHeight, rowData]
  );

  return (
    <div className={cls.container}>
      {/* Header */}
      <div className={cls.header} style={headerStyle}>
        {headers.map((header, idx) => {
          const isSpecial = ["is_editable", "is_status"].includes(header.name);
          const isSortable = Boolean(header.ordering);

          return (
            <div
              key={`${header.name}-${idx}`}
              style={{
                width: header?.width,
                justifyContent: header?.align,
              }}
              className={cls.headerItem}
            >
              {!isSpecial && header.ordering ? (
                <SortableHeader
                  label={header.name}
                  orderingKey={header.ordering}
                  ordering={ordering}
                  onOrderChange={handleOrderChange}
                  sortable={isSortable}
                  align={header?.align}
                  className={cn(isSortable && cls.headerItemSortable)}
                />
              ) : !isSpecial ? (
                <span>{header.name}</span>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div className={cn(cls.wrapper, cls.hideScrollBar)}>

        {/* Ошибка */}
        {isError && data.length === 0 && (
          <div className={cls.messageBlock}>
            <img
              alt="Ошибка"
              className={cls.messageImg}
              src={axios.isAxiosError(error) && error.response?.status === 403 ? ErrorForbiddenImg :
                axios.isAxiosError(error) && error.response?.status === 500 ? ServerErrorImg :
                  axios.isAxiosError(error) && error.response?.status === 503 ? NetworkErrorImg : NetworkErrorImg}
            />
            {axios.isAxiosError(error) && (
              <p className={cls.messageText}>
                {error.response?.status === 403 ? "Доступ запрещен" : error.response?.status === 500 ? "Ошибка сервера" : error.response?.status === 503 ? "Сетевая ошибка" : error.message}
              </p>
            )}
          </div>
        )}

        {/* Список пуст */}
        {!isLoading && !isError && data.length === 0 && (
          <div className={cls.messageBlock}>
            <img
              alt="Ничего не найдено"
              className={cls.messageImg}
              src={NothingFoundImg}
            />
            <p className={cls.messageText}>
              Кажется, здесь ничего нет...
            </p>
          </div>
        )}

        <Virtuoso
          className={cls.hideScrollBar}
          data={data}
          style={{ height: "100%", overflowX: "hidden" }}
          itemContent={itemContent}
          endReached={onEndReached}
          defaultItemHeight={ROW_HEIGHT}
          increaseViewportBy={{ top: 200, bottom: 200 }}
          components={{ Scroller }}
        />
        <ContextMenu
          isOpen={Boolean(menu)}
          x={menu?.x ?? 0}
          y={menu?.y ?? 0}
          items={menu?.items ?? []}
          onClose={closeContextMenu}
        />

        {isLoading && (
          <div className={cls.loadingFooter}>
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}

export default VirtualTable;
