import { useContext } from "react";
import "./AppFilters.css";
import "./ProductMinPriceFilter.css";
import { FiltersContext } from "../../../context/FiltersContext";
import DefaultFloatInput from "../../inputs/defaultFloatInput/DefaultFloatInput";

const ProductMinPriceFilter = ({ className = "" }) => {
  const { minPrice, setMinPrice } = useContext(FiltersContext);

  return (
    <div className={`fcb-component-filter-block ppf-product-price-filter-block ${minPrice && "ppf-product-price-filter-block--inserted"} ${className}`}>
      { minPrice ? <p>От</p> : "" }
      <DefaultFloatInput
        placeholder="Цена от"
        value={minPrice}
        setValue={setMinPrice}
        minValue={0}
        className={`ppf-float-input-comp ${minPrice && "ppf-float-input-comp--inserted"}`}
        suffix={"сум"}
      />
    </div>
  );
};

export default ProductMinPriceFilter;
