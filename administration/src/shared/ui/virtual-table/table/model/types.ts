import type { RowItem } from "@/shared/ui/virtual-table/row";
import type { ContextMenuItem } from "../../context-menu";


// Общие типы для VirtualExpandedBlock без зависимостей от entities
// Конкретные типы определяются в widgets/virtual-expanded-block
export type VirtualExpandedBlockKeys = Record<string, unknown[]>;

export type VirtualExpandedBlockProps = {
  objName: string;
  obj: unknown;
  keys?: VirtualExpandedBlockKeys;
  actions?: ContextMenuItem[];
};

export type HeaderCell = {
  name: string;
  width?: string;
  ordering?: string;
  align?: "left" | "center" | "right";
};

export interface VirtualTableProps {
  data: RowItem[];
  headers: HeaderCell[];
  row_height?: number;
  loading?: boolean;
  expandedBlock?: React.ComponentType<VirtualExpandedBlockProps> | null;
  setOrdering?: (ordering: string[]) => void;
  ordering?: string[];
  onEndReached?: () => void;
}


