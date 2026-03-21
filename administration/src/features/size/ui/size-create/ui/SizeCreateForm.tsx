import cls from "./SizeCreateForm.module.css";

import { useState, type JSX } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { createSize } from "@/entities/size";
import type { ISizePayload } from "@/entities/size";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";
import { Input } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal";

import { useSizeCreateStore } from "../model/store";


export const SizeCreateForm = (): JSX.Element | null => {
  const { isOpen, close } = useSizeCreateStore();
  const queryClient = useQueryClient();

  const [russian, setRussian] = useState<string>("");
  const [international, setInternational] = useState<string>("");
  const [european, setEuropean] = useState<string>("");
  const [chestCircumference, setChestCircumference] = useState<string>("");
  const [waistCircumference, setWaistCircumference] = useState<string>("");
  const [hipCircumference, setHipCircumference] = useState<string>("");

  const mutation = useMutation({
    mutationFn: async () => {
      const sizePayload: ISizePayload = {
        russian,
        international,
        european,
        chest_circumference: chestCircumference,
        waist_circumference: waistCircumference,
        hip_circumference: hipCircumference,
      };

      return createSize(sizePayload);
    },
    onSuccess: async (createdSize) => {
      queryClient.setQueryData(queryKeys.sizeDetail(createdSize.id), createdSize);
      await queryClient.invalidateQueries({ queryKey: queryKeys.sizeLists() });
      toast.success("Размер успешно создан");
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message, { toastId: error.message });
    },
  });

  if (!isOpen) return null;

  const handleClose = (): void => {
    setRussian("");
    setInternational("");
    setEuropean("");
    setChestCircumference("");
    setWaistCircumference("");
    setHipCircumference("");
    close();
  };

  return (
    <Modal
      title="Добавить размер"
      subTitle="Введите данные для создания размера"
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
                disabled={mutation.isPending}
                placeholder="Например: 42"
                required
              />
            </div>

            <div className={cls.field}>
              <Input
                value={international}
                setValue={setInternational}
                label="Международный размер"
                disabled={mutation.isPending}
                placeholder="Например: S"
                required
              />
            </div>

            <div className={cls.field}>
              <Input
                value={european}
                setValue={setEuropean}
                label="Европейский размер"
                disabled={mutation.isPending}
                placeholder="Например: 36"
                required
              />
            </div>
            <div className={cls.field}>
              <Input
                value={chestCircumference}
                setValue={setChestCircumference}
                label="Обхват груди"
                disabled={mutation.isPending}
                placeholder="Например: 84"
                required
              />
            </div>

            <div className={cls.field}>
              <Input
                value={waistCircumference}
                setValue={setWaistCircumference}
                label="Обхват талии"
                disabled={mutation.isPending}
                placeholder="Например: 64"
                required
              />
            </div>

            <div className={cls.field}>
              <Input
                value={hipCircumference}
                setValue={setHipCircumference}
                label="Обхват бедер"
                disabled={mutation.isPending}
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
