import cls from "./FiltersBlock.module.css";
import cn from "classnames";
import { DateFilter, Search } from "@/features/filters";


type FiltersBlockProps = {
    leftBlockChildren: React.ReactNode;
    leftBlockClassName?: string;
    rightBlockClassName?: string;
    filtersObject: "client" | "employee" | "shop" | "product-category" | "product";
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
                {["client", "employee", "shop", "product-category", "product"].includes(filtersObject) && <Search />}
                {["client", "employee", "product-category", "product"].includes(filtersObject) && <DateFilter type="start" />}
                {["client", "employee"].includes(filtersObject) && <DateFilter type="archivation" />}
            </div>

        </div>
    );
}

