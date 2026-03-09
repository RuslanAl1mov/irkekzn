import cls from "./ClientEditForm.module.css";

import { useEffect, useState, type JSX } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { getUser, type IUser, type IUserPayload, updateUser } from "@/entities/user";
import { formatDateTime } from "@/shared/lib/formater";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";

import { PhoneInput, Switch } from "@/shared/ui";

import { useClientEditStore } from "../model/store";
import { Modal } from "@/shared/ui/modal";


export const ClientEditForm = (): JSX.Element | null => {
    const { isOpen, user, close } = useClientEditStore();
    const queryClient = useQueryClient();
    const [isActive, setIsActive] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const userId = user?.id ?? null;

    const { data: userDetails, isLoading } = useQuery<IUser>({
        queryKey: userId !== null ? queryKeys.userDetail(userId) : ["user", null],
        queryFn: async (): Promise<IUser> => {
            if (userId === null) {
                throw new Error("User id is required");
            }

            return getUser(userId);
        },
        enabled: isOpen && userId !== null,
        refetchOnWindowFocus: false,
    });

    const mutation = useMutation({
        mutationKey: queryKeys.updateUser(),
        mutationFn: async () => {
            if (!userId) {
                throw new Error("User ID is required");
            }

            const userPayload: Pick<IUserPayload, "is_active" | "phone_number"> = {
                is_active: isActive,
                phone_number: phoneNumber,
            };

            return updateUser(userId, userPayload);
        },
        onSuccess: async (updatedUser) => {
            queryClient.setQueryData(
                queryKeys.userDetail(updatedUser.id),
                updatedUser
            );
            await queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Данные клиента обновлены");
            handleClose();
        },
        onError: (error) => {
            toast.error(error.message, { toastId: error.message });
        },
    });

    useEffect(() => {
        const currentUser = userDetails ?? user;

        if (!currentUser) return;

        setIsActive(currentUser.is_active);
        setPhoneNumber(currentUser.phone_number ?? "");
    }, [user, userDetails]);

    if (!isOpen || !user) return null;

    const currentUser = userDetails ?? user;
    const clientInfo = [
        { label: "ID", value: String(currentUser.id) },

        { label: "Имя", value: currentUser.first_name || "-" },
        { label: "Фамилия", value: currentUser.last_name || "-" },
        { label: "Username", value: currentUser.username || "-" },
        { label: "Email", value: currentUser.email || "-" },
        { label: "Фото", value: currentUser.photo || "-" },
        {
            label: "Суперпользователь",
            value: currentUser.is_superuser ? "Да" : "Нет",
        },
        {
            label: "Сотрудник",
            value: currentUser.is_staff ? "Да" : "Нет",
        },
        { label: "Язык", value: currentUser.language || "-" },
        {
            label: "Дата последнего входа",
            value: formatDateTime(currentUser.last_login) || "-",
        },
        {
            label: "Дата регистрации",
            value: formatDateTime(currentUser.date_joined) || "-",
        },
    ];

    const handleClose = (): void => {
        setPhoneNumber("");
        setIsActive(false);
        close();
    };

    return (
        <Modal
            title="Редактировать клиента"
            subTitle="Редактирование данных клиента."
            saveBtnTitle="Сохранить"
            closeBtnTitle="Отмена"
            onSaveBtnClick={() => mutation.mutate()}
            onClose={handleClose}
        >
            <form className={cls.form}>
                <div className={cls.dataList}>
                    
                    <div className={cls.infoSection}>
                        {clientInfo.map((item) => (
                            <div key={item.label} className={cls.infoRow}>
                                <span className={cls.infoLabel}>{item.label}</span>
                                <span className={cls.infoValue}>{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className={cls.infoSection}>
                        <div className={cls.field}>
                            <PhoneInput
                                value={phoneNumber}
                                setValue={setPhoneNumber}
                                label="Номер телефона"
                                disabled={isLoading || mutation.isPending}
                                showClearButton
                                required
                            />
                        </div>
                    </div>

                    <div className={cls.infoSection}>
                        <div className={cls.field}>
                            <Switch
                                value={isActive}
                                setValue={setIsActive}
                                label="Активен"
                                disabled={isLoading || mutation.isPending}
                            />
                        </div>
                    </div>

                </div>
            </form>
        </Modal>
    );
};
