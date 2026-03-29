import cls from "./SettingsTab.module.css";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import cn from "classnames";
import { toast } from "react-toastify";

import { getSettings } from "@/entities/settings/api/getSettings.api";
import { updateSettings } from "@/entities/settings/api/updateSettings.api";
import type { ISettings, ISettingsPayload } from "@/entities/settings/model/type";
import { queryKeys } from "@/shared/lib/react-query/queryKeys";
import { Switch } from "@/shared/ui";
import { Loader } from "@/widgets/loader";
import { Title } from "@/widgets/title";

const DEFAULT_SETTINGS: ISettingsPayload = {
    set_global_product_card_settings: false,
    is_all_products_same_name: false,
    is_all_products_same_price: false,
    is_all_products_same_description: false,
    is_all_products_same_model: false,
};

const toSettingsPayload = (settings: ISettings | ISettingsPayload): ISettingsPayload => ({
    set_global_product_card_settings: settings.set_global_product_card_settings,
    is_all_products_same_name: settings.is_all_products_same_name,
    is_all_products_same_price: settings.is_all_products_same_price,
    is_all_products_same_description: settings.is_all_products_same_description,
    is_all_products_same_model: settings.is_all_products_same_model,
});

export const SettingsTab = () => {
    const queryClient = useQueryClient();
    const [settings, setSettings] = useState<ISettingsPayload>(DEFAULT_SETTINGS);
    const [isInitialized, setIsInitialized] = useState(false);

    const {
        data: settingsData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: queryKeys.settings(),
        queryFn: getSettings,
        staleTime: 5 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const mutation = useMutation({
        mutationFn: (payload: ISettingsPayload) => updateSettings(payload),
        onSuccess: (updatedSettings) => {
            queryClient.setQueryData(queryKeys.settings(), updatedSettings);
        },
        onError: (updateError) => {
            toast.error(updateError.message, { toastId: updateError.message });
        },
    });

    useEffect(() => {
        if (!settingsData || isInitialized) return;

        setSettings(toSettingsPayload(settingsData));
        setIsInitialized(true);
    }, [isInitialized, settingsData]);

    useEffect(() => {
        if (!isError) return;

        const err = error as AxiosError<{ error?: string; detail?: string }>;
        toast.error(err.message, { toastId: err.message });
    }, [isError, error]);

    const updateSetting = <K extends keyof ISettingsPayload>(key: K, value: ISettingsPayload[K]) => {
        const nextSettings = {
            ...settings,
            [key]: value,
        };

        setSettings(nextSettings);
        mutation.mutate(nextSettings);
    };


    return (
        <div className={cls.wrapper}>
            <div className={cls.header}>
                <Title
                    size="h2"
                    title="Настройки системы"
                    subTitle="Управляйте настройками всей системы в одном месте"
                />
            </div>

            <div className={cls.content}>
                {isLoading ? (
                    <div className={cls.loaderErrorBlock}>
                        <Loader size={30} strokeWidth={6} />
                    </div>
                ) : (
                    <>
                        <div className={cls.settingsBlock}>
                            <Title size="h5" title="Товары" />
                            <div className={cls.settingsContentBlock}>
                                <div className={cls.settingsRow}>
                                    <Switch
                                        label="Использовать общие настройки карточкек товаров"
                                        value={settings.set_global_product_card_settings}
                                        setValue={(value) => updateSetting("set_global_product_card_settings", value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div
                                    className={cn(
                                        cls.settingsRow,
                                        cls.settingsSubRow,
                                        cls.settingsSubRow__first,
                                        { [cls.settingsSubRow__disabled]: isLoading || !settings.set_global_product_card_settings },
                                    )}
                                >
                                    <Switch
                                        label="Все модификации товаров имеют одинаковое название"
                                        value={settings.is_all_products_same_name}
                                        setValue={(value) => updateSetting("is_all_products_same_name", value)}
                                        disabled={isLoading || !settings.set_global_product_card_settings}
                                    />
                                </div>
                                <div
                                    className={cn(
                                        cls.settingsRow,
                                        cls.settingsSubRow,
                                        { [cls.settingsSubRow__disabled]: isLoading || !settings.set_global_product_card_settings },
                                    )}
                                >
                                    <Switch
                                        label="Все модификации товаров имеют одинаковую цену"
                                        value={settings.is_all_products_same_price}
                                        setValue={(value) => updateSetting("is_all_products_same_price", value)}
                                        disabled={isLoading || !settings.set_global_product_card_settings}
                                    />
                                </div>
                                <div
                                    className={cn(
                                        cls.settingsRow,
                                        cls.settingsSubRow,
                                        { [cls.settingsSubRow__disabled]: isLoading || !settings.set_global_product_card_settings },
                                    )}
                                >
                                    <Switch
                                        label="Все модификации товаров имеют одинаковое описание"
                                        value={settings.is_all_products_same_description}
                                        setValue={(value) => updateSetting("is_all_products_same_description", value)}
                                        disabled={isLoading || !settings.set_global_product_card_settings}
                                    />
                                </div>
                                <div
                                    className={cn(
                                        cls.settingsRow,
                                        cls.settingsSubRow,
                                        { [cls.settingsSubRow__disabled]: isLoading || !settings.set_global_product_card_settings },
                                    )}
                                >
                                    <Switch
                                        label="Все модификации товаров имеют одинаковую модель"
                                        value={settings.is_all_products_same_model}
                                        setValue={(value) => updateSetting("is_all_products_same_model", value)}
                                        disabled={isLoading || !settings.set_global_product_card_settings}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
