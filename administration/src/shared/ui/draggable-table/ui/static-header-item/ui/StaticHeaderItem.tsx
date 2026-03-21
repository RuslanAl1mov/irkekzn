import cls from "@/shared/ui/draggable-table/ui/draggable-header-item/ui/DraggableHeaderItem.module.css";

import type { DraggableStaticHeaderData } from "../../header";

type StaticHeaderItemProps = {
    item: DraggableStaticHeaderData;
};

export const StaticHeaderItem = ({ item }: StaticHeaderItemProps) => {
    return (
        <div
            className={cls.headerCell}
            style={{
                width: item.width ?? "150px",
                minWidth: item.width ?? "150px",
                justifyContent: item.align ?? "left",
                cursor: "default",
            }}
        >
            <span className={cls.title}>{item.label}</span>
        </div>
    );
};
