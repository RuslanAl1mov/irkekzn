import cn from "classnames";
import cls from "./Title.module.css";

interface Props {
    title?: string | null;
    subTitle?: string | null;
    size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
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
            {title && (
                <h1 className={cn(cls.title, cls[size], titleClassName)}>
                    {title}
                </h1>
            )}
            {subTitle && (
                <p className={cn(cls.subTitle, subTitleClassName)}>
                    {subTitle}
                </p>
            )}
        </div>
    );
};
