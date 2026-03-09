import cls from "./ClientInfoForm.module.css";

import { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";

import { getUser, type IUser } from "@/entities/user";

import { formatDateTime } from "@/shared/lib/formater";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";

import { useClientInfoStore } from "../model/store";
import { formatPhoneNumber } from "@/shared/lib/formater/";
import { Modal } from "@/shared/ui/modal";


export const ClientInfoForm = (): JSX.Element | null => {
    const { isOpen, user, close } = useClientInfoStore();
    const userId = user?.id ?? null;

    const { data: userDetails } = useQuery<IUser>({
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


    if (!isOpen || !user) return null;

    const currentUser = userDetails ?? user;
    const clientInfo = [
        { label: "ID", value: String(currentUser.id) },

        { label: "Имя", value: currentUser.first_name || "-" },
        { label: "Фамилия", value: currentUser.last_name || "-" },
        { label: "Username", value: currentUser.username || "-" },
        {
            label: "Номер телефона",
            value: formatPhoneNumber(currentUser.phone_number) || "-",
        },
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
        {
            label: "Активен",
            value: currentUser.is_active ? "Да" : "Нет",
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

    return (
        <Modal
            title="Информация о клиенте"
            closeBtnTitle="Закрыть"
            onClose={close}
        >

            <div className={cls.infoSection}>
                {clientInfo.map((item) => (
                    <div key={item.label} className={cls.infoRow}>
                        <span className={cls.infoLabel}>{item.label}</span>
                        <span className={cls.infoValue}>{item.value}</span>
                    </div>
                ))}
            </div>
        </Modal>
    );
};
