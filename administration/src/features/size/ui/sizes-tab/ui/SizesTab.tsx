import cls from "./SizesTab.module.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

import EditIcon from "@/assets/icons/edit.svg?react";
import PlusIcon from "@/assets/icons/plus.svg?react";
import TrashBinIcon from "@/assets/icons/trash-bin.svg?react";
import { deleteSize, getSizes, updateSize } from "@/entities/size";
import type { ISize } from "@/entities/size";
import { useSizeCreateStore, useSizeEditStore } from "@/features/size";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";
import { Button } from "@/shared/ui/button";
import {
  DraggableHeader,
  DraggableParameterRow,
  DraggableTableCell,
  type DraggableHeaderData,
  type DraggableStaticHeaderData,
  type DraggableStaticRowData,
} from "@/shared/ui/draggable-table";
import { useConfirmationStore } from "@/widgets/confirmation";
import { Loader } from "@/widgets/loader";
import { Title } from "@/widgets/title";

interface SizeRow {
  id: string;
  label: string;
  accessor: keyof ISize;
}

type SizeOrderUpdatePayload = {
  previousSizes: ISize[];
  nextSizes: ISize[];
};

const getMovedRange = (previousSizes: ISize[], nextSizes: ISize[]) => {
  const previousIds = previousSizes.map((size) => size.id);
  const nextIds = nextSizes.map((size) => size.id);

  const startIndex = previousIds.findIndex((id, index) => id !== nextIds[index]);

  if (startIndex === -1) {
    return null;
  }

  let endIndex = previousIds.length - 1;

  while (endIndex > startIndex && previousIds[endIndex] === nextIds[endIndex]) {
    endIndex -= 1;
  }

  const movedForward = previousIds[startIndex] === nextIds[endIndex];
  const movedBackward = previousIds[endIndex] === nextIds[startIndex];

  if (!movedForward && !movedBackward) {
    return null;
  }

  return {
    startIndex,
    endIndex,
    movedId: movedForward ? previousIds[startIndex] : previousIds[endIndex],
    movedForward,
  };
};

const SIZE_COLUMN_WIDTH = "140px";

export const SizesTab = () => {
  const { open: openSizeCreateModal } = useSizeCreateStore();
  const { open: openSizeEditModal } = useSizeEditStore();
  const { open: openConfirmation } = useConfirmationStore();

  const [localSizes, setLocalSizes] = useState<ISize[]>([]);
  const queryClient = useQueryClient();

  const rows: SizeRow[] = useMemo(
    () => [
      { id: "russian", label: "Российский", accessor: "russian" },
      { id: "international", label: "Международный", accessor: "international" },
      { id: "european", label: "Европейский", accessor: "european" },
      { id: "chest", label: "Обхват груди", accessor: "chest_circumference" },
      { id: "waist", label: "Обхват талии", accessor: "waist_circumference" },
      { id: "hip", label: "Обхват бедер", accessor: "hip_circumference" },
    ],
    [],
  );

  const {
    data: sizes,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: queryKeys.sizes({ ordering: ["order"] }),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      const res = await getSizes({ page, ordering: ["order"] });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.next) return undefined;
      return allPages.length + 1;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const totalSizes = sizes?.pages?.[0]?.count || 0;

  const flatList = useMemo<ISize[]>(() => {
    if (!sizes?.pages) return [];

    return sizes.pages
      .flatMap((page) => page.result ?? [])
      .sort((left, right) => left.order - right.order);
  }, [sizes]);

  useEffect(() => {
    setLocalSizes(flatList);
  }, [flatList]);

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const updateOrderMutation = useMutation({
    mutationFn: async ({ previousSizes, nextSizes }: SizeOrderUpdatePayload) => {
      const movedRange = getMovedRange(previousSizes, nextSizes);

      if (!movedRange) {
        return nextSizes;
      }

      const nextOrderById = new Map(nextSizes.map((size, index) => [size.id, index + 1]));
      const temporaryOrder =
        previousSizes.reduce((max, size) => Math.max(max, size.order), 0) + 1;

      await updateSize(movedRange.movedId, { order: temporaryOrder });

      if (movedRange.movedForward) {
        for (let index = movedRange.startIndex + 1; index <= movedRange.endIndex; index += 1) {
          const sizeId = previousSizes[index].id;
          const nextOrder = nextOrderById.get(sizeId);

          if (nextOrder !== undefined) {
            await updateSize(sizeId, { order: nextOrder });
          }
        }
      } else {
        for (let index = movedRange.endIndex - 1; index >= movedRange.startIndex; index -= 1) {
          const sizeId = previousSizes[index].id;
          const nextOrder = nextOrderById.get(sizeId);

          if (nextOrder !== undefined) {
            await updateSize(sizeId, { order: nextOrder });
          }
        }
      }

      const movedNextOrder = nextOrderById.get(movedRange.movedId);

      if (movedNextOrder !== undefined) {
        await updateSize(movedRange.movedId, { order: movedNextOrder });
      }

      return nextSizes;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.sizeLists() });
      toast.success("Порядок размеров успешно обновлен");
    },
    onError: (mutationError, variables) => {
      const err = mutationError as AxiosError<{ error?: string; detail?: string }>;
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Не удалось обновить порядок размеров";

      setLocalSizes(variables.previousSizes);
      toast.error(message, { toastId: message });
      refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (sizeId: number) => deleteSize(sizeId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.sizeLists() });
      toast.success("Размер успешно удален");
    },
    onError: (mutationError) => {
      const err = mutationError as AxiosError<{ error?: string; detail?: string }>;
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Не удалось удалить размер";

      toast.error(message, { toastId: message });
    },
  });

  useEffect(() => {
    if (isError) {
      const err = error as AxiosError<{ error?: string; detail?: string }>;
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Не удалось загрузить размеры";

      toast.error(message, { toastId: message });
    }
  }, [isError, error]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const right = Math.abs(target.scrollWidth - target.scrollLeft - target.clientWidth) < 1;

      if (right && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  const handleDeleteSize = useCallback(
    (size: ISize) => {
      openConfirmation({
        type: "deletion_confirm",
        title: `Удалить размер "${size.russian} / ${size.international}"?`,
        subTitle: "Размер будет удален без возможности восстановления. Подтвердите действие.",
        confirmBtnTitle: "Удалить",
        closeBtnTitle: "Отмена",
        onConfirm: () => deleteMutation.mutate(size.id),
      });
    },
    [deleteMutation, openConfirmation],
  );

  const headerData = useMemo<DraggableHeaderData[]>(
    () =>
      localSizes.map((size) => ({
        id: String(size.id),
        label: `${size.russian} / ${size.international}`,
        width: SIZE_COLUMN_WIDTH,
        align: "center",
        actions: [
          {
            title: "Редактировать",
            icon: EditIcon,
            onClick: () => openSizeEditModal(size),
          },
          {
            title: "Удалить",
            icon: TrashBinIcon,
            onClick: () => handleDeleteSize(size),
          },
        ],
      })),
    [handleDeleteSize, localSizes, openSizeEditModal],
  );

  const staticHeaderData = useMemo<DraggableStaticHeaderData[]>(
    () => [{
      label: "Параметры",
      width: "150px",
    }],
    [],
  );

  const rowStaticData = useMemo(
    () =>
      rows.reduce<Record<string, DraggableStaticRowData[]>>((acc, row) => {
        acc[row.id] = [
          {
            label: row.label,
            width: "150px",
          },
        ];

        return acc;
      }, {}),
    [rows],
  );

  const handleOrderChange = useCallback(
    (orderedHeaders: DraggableHeaderData[]) => {
      if (updateOrderMutation.isPending) return;

      const sizeMap = new Map(localSizes.map((size) => [String(size.id), size]));
      const reorderedSizes = orderedHeaders
        .map((header, index) => {
          const size = sizeMap.get(header.id);
          if (!size) return null;

          return {
            ...size,
            order: index + 1,
          };
        })
        .filter((size): size is ISize => size !== null);

      if (reorderedSizes.length !== localSizes.length) return;

      const previousSizes = localSizes;
      setLocalSizes(reorderedSizes);
      updateOrderMutation.mutate({
        previousSizes,
        nextSizes: reorderedSizes,
      });
    },
    [localSizes, updateOrderMutation],
  );

  return (
    <div className={cls.wrapper}>
      <div className={cls.header}>
        <Title
          size="h2"
          title="Таблица размеров"
          subTitle="Управляйте размерной сеткой и ее параметрами"
        />
        <Button className={cls.addButton} onClick={openSizeCreateModal}>
          <PlusIcon className={cls.addButtonIcon} />
          <p className={cls.addButtonText}>Добавить размер</p>
        </Button>
      </div>

      <div className={cls.content}>
        <div className={cls.summaryBlock}>
          <p className={cls.summaryText}>Всего размеров: {totalSizes}</p>
        </div>

        {isLoading ? (
          <div className={cls.loaderErrorBlock}>
            <Loader size={30} strokeWidth={6} />
          </div>
        ) : (
          <div className={cls.tableBlock} onScroll={handleScroll}>
            <DraggableHeader
              draggableData={headerData}
              staticData={staticHeaderData}
              onOrderChange={handleOrderChange}
            />

            <div className={cls.tableBody}>
              {rows.map((row) => (
                <DraggableParameterRow
                  key={row.id}
                  staticData={rowStaticData[row.id]}
                  items={localSizes}
                  renderCell={(size) => (
                    <DraggableTableCell
                      key={`${size.id}-${row.id}`}
                      width={SIZE_COLUMN_WIDTH}
                      align="center"
                      value={size[row.accessor]}
                    />
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};