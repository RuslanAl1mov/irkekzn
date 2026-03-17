import cls from "./FiltersBlock.module.css";
import cn from "classnames";
import { DateFilter, Search } from "@/features/filters";


type FiltersBlockProps = {
    leftBlockChildren: React.ReactNode;
    leftBlockClassName?: string;
    rightBlockClassName?: string;
    filtersObject: "client" | "employee" | "shop";
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
                {["client", "employee", "shop"].includes(filtersObject) && <Search />}
                {["client", "employee"].includes(filtersObject) && <DateFilter type="start" />}
                {["client", "employee"].includes(filtersObject) && <DateFilter type="archivation" />}
            </div>

        </div>
    );
}

