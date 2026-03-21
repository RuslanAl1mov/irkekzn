import cls from "./DraggableHeader.module.css";
import { useState, useCallback, useEffect } from "react";

import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

import { ContextMenu } from "@/shared/ui/virtual-table/context-menu";
import type { ContextMenuItem } from "@/shared/ui/virtual-table/context-menu";

import { DraggableHeaderItem } from "../../draggable-header-item";
import { StaticHeaderItem } from "../../static-header-item";

export type DraggableHeaderData = {
    id: string;
    label: string;
    width: string;
    align: "left" | "center" | "right";
    sortable?: boolean;
    actions?: ContextMenuItem[];
};

export type DraggableStaticHeaderData = {
    label: React.ReactNode;
    width?: string;
    align?: "left" | "center" | "right";
};

export type DraggableHeaderProps = {
    draggableData: DraggableHeaderData[];
    staticData: DraggableStaticHeaderData[];
    onOrderChange?: (newOrder: DraggableHeaderData[]) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
};

export const DraggableHeader = ({
    draggableData,
    staticData,
    onOrderChange,
    onDragStart,
    onDragEnd,
}: DraggableHeaderProps) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [items, setItems] = useState<DraggableHeaderData[]>(draggableData);
    const [menu, setMenu] = useState<{
        x: number;
        y: number;
        items: ContextMenuItem[];
    } | null>(null);

    useEffect(() => {
        setItems(draggableData);
    }, [draggableData]);

    const closeContextMenu = useCallback(() => {
        setMenu(null);
    }, []);

    const handleItemContextMenu = useCallback(
        (event: React.MouseEvent<HTMLDivElement>, item: DraggableHeaderData) => {
            if (!item.actions || item.actions.length === 0) return;

            event.preventDefault();
            event.stopPropagation();
            setMenu({
                x: event.clientX,
                y: event.clientY,
                items: item.actions,
            });
        },
        []
    );

    // Настройка сенсоров для drag-and-drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            setActiveId(null);
            onDragEnd?.();

            if (over && active.id !== over.id) {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                    const newItems = arrayMove(items, oldIndex, newIndex);
                    setItems(newItems);
                    onOrderChange?.(newItems);
                }
            }
        },
        [items, onOrderChange, onDragEnd]
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={({ active }) => {
                setActiveId(String(active.id));
                closeContextMenu();
                onDragStart?.();
            }}
            onDragEnd={handleDragEnd}
            onDragCancel={() => {
                setActiveId(null);
                closeContextMenu();
            }}
            modifiers={[restrictToHorizontalAxis]}
        >
            <div className={cls.headerRow}>

                <div className={cls.sizesHeader}>
                    <SortableContext
                        items={items.map((item) => item.id)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <div className={cls.headerContent}>
                            {/* Статические данные */}
                            {staticData.map((item, index) => (
                                <StaticHeaderItem
                                    key={`${String(item.label)}-${index}`}
                                    item={item}
                                />
                            ))}

                            {/* Двигаемые данные */}
                            {items.map((item) => (
                                <DraggableHeaderItem
                                    key={item.id}
                                    item={item}
                                    isDragging={activeId === item.id}
                                    onDragStart={onDragStart}
                                    onContextMenu={handleItemContextMenu}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </div>
            </div>
            <ContextMenu
                isOpen={Boolean(menu)}
                x={menu?.x ?? 0}
                y={menu?.y ?? 0}
                items={menu?.items ?? []}
                onClose={closeContextMenu}
            />
        </DndContext>
    );
};