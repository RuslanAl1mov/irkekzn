import cn from "classnames";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import DragIcon from "@/assets/icons/drag.svg?react";

import cls from "./DraggableHeaderItem.module.css";
import type { DraggableHeaderData } from "../../header";

type DraggableHeaderItemProps = {
    item: DraggableHeaderData;
    isDragging?: boolean;
    onDragStart?: () => void;
    onContextMenu?: (event: React.MouseEvent<HTMLDivElement>, item: DraggableHeaderData) => void;
};

export const DraggableHeaderItem = ({
    item,
    isDragging,
    onDragStart,
    onContextMenu,
}: DraggableHeaderItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({
        id: item.id,
        disabled: false,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: item.width,
        justifyContent: item.align,
        opacity: isDragging || isSortableDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(cls.headerCell, isSortableDragging && cls.dragging)}
            {...attributes}
            {...listeners}
            onContextMenu={(event) => onContextMenu?.(event, item)}
            onMouseDown={(event) => {
                if (event.button === 0) {
                    onDragStart?.();
                }
            }}
        >
            <div className={cls.dragHandle}>
                <DragIcon className={cls.dragIcon} />
            </div>
            <span className={cls.title}>{item.label}</span>
        </div>
    );
};
