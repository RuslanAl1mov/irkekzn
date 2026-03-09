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
import { Button, Input, PhoneInput, Switch } from "@/shared/ui";
import { Title } from "@/widgets/title";

import { useEmployeeEditStore } from "../model/store";

import cls from "./EmployeeEditForm.module.css";

export const EmployeeEditForm = (): JSX.Element | null => {
    const { isOpen, user, close } = useEmployeeEditStore();
    const queryClient = useQueryClient();
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [photo, setPhoto] = useState("");
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

            const userPayload: IUserPayload = {
                is_active: isActive,
                phone_number: phoneNumber,
                first_name: firstName,
                last_name: lastName,
                username: username,
                email: email,
                ...(password ? { password } : {}),
            };

            return updateUser(userId, userPayload);
        },
        onSuccess: async (updatedUser) => {
            queryClient.setQueryData(
                queryKeys.userDetail(updatedUser.id),
                updatedUser
            );
            clearForm();
            await queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Данные сотрудника обновлены");
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
        setFirstName(currentUser.first_name ?? "");
        setLastName(currentUser.last_name ?? "");
        setUsername(currentUser.username ?? "");
        setEmail(currentUser.email ?? "");
        setPhoto(currentUser.photo ?? "");
    }, [user, userDetails]);

    if (!isOpen || !user) return null;

    const currentUser = userDetails ?? user;
    const clientInfo = [
        { label: "ID", value: String(currentUser.id) },
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

    const clearForm = () => {
        setPassword("");
        setPhoneNumber("");
        setFirstName("");
        setLastName("");
        setUsername("");
        setEmail("");
        setPhoto("");
        setIsActive(false);
    }

    const handleOverlayClick = (e: MouseEvent<HTMLDivElement>): void => {
        if (e.target === overlayRef.current) {
            clearForm();
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
                        title="Информация о сотруднике"
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

                <div className={cls.infoSection}>
                    {clientInfo.map((item) => (
                        <div key={item.label} className={cls.infoRow}>
                            <span className={cls.infoLabel}>{item.label}</span>
                            <span className={cls.infoValue}>{item.value}</span>
                        </div>
                    ))}
                </div>

                <form className={cls.form} onSubmit={handleSubmit}>

                    <div className={cls.dataList}>
                        <div className={cls.infoSection}>
                            <div className={cls.field}>
                                <Input
                                    value={firstName}
                                    setValue={setFirstName}
                                    label="Имя"
                                    disabled={isLoading || mutation.isPending}
                                    required
                                />
                            </div>
                            <div className={cls.field}>
                                <Input
                                    value={lastName}
                                    setValue={setLastName}
                                    label="Фамилия"
                                    disabled={isLoading || mutation.isPending}
                                    required
                                />
                            </div>
                            <div className={cls.field}>
                                <Input
                                    value={username}
                                    setValue={setUsername}
                                    label="Username"
                                    disabled={isLoading || mutation.isPending}
                                />
                            </div>
                        </div>
                        <div className={cls.infoSection}>

                            <div className={cls.field}>
                                <PhoneInput
                                    value={phoneNumber}
                                    setValue={setPhoneNumber}
                                    label="Номер телефона"
                                    disabled={isLoading || mutation.isPending}
                                />
                            </div>
                            <div className={cls.field}>
                                <Input
                                    value={email}
                                    setValue={setEmail}
                                    label="Email"
                                    disabled={isLoading || mutation.isPending}
                                    required
                                />
                            </div>
                        </div>

                        <div className={cls.infoSection}>
                            <div className={cls.field}>
                                <Input
                                    value={password}
                                    setValue={setPassword}
                                    label="Задать новый Пароль"
                                    disabled={isLoading || mutation.isPending}
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
