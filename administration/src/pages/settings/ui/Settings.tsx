import { Title } from "@/widgets/title";
import cls from "./Settings.module.css";
import { TabButton } from "@/shared/ui/tabs/tab-button/ui/TabButton";
import { TabsBlock } from "@/shared/ui/tabs/tabs-block/ui/TabsBlock";
import { useState } from "react";
import { ColorsTab } from "@/features/color";


export const Settings = () => {

    const [activeTab, setActiveTab] = useState<string>("profile");


    return (
        <section className={cls.section}>
            <div className={cls.titleBlock}>
                <Title
                    title="Настройки системы"
                    subTitle="Управляйте настройками системы и ее функционалом"
                />
            </div>

            <div className={cls.content}>
                <TabsBlock>
                    <TabButton text="Профиль" onClick={() => { setActiveTab("profile") }} isActive={activeTab === "profile"} />
                    <TabButton text="Общее" onClick={() => { setActiveTab("general") }} isActive={activeTab === "general"} />
                    <TabButton text="Таблица размеров" onClick={() => { setActiveTab("sizes-table") }} isActive={activeTab === "sizes-table"} />
                    <TabButton text="Цветовая палитра" onClick={() => { setActiveTab("color-palette") }} isActive={activeTab === "color-palette"} />
                </TabsBlock>

                {activeTab === "color-palette" && <ColorsTab />}
            </div>
        </section>
    );
}
