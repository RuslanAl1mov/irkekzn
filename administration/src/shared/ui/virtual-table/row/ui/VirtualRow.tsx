import cn from "classnames";
import React from "react";

import cls from "./VirtualRow.module.css";

import type { VirtualRowProps } from "../model/types";


export function VirtualRow(props: VirtualRowProps) {
  const { index, style, ...ctx } = props;

  const {
    data: rows,
    headers,
    rowStyle,
    expandedRows,
    toggleExpandedRow,
    rowHeight,
    expandedBlock: ExpandedBlock,
    openContextMenu,
  } = ctx;

  const row = rows[index];
  if (!row) return null;

  // Получаем customRowStyle из props строки
  const customRowStyle = row.customRowStyle;

  const isExpanded = expandedRows.has(index);

  const onRowClick = () => {
    if (!ExpandedBlock) return;
    toggleExpandedRow(index);
  };

  const onContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const actions = row.props?.actions;
    if (!actions || actions.length === 0) return;
    e.preventDefault();
    e.stopPropagation();
    openContextMenu(e.clientX, e.clientY, actions, index);
  };

  const isActive = ctx.activeRowIndex === index;

  console.log("customRowStyle", customRowStyle);
  return (
    <div className={cls.wrapper} style={style}>
      {/* Основная строка */}
      <div
        style={{
          ...rowStyle,  // из таблицы
          ...customRowStyle,  // из ячейки
        }}
        className={cn(cls.row, isActive && cls.rowActive)}
        onClick={onRowClick}
        onContextMenu={onContextMenu}
        role={ExpandedBlock ? "button" : undefined}
        aria-expanded={ExpandedBlock ? isExpanded : undefined}
      >
        {row.data.map((cell, cellIndex) => {
          const colHeader = headers[cellIndex];
          const align = colHeader?.align ?? "left";
          return (
            <div
              key={cellIndex}
              className={cls.cell}
              style={{ justifyContent: align }}
            >
              {cell ?? "—"}
            </div>
          );
        })}
      </div>

      {/* Раскрытый блок */}
      {isExpanded && ExpandedBlock && row.props && (
        <div
          className={cls.expandedContent}
          style={{ height: `calc(100% - ${rowHeight + 1}px)` }}
        >
          <ExpandedBlock
            objName={row.props.objName}
            obj={row.props.obj}
            keys={row.props.keys}
          />
        </div>
      )}
    </div>
  );
}

export default VirtualRow;
