import cls from "./SizeEditForm.module.css";

import { useEffect, useState, type JSX } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { getSize, updateSize } from "@/entities/size";
import type { ISize, ISizePayload } from "@/entities/size";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";
import { Input } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal";

import { useSizeEditStore } from "../model/store";

const resetForm = (setters: {
  setRussian: (value: string) => void;
  setInternational: (value: string) => void;
  setEuropean: (value: string) => void;
  setChestCircumference: (value: string) => void;
  setWaistCircumference: (value: string) => void;
  setHipCircumference: (value: string) => void;
}) => {
  setters.setRussian("");
  setters.setInternational("");
  setters.setEuropean("");
  setters.setChestCircumference("");
  setters.setWaistCircumference("");
  setters.setHipCircumference("");
};

export const SizeEditForm = (): JSX.Element | null => {
  const { isOpen, size, close } = useSizeEditStore();
  const queryClient = useQueryClient();

  const [russian, setRussian] = useState<string>("");
  const [international, setInternational] = useState<string>("");
  const [european, setEuropean] = useState<string>("");
  const [chestCircumference, setChestCircumference] = useState<string>("");
  const [waistCircumference, setWaistCircumference] = useState<string>("");
  const [hipCircumference, setHipCircumference] = useState<string>("");

  const sizeId = size?.id ?? null;

  const { data: sizeDetails, isLoading } = useQuery<ISize>({
    queryKey: queryKeys.sizeDetail(sizeId),
    queryFn: async (): Promise<ISize> => {
      if (sizeId === null) {
        throw new Error("Size id is required");
      }

      return getSize(sizeId);
    },
    enabled: isOpen && size !== null,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const sizePayload: ISizePayload = {
        russian,
        international,
        european,
        chest_circumference: chestCircumference,
        waist_circumference: waistCircumference,
        hip_circumference: hipCircumference,
        order: Number(sizeDetails?.order),
      };

      return updateSize(size!.id, sizePayload);
    },
    onSuccess: async (updatedSize) => {
      queryClient.setQueryData(queryKeys.sizeDetail(updatedSize.id), updatedSize);
      await queryClient.invalidateQueries({ queryKey: queryKeys.sizeLists() });
      toast.success("Размер успешно отредактирован");
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message, { toastId: error.message });
    },
  });

  useEffect(() => {
    const currentSize = sizeDetails ?? size;

    if (!currentSize) return;

    setRussian(currentSize.russian ?? "");
    setInternational(currentSize.international ?? "");
    setEuropean(currentSize.european ?? "");
    setChestCircumference(currentSize.chest_circumference ?? "");
    setWaistCircumference(currentSize.waist_circumference ?? "");
    setHipCircumference(currentSize.hip_circumference ?? "");
  }, [size, sizeDetails]);

  if (!isOpen || !size) return null;

  const handleClose = (): void => {
    resetForm({
      setRussian,
      setInternational,
      setEuropean,
      setChestCircumference,
      setWaistCircumference,
      setHipCircumference,
    });
    close();
  };

  return (
    <Modal
      title="Редактировать размер"
      subTitle="Введите данные для редактирования размера"
      saveBtnTitle="Сохранить"
      closeBtnTitle="Отмена"
      onSaveBtnClick={() => mutation.mutate()}
      onClose={handleClose}
    >
      <form className={cls.form}>
        <div className={cls.dataList}>
          <div className={cls.inputSection}>
            <div className={cls.field}>
              <Input
                value={russian}
                setValue={setRussian}
                label="Российский размер"
                disabled={isLoading || mutation.isPending}
                placeholder="Например: 42"
                required
              />
            </div>

            <div className={cls.field}>
              <Input
                value={international}
                setValue={setInternational}
                label="Международный размер"
                disabled={isLoading || mutation.isPending}
                placeholder="Например: S"
                required
              />
            </div>

            <div className={cls.field}>
              <Input
                value={european}
                setValue={setEuropean}
                label="Европейский размер"
                disabled={isLoading || mutation.isPending}
                placeholder="Например: 36"
                required
              />
            </div>

            <div className={cls.field}>
              <Input
                value={chestCircumference}
                setValue={setChestCircumference}
                label="Обхват груди"
                disabled={isLoading || mutation.isPending}
                placeholder="Например: 84"
                required
              />
            </div>

            <div className={cls.field}>
              <Input
                value={waistCircumference}
                setValue={setWaistCircumference}
                label="Обхват талии"
                disabled={isLoading || mutation.isPending}
                placeholder="Например: 64"
                required
              />
            </div>

            <div className={cls.field}>
              <Input
                value={hipCircumference}
                setValue={setHipCircumference}
                label="Обхват бедер"
                disabled={isLoading || mutation.isPending}
                placeholder="Например: 92"
                required
              />
            </div>
          </div>

        </div>
      </form>
    </Modal>
  );
};
