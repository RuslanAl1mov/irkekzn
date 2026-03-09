import cn from "classnames";
import cls from "./Title.module.css";

interface Props {
    title?: string;
    subTitle?: string;
    size?: "h1" | "h2" | "h3";
    className?: string;
    titleClassName?: string;
    subTitleClassName?: string;
}

export const Title = ({
    title,
    subTitle,
    size = "h1",
    className,
    titleClassName,
    subTitleClassName,
}: Props) => {
    return (
        <div className={cn(cls.root, className)}>
            <h1 className={cn(cls.title, cls[size], titleClassName)}>
                {title}
            </h1>
            <p className={cn(cls.subTitle, subTitleClassName)}>
                {subTitle}
            </p>
        </div>
    );
};
