import cls from "./DraggableParameterRow.module.css";

export type DraggableStaticRowData = {
  label: React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
};

type DraggableParameterRowProps<TItem> = {
  staticData: DraggableStaticRowData[];
  items: TItem[];
  renderCell: (item: TItem) => React.ReactNode;
};

export const DraggableParameterRow = <TItem,>({
  staticData,
  items,
  renderCell,
}: DraggableParameterRowProps<TItem>) => {
  return (
    <div className={cls.row}>
      {staticData.map((item, index) => (
        <div
          key={`${String(item.label)}-${index}`}
          className={cls.label}
          style={{
            width: item.width ?? "fit-content",
            minWidth: item.width ?? "fit-content",
            justifyContent: item.align ?? "space-between",
          }}
        >
          {item.label}
        </div>
      ))}
      <div className={cls.cells}>
        {items.map(renderCell)}
      </div>
    </div>
  );
};
