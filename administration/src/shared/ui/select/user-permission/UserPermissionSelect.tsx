import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";

import {
  getUserPermissions,
  type IUserPermission,
} from "@/entities/user-permission";
import { SelectInput, type SelectItem } from "../select-input/SelectInput";

type Setter<T> = React.Dispatch<React.SetStateAction<T>> | ((value: T) => void);

type SingleProps = {
  isMulti?: false;
  selected: number | null;
  setSelected?: Setter<number | null>;
  setSelectedObj?: Setter<IUserPermission | null>;
};

type MultiProps = {
  isMulti: true;
  selected: number[];
  setSelected?: Setter<number[]>;
  setSelectedObj?: Setter<IUserPermission[]>;
};

type BaseProps = {
  isCleareble?: boolean;
  disabled?: boolean;
};

type UserPermissionSelectProps = (SingleProps | MultiProps) & BaseProps;

export const UserPermissionSelect: React.FC<UserPermissionSelectProps> = (props) => {
  const { isCleareble = false, disabled = false } = props;
  const lastSyncedRef = useRef<string | null>(null);

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState(search);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(search), 500);
    return () => window.clearTimeout(id);
  }, [search]);

  const selectedIds = useMemo<number[]>(() => {
    const s = props.selected;
    if (Array.isArray(s)) return s;
    return s != null ? [s] : [];
  }, [props.selected]);

  const {
    data: userPermissions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.userPermissions({ search: debounced }),
    queryFn: () => getUserPermissions({ search: debounced || undefined }),
    select: (res): IUserPermission[] => res.data.result,
    staleTime: 10 * 60 * 60 * 1000,
    gcTime: 10 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { items, rawById } = useMemo(() => {
    const items: SelectItem[] = [];
    const byId = new Map<number, IUserPermission>();

    userPermissions?.forEach((permission) => {
      byId.set(permission.id, permission);
      items.push({
        id: permission.id,
        title: permission.name,
        secTitle: [
          `${permission.app_label}.${permission.codename}`,
          `model: ${permission.model}`,
        ],
      });
    });

    return { items, rawById: byId };
  }, [userPermissions]);

  const getSelectedObjects = useCallback(
    (ids: number[]) =>
      ids.map((id) => rawById.get(id)).filter((v): v is IUserPermission => Boolean(v)),
    [rawById],
  );

  const getIdsKey = useCallback((ids: number[]) => ids.join(","), []);

  const syncSelectedObjects = useCallback(
    (ids: number[]) => {
      if (!props.setSelectedObj) return;

      const selectedObjects = getSelectedObjects(ids);
      const syncKey = `${props.isMulti ? "multi" : "single"}:${getIdsKey(ids)}:${getIdsKey(
        selectedObjects.map((permission) => permission.id),
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

  useEffect(() => {
    syncSelectedObjects(selectedIds);
  }, [selectedIds, syncSelectedObjects]);

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
      placeholder={"Отдельные права"}
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
    />
  );
};
