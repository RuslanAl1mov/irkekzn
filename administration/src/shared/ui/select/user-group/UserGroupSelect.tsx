import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";

import { getUserGroups, type IUserGroup } from "@/entities/user-group";
import { SelectInput, type SelectItem } from "../select-input/SelectInput";


type Setter<T> = React.Dispatch<React.SetStateAction<T>> | ((value: T) => void);

type SingleProps = {
    isMulti?: false;
    selected: number | null;
    setSelected?: Setter<number | null>;
    setSelectedObj?: Setter<IUserGroup | null>;
};

type MultiProps = {
    isMulti: true;
    selected: number[];
    setSelected?: Setter<number[]>;
    setSelectedObj?: Setter<IUserGroup[]>;
};

type BaseProps = {
    isCleareble?: boolean;
    disabled?: boolean;
    onCreateClick?: () => void;
};

type UserGroupSelectProps = (SingleProps | MultiProps) & BaseProps;

export const UserGroupSelect: React.FC<UserGroupSelectProps> = (props) => {
    const { isCleareble = false, disabled = false, onCreateClick } = props;
    const lastSyncedRef = useRef<string | null>(null);

    const [search, setSearch] = useState("");
    const [debounced, setDebounced] = useState(search);

    useEffect(() => {
        const id = window.setTimeout(() => setDebounced(search), 500);
        return () => window.clearTimeout(id);
    }, [search]);

    // Нормализация выбранных id
    const selectedIds = useMemo<number[]>(() => {
        const s = props.selected;
        if (Array.isArray(s)) return s;
        return s != null ? [s] : [];
    }, [props.selected]);

    // Запрос списка групп пользователей
    const {
        data: userGroups,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: queryKeys.userGroups({ search: debounced }),
        queryFn: () => getUserGroups({ search: debounced || undefined }),
        select: (res): IUserGroup[] => {
            return res.data.result;
        },
        staleTime: 10 * 60 * 60 * 1000,
        gcTime: 10 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    // Преобразование списка групп пользователей в массив элементов для выбора
    const { items, rawById } = useMemo(() => {
        const items: SelectItem[] = [];
        const byId = new Map<number, IUserGroup>();

        userGroups?.forEach((userGroup) => {
            byId.set(userGroup.id, userGroup);
            items.push({
                id: userGroup.id,
                title: userGroup.name,
                secTitle: userGroup.permissions
            });
        });

        return { items, rawById: byId };
    }, [userGroups]);
    

    // Получение объектов групп пользователей по id
    const getSelectedObjects = useCallback(
        (ids: number[]) =>
            ids.map((id) => rawById.get(id)).filter((v): v is IUserGroup => Boolean(v)),
        [rawById],
    );

    const getIdsKey = useCallback((ids: number[]) => ids.join(","), []);

    // Синхронизация выбранных объектов групп пользователей
    const syncSelectedObjects = useCallback(
        (ids: number[]) => {
            if (!props.setSelectedObj) return;

            const selectedObjects = getSelectedObjects(ids);
            const syncKey = `${props.isMulti ? "multi" : "single"}:${getIdsKey(ids)}:${getIdsKey(
                selectedObjects.map((group) => group.id),
            )}`;

            if (lastSyncedRef.current === syncKey) return;

            lastSyncedRef.current = syncKey;

            if (props.isMulti) {
                props.setSelectedObj(selectedObjects);
            } else {
                props.setSelectedObj(selectedObjects[0] ?? null);
            }
        },
        [getIdsKey, getSelectedObjects, props.isMulti, props.setSelectedObj],
    );

    // Синхронизация выбранных объектов групп пользователей при изменении выбранных id
    useEffect(() => {
        syncSelectedObjects(selectedIds);
    }, [selectedIds, syncSelectedObjects]);

    // Обработка изменения выбранных id
    const handleChange = (next: number[]) => {
        if (props.setSelected) {
            if (props.isMulti) {
                props.setSelected(next);
            } else {
                props.setSelected(next[0] ?? null);
            }
        }

        syncSelectedObjects(next);
    };

    return (
        <SelectInput
            placeholder={"Группа пользователей"}
            data={items}
            selected={selectedIds}
            onChange={handleChange}
            search={search}
            onSearchChange={setSearch}
            isMulti={props.isMulti === true}
            isCleareble={isCleareble}
            disabled={disabled}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onCreateClick={onCreateClick}
        />
    );
};

