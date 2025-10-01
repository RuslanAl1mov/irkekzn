import { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import SelectInput from "./SelectInput";
import { getMeasurementTypeList } from "../../../api/admin";

const MeasurementTypeSelectInput = ({
  setValue,
  value = null,
  name = "Тип измерения",
  placeholder = "Выберите тип измерения",
  isRequired = false,
  isMulti = false,
  ordering = ["-id"],
  select = ["id", "name"],
  onError,
  ...restProps
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // загружаем полный список типов измерений один раз
  const { data: items = [], isFetching } = useQuery({
    queryKey: ["measurement-types"],
    queryFn: () =>
      getMeasurementTypeList({
        select,
        ordering,
      }).then((res) => res?.result ?? []),
    keepPreviousData: true,
    onError,
  });

  // локальная фильтрация по введённому тексту
  const options = useMemo(
    () =>
      items
        .map((type) => ({
          ...type,
          value: type.id,
          label: type.name,
        }))
        .filter((opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    [items, searchTerm]
  );

  const handleSearchChange = useCallback((text) => {
    setSearchTerm(text);
  }, []);

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

MeasurementTypeSelectInput.propTypes = {
  setValue: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  name: PropTypes.string,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  isMulti: PropTypes.bool,
  ordering: PropTypes.arrayOf(PropTypes.string),
  select: PropTypes.arrayOf(PropTypes.string),
  onError: PropTypes.func,
};

export default MeasurementTypeSelectInput;
