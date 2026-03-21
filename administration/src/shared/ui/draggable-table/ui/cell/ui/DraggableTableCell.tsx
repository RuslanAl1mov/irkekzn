import cls from "./DraggableTableCell.module.css";


type DraggableTableCellProps = {
  value: string | number | null | undefined;
  width?: string;
  align?: "left" | "center" | "right";
  emptyFallback?: string;
};

export const DraggableTableCell = ({
  value,
  width,
  emptyFallback = "-",
  align,
}: DraggableTableCellProps) => {
  return (
    <div className={cls.cell} style={{ width: width, minWidth: width, justifyContent: align }}>
      <span className={cls.title}>{value !== undefined && value !== null ? String(value) : emptyFallback}</span>
    </div>
  );
};
