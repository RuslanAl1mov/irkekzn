import cls from "./Settings.module.css";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Title } from "@/widgets/title";
import { TabButton, TabsBlock } from "@/shared/ui/tabs";
import { ColorsTab } from "@/features/color";
import { SizesTab } from "@/features/size";
import { SettingsTab } from "@/features/settings";


export const Settings = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<string>();

    useEffect(() => {
        const tabFromUrl = searchParams.get("tab");
        if (!tabFromUrl) selectTab("general");
        else selectTab(tabFromUrl);
    }, []);

    const selectTab = useCallback((tab: string) => {
        setActiveTab(tab);
        setSearchParams({ tab }, { replace: true });
    }, [setSearchParams]);

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
