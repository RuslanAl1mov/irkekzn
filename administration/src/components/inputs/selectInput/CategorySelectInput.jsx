import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { getProductCategoryList } from "../../../api/admin";
import SelectInput from "./SelectInput";

const CategorySelectInput = ({
  setValue,
  value = null,
  name = "Категория",
  placeholder = "Выберите категорию",
  isRequired = false,
  isMulti = false,
  pageSize = 50,
  ordering = ["name"],
  select = [],
  onError,
  ...restProps
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  /** Загрузка категорий */
  const {
    data: options = [],
    isFetching,
  } = useQuery({
    queryKey: ["product-categories", searchTerm],
    queryFn: () =>
      getProductCategoryList({
        page: 1,
        pageSize,
        search: searchTerm,
        select,
        ordering,
      }).then((res) =>
        (res?.result || []).map((cat) => ({
          ...cat,
          value: cat.id,
          label: cat.name,
        }))
      ),
    keepPreviousData: true,
    onError,
  });

  /** Обработчик поиска */
  const handleSearchChange = useCallback((text) => setSearchTerm(text), []);

  return (
    <SelectInput
      setValue={setValue}
      value={value}
      name={name}
      placeholder={placeholder}
      isRequired={isRequired}
      options={options}
      isMulti={isMulti}
      onSearchChange={handleSearchChange}
      isDisabled={isFetching}
      {...restProps}
    />
  );
};

CategorySelectInput.propTypes = {
  setValue: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  name: PropTypes.string,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  isMulti: PropTypes.bool,
  pageSize: PropTypes.number,
  ordering: PropTypes.arrayOf(PropTypes.string),
  select: PropTypes.arrayOf(PropTypes.string),
  onError: PropTypes.func,
};

export default CategorySelectInput;
