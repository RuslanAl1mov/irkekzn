import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type JSX,
    type MouseEvent,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import CloseIcon from "@/assets/icons/close.svg?react";
import { getUser, type IUser, type IUserPayload, updateUser } from "@/entities/user";
import { formatDateTime } from "@/shared/lib/formater";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";
import { Button, PhoneInput, Switch } from "@/shared/ui";
import { Title } from "@/widgets/title";

import { useClientEditStore } from "../model/store";

import cls from "./ClientEditForm.module.css";

export const ClientEditForm = (): JSX.Element | null => {
    const { isOpen, user, close } = useClientEditStore();
    const queryClient = useQueryClient();
    const overlayRef = useRef<HTMLDivElement | null>(null);
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
            close();
        },
        onError: (error) => {
            toast.error(error.message, { toastId: error.message });
        },
    });

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                close();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, close]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

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

    const handleOverlayClick = (e: MouseEvent<HTMLDivElement>): void => {
        if (e.target === overlayRef.current) {
            close();
        }
    };

    function handleSubmit(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        mutation.mutate();
    }

    return (
        <div
            ref={overlayRef}
            className={cls.overlay}
            onClick={handleOverlayClick}
        >
            <div className={cls.modal}>
                <div className={cls.header}>
                    <Title
                        title="Редактирование клиента"
                        size="h3"
                        className={cls.titleBlock}
                        titleClassName={cls.title}
                        subTitleClassName={cls.subTitle}
                    />
                    <button
                        type="button"
                        className={cls.closeBtn}
                        onClick={close}
                        aria-label="Закрыть"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <form className={cls.form} onSubmit={handleSubmit}>
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
                    <div className={cls.actions}>
                        <Button type="button" variant="gray" onClick={close}>
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            isLoading={mutation.isPending}
                            disabled={isLoading || mutation.isPending}
                        >
                            Сохранить
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
