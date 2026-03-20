import cls from "./ColorCreateForm.module.css";

import { useState, type JSX } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { createColor } from "@/entities/color";
import type { IColorPayload } from "@/entities/color";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";

import { Input, Switch } from "@/shared/ui";

import { useColorCreateStore } from "../model/store";
import { Modal } from "@/shared/ui/modal";


export const ColorCreateForm = (): JSX.Element | null => {
    const { isOpen, close } = useColorCreateStore();
    const queryClient = useQueryClient();

    const [name, setName] = useState<string>("");
    const [hex, setHex] = useState<string>("#000000");
    const [isActive, setIsActive] = useState<boolean>(true);


    const mutation = useMutation({
        mutationFn: async () => {
            const colorPayload: IColorPayload = {
                name: name,
                hex: hex,
                is_active: isActive,
            };

            return createColor(colorPayload);
        },
        onSuccess: async (createdColor) => {
            queryClient.setQueryData(queryKeys.colorDetail(createdColor.id), createdColor);
            await queryClient.invalidateQueries({ queryKey: queryKeys.colorLists() });
            toast.success("Цвет успешно создан");
            handleClose();
        },
        onError: (error) => {
            toast.error(error.message, { toastId: error.message });
        },
    });

    if (!isOpen) return null;

    const handleClose = (): void => {
        setName("");
        setHex("");
        setIsActive(true);
        close();
    };

    return (

        <Modal
            title="Добавить цвет"
            subTitle="Введите данные для создания цвета"
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
                                value={name}
                                setValue={setName}
                                label="Название"
                                disabled={mutation.isPending}
                                placeholder="Название цвета"
                                required
                            />
                        </div>

                        <div className={cls.field}>
                            <div className={cls.colorField}>
                                <Input
                                    className={cls.colorInput}
                                    value={hex}
                                    setValue={setHex}
                                    disabled={mutation.isPending}
                                    label="Цвет"
                                    placeholder="Цвет"
                                    type="color"
                                />
                            </div>
                            <Input
                                value={hex}
                                setValue={setHex}
                                label="Код"
                                placeholder="Код цвета"
                                disabled={mutation.isPending}
                                required
                                />
                        </div>
                    </div>

                    <div className={cls.inputSection}>
                        <div className={cls.field}>
                            <Switch
                                value={isActive}
                                setValue={setIsActive}
                                label="Активен"
                                disabled={mutation.isPending}
                            />
                        </div>
                    </div>

                </div>
            </form>
        </Modal>
    );
};
