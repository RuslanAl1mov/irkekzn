import { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import SelectInput from "./SelectInput";
import { getMeasurementUnitList } from "../../../api/admin";

const MeasurementUnitSelectInput = ({
  setValue,
  value = null,
  name = "Единица измерения",
  placeholder = "Выберите единицу измерения",
  isRequired = false,
  isMulti = false,
  ordering = ["-id"],
  select = ["id", "name"],
  onError,
  ...restProps
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // загружаем полный список единиц измерения один раз
  const { data: items = [], isFetching } = useQuery({
    queryKey: ["measurement-units"],
    queryFn: () =>
      getMeasurementUnitList({
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
        .map((unit) => ({
          ...unit,
          value: unit.id,
          label: unit.name,
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

MeasurementUnitSelectInput.propTypes = {
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

export default MeasurementUnitSelectInput;
