import cls from "./ShopInfoForm.module.css";

import { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/lib/react-query/queryKeys";

import { useShopInfoStore } from "../model/store";
import { formatPhoneNumber } from "@/shared/lib/formater/";
import { Modal } from "@/shared/ui/modal";
import { type IShop, getShop } from "@/entities/shop";


export const ShopInfoForm = (): JSX.Element | null => {
    const { isOpen, shop, close } = useShopInfoStore();
    const shopId = shop?.id ?? null;

    const { data: shopDetails } = useQuery<IShop>({
        queryKey: queryKeys.shopDetail(shopId),
        queryFn: async (): Promise<IShop> => {
            if (shopId === null) {
                throw new Error("Shop id is required");
            }
            return getShop(shopId);
        },
        enabled: isOpen && shopId !== null,
        refetchOnWindowFocus: false,
    });

    if (!isOpen || !shop) return null;

    const currentShop = shopDetails ?? shop;
    const shopInfo = [
        { label: "ID", value: String(currentShop.id) },
        { label: "", value: "" },
        { label: "Название", value: currentShop.name || "-" },
        { label: "Город", value: currentShop.city || "-" },
        { label: "Адрес", value: currentShop.address || "-" },
        { label: "", value: "" },
        { label: "Email", value: currentShop.email || "-" },
        { label: "Телефон 1", value: formatPhoneNumber(currentShop.phone_first) || "-" },
        { label: "Телефон 2", value: formatPhoneNumber(currentShop.phone_second) || "-" },
        { label: "Телефон 3", value: formatPhoneNumber(currentShop.phone_third) || "-" },
        { label: "Ссылка на карту", value: currentShop.map_location || "-" },
        { label: "", value: "" },
        { label: "Telegram", value: currentShop.telegram_link || "-" },
        { label: "Название Telegram", value: currentShop.telegram_name || "-" },
        { label: "VK", value: currentShop.vk_link || "-" },
        { label: "Название VK", value: currentShop.vk_name || "-" },
        { label: "Instagram", value: currentShop.instagram_link || "-" },
        { label: "Название Instagram", value: currentShop.instagram_name || "-" },
        { label: "", value: "" },
        { label: "Активен", value: currentShop.is_active ? "Да" : "Нет" },
        { label: "Основной офис", value: currentShop.is_main_office ? "Да" : "Нет" },
    ];


    return (
        <Modal
            title="Информация о бутике"
            subTitle="Информация о бутике"
            closeBtnTitle="Закрыть"
            onClose={close}
        >

            <div className={cls.infoSection}>
                {shopInfo.map((item) => (
                    <div key={item.label} className={cls.infoRow}>
                        <span className={cls.infoLabel}>{item.label}</span>
                        <span className={cls.infoValue}>{item.value}</span>
                    </div>
                ))}
            </div>
        </Modal>
    );
};
