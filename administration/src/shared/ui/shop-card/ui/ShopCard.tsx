import cls from "./ShopCard.module.css"
import cn from "classnames";

import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";
import { useEffect, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShopEditStore } from "@/features/shop";
import { useConfirmationStore } from "@/widgets/confirmation";
import { useShopInfoStore } from "@/features/shop";
import { deleteShop, updateShop, type IShop, type IShopPayload } from "@/entities/shop";

import { Title } from "@/widgets/title";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";

import OfficeIcon from "@/assets/icons/office.svg?react";
import HouseIcon from "@/assets/icons/house.svg?react";
import EditIcon from "@/assets/icons/edit.svg?react";
import EyeIcon from "@/assets/icons/eye_open.svg?react";
import DeleteIcon from "@/assets/icons/trash-bin.svg?react";


type ShopCardProps = {
    shop: IShop;
}

export const ShopCard = ({ shop }: ShopCardProps) => {
    const { open: openShopEdit } = useShopEditStore();
    const { open: openShopInfo } = useShopInfoStore();
    const queryClient = useQueryClient();
    const { open: openConfirmation } = useConfirmationStore();
    const [isActive, setIsActive] = useState<boolean>(shop.is_active);
    const [isMainOffice, setIsMainOffice] = useState<boolean>(shop.is_main_office);

    useEffect(() => {
        setIsActive(shop.is_active);
        setIsMainOffice(shop.is_main_office);
    }, [shop]);

    const shopId = shop.id;
    const shopName = shop.name;
    const shopAddress = shop.address;
    const shopCity = shop.city;
    const phoneFirst = shop.phone_first

    const mutation = useMutation({
        mutationFn: async () => {
            const shopPayload: IShopPayload = {
                name: shopName,
                phone_first: phoneFirst,
                address: shopAddress,
                city: shopCity,
                is_main_office: isMainOffice,
                is_active: isActive,
            };

            return updateShop(shopId, shopPayload);
        },
        onSuccess: async (updatedShop) => {
            queryClient.setQueryData(queryKeys.shopDetail(shopId), updatedShop);
            queryClient.invalidateQueries({ queryKey: queryKeys.shopLists() });
            toast.success("Обновлено!", { toastId: shopId.toString() });
        },
        onError: (error) => {
            toast.error(error.message, { toastId: shopId.toString() });
        },
    });

    const handleIsActiveChange = (value: boolean) => {
        setIsActive(value);
        mutation.mutate();
    };

    const handleShopIsMainOfficeChange = (value: boolean) => {
        if (value == false) {
            setIsMainOffice(true);
            toast.error("Основной офис можно изменить установив другой офис как основной");
            return;
        }

        setIsMainOffice(true);
        mutation.mutate();
    };

    const deleteMutation = useMutation({
        mutationFn: (shopId: number) => deleteShop(shopId),
        onSuccess: async (_, shopId) => {
            queryClient.removeQueries({ queryKey: queryKeys.shopDetail(shopId) });
            await queryClient.invalidateQueries({ queryKey: queryKeys.shopLists() });
            toast.success("Бутик успешно удален");
        },
        onError: (mutationError) => {
            const err = mutationError as AxiosError<{ error: string }>;
            toast.error(err.message, { toastId: err.message });
        },
    });


    const handleDeleteShop = (shop: IShop) => {
        openConfirmation({
            type: "deletion_confirm",
            title: `Удалить бутик "${shop.name}"?`,
            subTitle: "Магазин будет удален без возможности восстановления. Подтвердите действие.",
            confirmBtnTitle: "Удалить",
            closeBtnTitle: "Отмена",
            onConfirm: () => deleteMutation.mutate(shop.id),
        });
    };

    return (
        <div key={shop.id} className={cls.wrapper}>
            <div className={cls.headerBlock}>
                <div className={cls.headerIconBlock}>
                    {shop.is_main_office ?
                        <OfficeIcon className={cls.headerIcon} />
                        : <HouseIcon className={cn(cls.headerIcon, cls.houseIcon)} />
                    }
                </div>
                <Title
                    title={shopName}
                    titleClassName={cls.headerTitle}
                    subTitle={shopAddress}
                    subTitleClassName={cls.headerSubTitle}
                    size="h6"
                    className={cls.headerTitle} />
                <div className={cls.actionsBlock}>
                    <Button type="button" variant="default" className={cls.actionButton} onClick={() => openShopInfo(shop)}>
                        <EyeIcon className={cn(cls.buttonIcon, cls.eyeButtonIcon)} />
                    </Button>
                    <Button type="button" variant="default" className={cls.actionButton} onClick={() => openShopEdit(shop)}>
                        <EditIcon className={cn(cls.buttonIcon, cls.editButtonIcon)} />
                    </Button>
                    <Button
                        type="button"
                        variant="default"
                        className={cls.actionButton}
                        onClick={() => handleDeleteShop(shop)}
                        disabled={deleteMutation.isPending}
                    >
                        <DeleteIcon className={cn(cls.buttonIcon, cls.deleteButtonIcon)} />
                    </Button>
                </div>
            </div>

            <div className={cls.contentBlock}>
                <div className={cls.contentRow}>
                    <div className={cls.titleCell}>Статус:</div>
                    <div className={cls.valueCell}>
                        <Switch value={isActive} setValue={handleIsActiveChange} disabled={mutation.isPending} />
                    </div>
                </div>
                <div className={cls.contentRow}>
                    <div className={cls.titleCell}>Основной офис:</div>
                    <div className={cls.valueCell}>
                        <Switch value={isMainOffice} setValue={handleShopIsMainOfficeChange} disabled={mutation.isPending} />
                    </div>
                </div>
                <div className={cls.contentRow}>
                    <div className={cls.titleCell}>Категорий:</div>
                    <div className={cls.valueCell}>0 шт.</div>
                </div>
                <div className={cls.contentRow}>
                    <div className={cls.titleCell}>Товаров:</div>
                    <div className={cls.valueCell}>0 шт.</div>
                </div>
            </div>

        </div>

    );
}