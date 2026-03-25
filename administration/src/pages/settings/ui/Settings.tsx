import { Title } from "@/widgets/title";
import cls from "./Settings.module.css";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ColorsTab } from "@/features/color";
import { SizesTab } from "@/features/size";
import { TabButton, TabsBlock } from "@/shared/ui/tabs";
import { SettingsTab } from "@/features/settings";

const SETTINGS_TABS = ["general", "sizes-table", "color-palette", "permissions"] as const;
type SettingsTabId = (typeof SETTINGS_TABS)[number];

const isSettingsTab = (value: string | null): value is SettingsTabId =>
    Boolean(value && SETTINGS_TABS.includes(value as SettingsTabId));

export const Settings = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get("tab");

    const [activeTab, setActiveTab] = useState<SettingsTabId>(() => {
        const fromWindow = new URLSearchParams(window.location.search).get("tab");
        return isSettingsTab(fromWindow) ? fromWindow : "general";
    });

    useEffect(() => {
        if (isSettingsTab(tabFromUrl)) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    const selectTab = useCallback(
        (tab: SettingsTabId) => {
            setActiveTab(tab);
            setSearchParams({ tab }, { replace: true });
        },
        [setSearchParams],
    );

    return (
        <section className={cls.section}>
            <div className={cls.titleBlock}>
                <Title
                    title="Настройки системы"
                    subTitle="Управляйте настройками системы и ее функционалом"
                />


            </div>

            <div className={cls.content}>
                <div className={cls.tabsBlock}>
                    <TabsBlock>
                        <TabButton text="Общее" onClick={() => selectTab("general")} isActive={activeTab === "general"} />
                        <TabButton text="Таблица размеров" onClick={() => selectTab("sizes-table")} isActive={activeTab === "sizes-table"} />
                        <TabButton text="Цветовая палитра" onClick={() => selectTab("color-palette")} isActive={activeTab === "color-palette"} />
                        <TabButton text="Права и доступы" onClick={() => selectTab("permissions")} isActive={activeTab === "permissions"} />
                    </TabsBlock>
                </div>

                {activeTab === "sizes-table" && <SizesTab />}
                {activeTab === "color-palette" && <ColorsTab />}
                {activeTab === "general" && <SettingsTab />}
            </div>
        </section>
    );
}
