import cls from "./TabsBlock.module.css";


type TabsBlockProps = {
    children: React.ReactNode;
}

export const TabsBlock = ({ children }: TabsBlockProps) => {
    return (
        <div className={cls.tabsBlock}>
            {children}
        </div>
    );
}
