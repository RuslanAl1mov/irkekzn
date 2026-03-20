import cls from "./EmployeeCreateForm.module.css";

import { useState, type JSX } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { createUser, type IUserPayload } from "@/entities/user";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";

import { Input, PhoneInput, Switch } from "@/shared/ui";

import { useEmployeeCreateStore } from "../model/store";
import { Modal } from "@/shared/ui/modal";
import { UserGroupSelect, UserPermissionSelect } from "@/shared/ui/select";


export const EmployeeCreateForm = (): JSX.Element | null => {
    const { isOpen, close } = useEmployeeCreateStore();
    const queryClient = useQueryClient();
    const [isActive, setIsActive] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userGroupIds, setUserGroupIds] = useState<number[]>([]);
    const [permissionIds, setPermissionIds] = useState<number[]>([]);


    const mutation = useMutation({
        mutationFn: async () => {
            const userPayload: IUserPayload = {
                is_active: isActive,
                phone_number: phoneNumber,
                first_name: firstName,
                last_name: lastName,
                username: username,
                email: email,
                password: password,
                group_ids: userGroupIds,
                permission_ids: permissionIds,
            };

            return createUser(userPayload);
        },
        onSuccess: async (createdUser) => {
            queryClient.setQueryData(
                queryKeys.userDetail(createdUser.id),
                createdUser
            );
            await queryClient.invalidateQueries({ queryKey: queryKeys.userLists() });
            toast.success("Сотрудник успешно создан");
            handleClose();
        },
        onError: (error) => {
            toast.error(error.message, { toastId: error.message });
        },
    });

    if (!isOpen) return null;

    const handleClose = (): void => {
        setPassword("");
        setPhoneNumber("");
        setFirstName("");
        setLastName("");
        setUsername("");
        setEmail("");
        setIsActive(true);
        setUserGroupIds([]);
        setPermissionIds([]);
        close();
    };

    return (

        <Modal
            title="Добавить сотрудника"
            subTitle="Введите данные сотрудника для создания профиля"
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
                                value={firstName}
                                setValue={setFirstName}
                                label="Имя"
                                disabled={mutation.isPending}
                                placeholder="Имя"
                                required
                            />
                            <Input
                                value={lastName}
                                setValue={setLastName}
                                label="Фамилия"
                                disabled={mutation.isPending}
                                placeholder="Фамилия"
                                required
                            />
                        </div>
                        <div className={cls.field}>
                            <PhoneInput
                                value={phoneNumber}
                                setValue={setPhoneNumber}
                                label="Номер телефона"
                                disabled={mutation.isPending}
                                placeholder="Номер телефона"
                            />
                            <Input
                                value={username}
                                setValue={setUsername}
                                label="Username"
                                disabled={mutation.isPending}
                                placeholder="Username"
                            />
                        </div>

                        <div className={cls.field}>
                            <UserGroupSelect
                                isMulti={true}
                                selected={userGroupIds}
                                setSelected={setUserGroupIds}
                                disabled={mutation.isPending}
                            />
                        </div>
                        <div className={cls.field}>
                            <UserPermissionSelect
                                isMulti={true}
                                selected={permissionIds}
                                setSelected={setPermissionIds}
                                disabled={mutation.isPending}
                            />
                        </div>
                    </div>

                    <div className={cls.inputSection}>
                        <div className={cls.field}>
                            <Input
                                value={email}
                                setValue={setEmail}
                                label="Email"
                                disabled={mutation.isPending}
                                placeholder="Email"
                                required
                            />

                        </div>
                        <div className={cls.field}>
                            <Input
                                value={password}
                                setValue={setPassword}
                                label="Создать пароль"
                                disabled={mutation.isPending}
                                placeholder="Создать пароль"
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
