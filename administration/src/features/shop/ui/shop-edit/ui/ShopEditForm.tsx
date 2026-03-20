import cls from "./ShopEditForm.module.css";

import { useEffect, useState, type JSX } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { getShop, updateShop } from "@/entities/shop";
import type { IShop, IShopPayload } from "@/entities/shop";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";

import { Input, PhoneInput, Switch } from "@/shared/ui";

import { useShopEditStore } from "../model/store";
import { Modal } from "@/shared/ui/modal";


export const ShopEditForm = (): JSX.Element | null => {
    const { isOpen, shop, close } = useShopEditStore();
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
    const shopId = shop?.id ?? null;

    const { data: shopDetails, isLoading } = useQuery<IShop>({
        queryKey: queryKeys.shopDetail(shopId),
        queryFn: async (): Promise<IShop> => {
            if (shopId === null) {
                throw new Error("Shop id is required");
            }

            return getShop(shopId);
        },
        enabled: isOpen && shop !== null,
        refetchOnWindowFocus: false,
    });


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

            return updateShop(shop!.id, shopPayload);
        },
        onSuccess: async (updatedShop) => {
            queryClient.setQueryData(queryKeys.shopDetail(updatedShop.id), updatedShop);
            await queryClient.invalidateQueries({ queryKey: queryKeys.shopLists() });
            toast.success("Бутик успешно отредактирован");
            handleClose();
        },
        onError: (error) => {
            toast.error(error.message, { toastId: error.message });
        },
    });


    useEffect(() => {
        const currentShop = shopDetails ?? shop;

        if (!currentShop) return;

        setName(currentShop.name ?? "");
        setCity(currentShop.city ?? "");
        setAddress(currentShop.address ?? "");
        setEmail(currentShop.email ?? "");
        setPhoneNumberFirst(currentShop.phone_first ?? "");
        setPhoneNumberSecond(currentShop.phone_second ?? "");
        setPhoneNumberThird(currentShop.phone_third ?? "");
        setTelegramName(currentShop.telegram_name ?? "");
        setTelegramLink(currentShop.telegram_link ?? "");
        setVkName(currentShop.vk_name ?? "");
        setVkLink(currentShop.vk_link ?? "");
        setInstagramName(currentShop.instagram_name ?? "");
        setInstagramLink(currentShop.instagram_link ?? "");
        setIsMainOffice(currentShop.is_main_office);
        setIsActive(currentShop.is_active);
    }, [shop, shopDetails]);

    if (!isOpen || !shop) return null;

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
            title="Редактировать бутик"
            subTitle="Введите данные для редактирования бутика"
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
                                placeholder="Название бутика"
                                disabled={isLoading || mutation.isPending}
                                required
                            />
                        </div>

                        <div className={cls.field}>
                            <Input
                                value={city}
                                setValue={setCity}
                                label="Город"
                                disabled={isLoading || mutation.isPending}
                                placeholder="Город бутика"
                                required
                            />
                            <Input
                                value={address}
                                setValue={setAddress}
                                label="Адрес"
                                disabled={isLoading || mutation.isPending}
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
                                disabled={isLoading || mutation.isPending}
                                placeholder="Email"
                            />

                            <PhoneInput
                                value={phoneNumberFirst}
                                setValue={setPhoneNumberFirst}
                                label="Номер телефона 1"
                                disabled={isLoading || mutation.isPending}
                                placeholder="Номер телефона"
                            />
                        </div>

                        <div className={cls.field}>
                            <PhoneInput
                                value={phoneNumberSecond}
                                setValue={setPhoneNumberSecond}
                                label="Номер телефона 2"
                                disabled={isLoading || mutation.isPending}
                                placeholder="Номер телефона"
                            />
                            <PhoneInput
                                value={phoneNumberThird}
                                setValue={setPhoneNumberThird}
                                label="Номер телефона 3"
                                disabled={isLoading || mutation.isPending}
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
                                disabled={isLoading || mutation.isPending}
                                placeholder="Название в Telegram"
                                required
                            />
                            <Input
                                value={telegramLink}
                                setValue={setTelegramLink}
                                label="Cсылка на Telegram"
                                disabled={isLoading || mutation.isPending}
                                placeholder="https://t.me/..."
                                required
                            />
                        </div>

                        <div className={cls.field}>
                            <Input
                                value={vkName}
                                setValue={setVkName}
                                label="Название в VK"
                                disabled={isLoading || mutation.isPending}
                                placeholder="Название в VK"
                                required
                            />
                            <Input
                                value={vkLink}
                                setValue={setVkLink}
                                label="Cсылка на VK"
                                disabled={isLoading || mutation.isPending}
                                placeholder="https://vk.com/..."
                                required
                            />
                        </div>

                        <div className={cls.field}>
                            <Input
                                value={instagramName}
                                setValue={setInstagramName}
                                label="Название в Instagram"
                                disabled={isLoading || mutation.isPending}
                                placeholder="Название в Instagram"
                                required
                            />
                            <Input
                                value={instagramLink}
                                setValue={setInstagramLink}
                                label="Cсылка на Instagram"
                                disabled={isLoading || mutation.isPending}
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
                                disabled={isLoading || mutation.isPending}
                            />
                        </div>
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
