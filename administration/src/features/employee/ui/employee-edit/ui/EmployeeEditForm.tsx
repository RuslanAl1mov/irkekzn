import cls from "./EmployeeEditForm.module.css";

import { useEffect, useState, type JSX } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { getUser, type IUser, type IUserPayload, updateUser } from "@/entities/user";
import { formatDateTime } from "@/shared/lib/formater";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";

import { Input, PhoneInput, Switch } from "@/shared/ui";

import { useEmployeeEditStore } from "../model/store";
import { Modal } from "@/shared/ui/modal";
import { UserGroupSelect, UserPermissionSelect } from "@/shared/ui/select";


export const EmployeeEditForm = (): JSX.Element | null => {
    const { isOpen, user, close } = useEmployeeEditStore();
    const queryClient = useQueryClient();
    const [isActive, setIsActive] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userGroupIds, setUserGroupIds] = useState<number[]>([]);
    const [permissionIds, setPermissionIds] = useState<number[]>([]);
    const userId = user?.id ?? null;

    const { data: userDetails, isLoading } = useQuery<IUser>({
        queryKey: queryKeys.userDetail(userId),
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
                group_ids: userGroupIds,
                permission_ids: permissionIds,
                ...(password ? { password } : {}),
            };

            return updateUser(userId, userPayload);
        },
        onSuccess: async (updatedUser) => {
            queryClient.setQueryData(
                queryKeys.userDetail(updatedUser.id),
                updatedUser
            );
            await queryClient.invalidateQueries({ queryKey: queryKeys.userLists() });
            toast.success("Данные сотрудника обновлены");
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
        setFirstName(currentUser.first_name ?? "");
        setLastName(currentUser.last_name ?? "");
        setUsername(currentUser.username ?? "");
        setEmail(currentUser.email ?? "");
        setUserGroupIds(currentUser.groups?.map((group) => group.id) ?? []);
        setPermissionIds(currentUser.user_permissions?.map((permission) => permission.id) ?? []);
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

    const handleClose = (): void => {
        setPassword("");
        setPhoneNumber("");
        setFirstName("");
        setLastName("");
        setUsername("");
        setEmail("");
        setIsActive(false);
        setUserGroupIds([]);
        setPermissionIds([]);
        close();
    };


    return (
        <Modal
            title="Редактировать сотрудника"
            subTitle="Введите данные сотрудника для редактирования профиля"
            saveBtnTitle="Сохранить"
            closeBtnTitle="Отмена"
            onSaveBtnClick={() => mutation.mutate()}
            onClose={handleClose}
        >

            <div className={cls.infoSection}>
                {clientInfo.map((item) => (
                    <div key={item.label} className={cls.infoRow}>
                        <span className={cls.infoLabel}>{item.label}</span>
                        <span className={cls.infoValue}>{item.value}</span>
                    </div>
                ))}
            </div>

            <form className={cls.form}>

                <div className={cls.dataList}>
                    <div className={cls.inputSection}>
                        <div className={cls.field}>
                            <Input
                                value={firstName}
                                setValue={setFirstName}
                                label="Имя"
                                disabled={isLoading || mutation.isPending}
                                required
                            />
                            <Input
                                value={lastName}
                                setValue={setLastName}
                                label="Фамилия"
                                disabled={isLoading || mutation.isPending}
                                required
                            />
                        </div>

                        <div className={cls.field}>
                            <PhoneInput
                                value={phoneNumber}
                                setValue={setPhoneNumber}
                                label="Номер телефона"
                                disabled={isLoading || mutation.isPending}
                            />
                            <Input
                                value={username}
                                setValue={setUsername}
                                label="Username"
                                disabled={isLoading || mutation.isPending}
                            />
                        </div>
                        <div className={cls.field}>
                            <UserGroupSelect
                                isMulti={true}
                                selected={userGroupIds}
                                setSelected={setUserGroupIds}
                                disabled={isLoading || mutation.isPending}
                            />
                        </div>
                        <div className={cls.field}>
                            <UserPermissionSelect
                                isMulti={true}
                                selected={permissionIds}
                                setSelected={setPermissionIds}
                                disabled={isLoading || mutation.isPending}
                            />
                        </div>
                    </div>
                    <div className={cls.inputSection}>
                        <div className={cls.field}>
                            <Input
                                value={email}
                                setValue={setEmail}
                                label="Email"
                                disabled={isLoading || mutation.isPending}
                                required
                            />
                        </div>
                        <div className={cls.field}>
                            <Input
                                value={password}
                                setValue={setPassword}
                                label="Задать новый Пароль"
                                disabled={isLoading || mutation.isPending}
                            />
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
                </div>

            </form>
        </Modal>
    );
};
