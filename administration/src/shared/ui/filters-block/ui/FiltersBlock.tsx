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
                {["product-stock"].includes(filtersObject) && <ProductFilter />}
                {["product-category", "product-stock", "product"].includes(filtersObject) && (<ProductCategoryFilter />)}
                {["product-stock"].includes(filtersObject) && <SizeFilter />}
                {["product-stock"].includes(filtersObject) && <ShopFilter />}
                {["client", "employee", "product-category", "product", "product-stock"].includes(filtersObject) && <DateFilter type="start" />}
                
                {["client", "employee"].includes(filtersObject) && <DateFilter type="archivation" />}
            </div>
        </div>
    );
}

