import type { HeaderCell, VirtualExpandedBlockProps } from "../../table";
import type { ContextMenuItem } from "../../context-menu";

export type RowItem = {
  data: React.ReactNode[];
  props?: VirtualExpandedBlockProps;
};

export type RowData = {
  data: RowItem[];
  headers: HeaderCell[];
  rowStyle: React.CSSProperties;
  rowHeight: number;
  expandedRows: Set<number>;
  toggleExpandedRow: (rowIndex: number) => void;
  expandedBlock?: React.ComponentType<VirtualExpandedBlockProps> | null;
  openContextMenu: (
    x: number,
    y: number,
    items: ContextMenuItem[],
    rowIndex: number,
  ) => void;
  activeRowIndex: number | null;
};

export type VirtualRowProps = {
  index: number;
  style: React.CSSProperties;
} & RowData;
