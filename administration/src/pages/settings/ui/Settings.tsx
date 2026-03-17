import { Title } from "@/widgets/title";
import cls from "./Settings.module.css";


export const Settings = () => {
    return (
        <section className={cls.section}>
            <div className={cls.titleBlock}>
                <Title
                    title="Настройки системы"
                    subTitle="Управляйте настройками системы и ее функционалом"
                />
            </div>
        </section>
    );
}
