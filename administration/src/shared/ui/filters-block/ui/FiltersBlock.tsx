import cls from "./FiltersBlock.module.css";
import cn from "classnames";
import {
    DateFilter,
    Search,
    ProductFilter,
    ProductCategoryFilter,
    SizeFilter,
    ShopFilter,
} from "@/features/filters";


type FiltersBlockProps = {
    leftBlockChildren: React.ReactNode;
    leftBlockClassName?: string;
    rightBlockClassName?: string;
    filtersObject: "client" | "employee" | "shop" | "product-category" | "product" | "product-stock";
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
                {["client", "employee", "shop", "product-category", "product", "product-stock"].includes(filtersObject) && <Search />}
                {["client", "employee", "product-category", "product"].includes(filtersObject) && <DateFilter type="start" />}
                {["product-category", "product-stock"].includes(filtersObject) && <ProductCategoryFilter />}
                {["product-stock"].includes(filtersObject) && < SizeFilter />}
                {["product-stock"].includes(filtersObject) && <ShopFilter />}
                {["product-stock"].includes(filtersObject) && <ProductFilter />}
                
                {["client", "employee"].includes(filtersObject) && <DateFilter type="archivation" />}
            </div>
        </div>
    );
}

