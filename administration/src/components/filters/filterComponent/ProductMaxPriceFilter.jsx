import { useContext } from "react";
import "./AppFilters.css";
import "./ProductMaxPriceFilter.css";
import { FiltersContext } from "../../../context/FiltersContext";
import DefaultFloatInput from "../../inputs/defaultFloatInput/DefaultFloatInput";


const ProductMaxPriceFilter = ({ className = "" }) => {
  const { maxPrice, setMaxPrice } = useContext(FiltersContext);

  return (
    <div className={`fcb-component-filter-block ppf-product-price-filter-block ${maxPrice && "ppf-product-price-filter-block--inserted"} ${className}`}>
        { maxPrice ? <p>До</p> : "" }
      <DefaultFloatInput
        placeholder="Цена до"
        value={maxPrice}
        setValue={setMaxPrice}
        minValue={0}
        className={`ppf-float-input-comp ${maxPrice && "ppf-float-input-comp--inserted"}`}
        suffix={"сум"}      
        />
    </div>
  );
};

export default ProductMaxPriceFilter;
