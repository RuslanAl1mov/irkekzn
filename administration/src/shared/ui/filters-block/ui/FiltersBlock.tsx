import cls from "./FiltersBlock.module.css";
import cn from "classnames";
import { Search } from "@/features/filters";


type FiltersBlockProps = {
    leftBlockChildren: React.ReactNode;
    leftBlockClassName?: string;
    rightBlockClassName?: string;
    filtersObject: "client" | "employee";
}

export const FiltersBlock: React.FC<FiltersBlockProps> = ({
    leftBlockChildren,
    leftBlockClassName,
    rightBlockClassName,
    filtersObject }) => {
    return (
        <div className={cls.wrapper}>
            <div className={cn(cls.leftBlock, leftBlockClassName)}>
                {leftBlockChildren}
            </div>

            <div className={cn(cls.rightBlock, rightBlockClassName)}>
                {["client", "employee"].includes(filtersObject) && <Search />}
            </div>
        </div>
    );
}

