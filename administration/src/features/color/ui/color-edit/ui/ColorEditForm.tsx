import cls from "./ColorEditForm.module.css";

import { useEffect, useState, type JSX } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { updateColor } from "@/entities/color";
import type { IColor, IColorPayload } from "@/entities/color";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";

import { Input, Switch } from "@/shared/ui";

import { useColorEditStore } from "../model/store";
import { Modal } from "@/shared/ui/modal";
import { getColor } from "@/entities/color";


export const ColorEditForm = (): JSX.Element | null => {
    const { isOpen, color, close } = useColorEditStore();
    const queryClient = useQueryClient();

    const [name, setName] = useState<string>("");
    const [hex, setHex] = useState<string>("#000000");
    const [isActive, setIsActive] = useState<boolean>(true);

    const colorId = color?.id ?? null;

    const { data: colorDetails, isLoading } = useQuery<IColor>({
        queryKey: queryKeys.colorDetail(colorId),
        queryFn: async (): Promise<IColor> => {
            if (colorId === null) {
                throw new Error("Color id is required");
            }

            return getColor(colorId);
        },
        enabled: isOpen && color !== null,
        refetchOnWindowFocus: false,
    });
    const mutation = useMutation({
        mutationFn: async () => {
            const colorPayload: IColorPayload = {
                name: name,
                hex: hex,
                is_active: isActive,
            };

            return updateColor(color!.id, colorPayload);
        },
        onSuccess: async (updatedColor) => {
            queryClient.setQueryData(queryKeys.colorDetail(updatedColor.id), updatedColor);
            await queryClient.invalidateQueries({ queryKey: queryKeys.colorLists() });
            toast.success("Цвет успешно отредактирован");
            handleClose();
        },
        onError: (error) => {
            toast.error(error.message, { toastId: error.message });
        },
    });


    useEffect(() => {
        const currentColor = colorDetails ?? color;

        if (!currentColor) return;

        setName(currentColor.name ?? "");
        setHex(currentColor.hex ?? "");
        setIsActive(currentColor.is_active);
    }, [color, colorDetails]);

    if (!isOpen || !color) return null;

    const handleClose = (): void => {
        setName("");
        setHex("#000000");
        setIsActive(true);
        close();
    };

    return (

        <Modal
            title="Редактировать цвет"
            subTitle="Введите данные для редактирования цвета"
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

                </div>

                <div className={cls.inputSection}>
                    <div className={cls.field}>
                        <Switch
                            value={isActive}
                            setValue={setIsActive}
                            label="Активен"
                            disabled={isLoading || mutation.isPending}
                        />
                    </div>
                </div>

            </form>
        </Modal >
    );
};
