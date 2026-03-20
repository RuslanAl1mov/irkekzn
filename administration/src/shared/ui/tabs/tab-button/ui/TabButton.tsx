import cls from "./TabButton.module.css";
import cn from "classnames";


type TabButtonProps = {
    text: string;
    onClick: () => void;
    isActive?: boolean;
}

export const TabButton = ({ text, onClick, isActive = false }: TabButtonProps) => {
    return (
        <button className={cn(cls.tabButton, isActive && cls.tabButton__active)} onClick={onClick}>
            <span className={cls.tabButtonText}>{text}</span>
        </button>
    );
}