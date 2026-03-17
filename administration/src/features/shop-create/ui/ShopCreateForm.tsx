import cls from "./ShopCreateForm.module.css";

import { useState, type JSX } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { createShop } from "@/entities/shop";
import type { IShopPayload } from "@/entities/shop";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";

import { Input, PhoneInput, Switch } from "@/shared/ui";

import { useShopCreateStore } from "../model/store";
import { Modal } from "@/shared/ui/modal";


export const ShopCreateForm = (): JSX.Element | null => {
    const { isOpen, close } = useShopCreateStore();
    const queryClient = useQueryClient();

    const [name, setName] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumberFirst, setPhoneNumberFirst] = useState<string>("");
    const [phoneNumberSecond, setPhoneNumberSecond] = useState<string>("");
    const [phoneNumberThird, setPhoneNumberThird] = useState<string>("");
    const [telegramName, setTelegramName] = useState<string>("");
    const [telegramLink, setTelegramLink] = useState<string>("");
    const [vkName, setVkName] = useState<string>("");
    const [vkLink, setVkLink] = useState<string>("");
    const [instagramName, setInstagramName] = useState<string>("");
    const [instagramLink, setInstagramLink] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(true);
    const [isMainOffice, setIsMainOffice] = useState<boolean>(false);


    const mutation = useMutation({
        mutationFn: async () => {
            const shopPayload: IShopPayload = {
                name: name,
                city: city,
                address: address,
                email: email,
                phone_first: phoneNumberFirst,
                phone_second: phoneNumberSecond,
                phone_third: phoneNumberThird,
                telegram_name: telegramName,
                telegram_link: telegramLink,
                vk_name: vkName,
                vk_link: vkLink,
                instagram_name: instagramName,
                instagram_link: instagramLink,
                is_main_office: isMainOffice,
                is_active: isActive,
            };

            return createShop(shopPayload);
        },
        onSuccess: async (createdShop) => {
            queryClient.setQueryData(
                queryKeys.shopDetail(createdShop.id),
                createdShop
            );
            await queryClient.invalidateQueries({ queryKey: queryKeys.shops({}) });
            toast.success("Бутик успешно создан");
            handleClose();
        },
        onError: (error) => {
            toast.error(error.message, { toastId: error.message });
        },
    });

    if (!isOpen) return null;

    const handleClose = (): void => {
        setName("");
        setCity("");
        setAddress("");
        setEmail("");
        setPhoneNumberFirst("");
        setPhoneNumberSecond("");
        setPhoneNumberThird("");
        setTelegramName("");
        setTelegramLink("");
        setVkName("");
        setVkLink("");
        setInstagramName("");
        setInstagramLink("");
        setIsMainOffice(false);
        setIsActive(true);
        close();
    };

    return (

        <Modal
            title="Добавить бутик"
            subTitle="Введите данные для создания бутика"
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
                                placeholder="Название бутика"
                                required
                            />
                        </div>

                        <div className={cls.field}>
                            <Input
                                value={city}
                                setValue={setCity}
                                label="Город"
                                disabled={mutation.isPending}
                                placeholder="Город бутика"
                                required
                            />
                            <Input
                                value={address}
                                setValue={setAddress}
                                label="Адрес"
                                disabled={mutation.isPending}
                                placeholder="Адрес бутика"
                                required
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
                            />

                            <PhoneInput
                                value={phoneNumberFirst}
                                setValue={setPhoneNumberFirst}
                                label="Номер телефона 1"
                                disabled={mutation.isPending}
                                placeholder="Номер телефона"
                            />
                        </div>

                        <div className={cls.field}>
                            <PhoneInput
                                value={phoneNumberSecond}
                                setValue={setPhoneNumberSecond}
                                label="Номер телефона 2"
                                disabled={mutation.isPending}
                                placeholder="Номер телефона"
                            />
                            <PhoneInput
                                value={phoneNumberThird}
                                setValue={setPhoneNumberThird}
                                label="Номер телефона 3"
                                disabled={mutation.isPending}
                                placeholder="Номер телефона"
                            />
                        </div>
                    </div>

                    <div className={cls.inputSection}>
                        <div className={cls.field}>
                            <Input
                                value={telegramName}
                                setValue={setTelegramName}
                                label="Название в Telegram"
                                disabled={mutation.isPending}
                                placeholder="Название в Telegram"
                                required
                            />
                            <Input
                                value={telegramLink}
                                setValue={setTelegramLink}
                                label="Cсылка на Telegram"
                                disabled={mutation.isPending}
                                placeholder="https://t.me/..."
                                required
                            />
                        </div>

                        <div className={cls.field}>
                            <Input
                                value={vkName}
                                setValue={setVkName}
                                label="Название в VK"
                                disabled={mutation.isPending}
                                placeholder="Название в VK"
                                required
                            />
                            <Input
                                value={vkLink}
                                setValue={setVkLink}
                                label="Cсылка на VK"
                                disabled={mutation.isPending}
                                placeholder="https://vk.com/..."
                                required
                            />
                        </div>

                        <div className={cls.field}>
                            <Input
                                value={instagramName}
                                setValue={setInstagramName}
                                label="Название в Instagram"
                                disabled={mutation.isPending}
                                placeholder="Название в Instagram"
                                required
                            />
                            <Input
                                value={instagramLink}
                                setValue={setInstagramLink}
                                label="Cсылка на Instagram"
                                disabled={mutation.isPending}
                                placeholder="https://instagram.com/..."
                                required
                            />
                        </div>

                    </div>

                    <div className={cls.inputSection}>
                        <div className={cls.field}>
                            <Switch
                                value={isMainOffice}
                                setValue={setIsMainOffice}
                                label="Главный офис"
                                disabled={mutation.isPending}
                            />
                        </div>
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
