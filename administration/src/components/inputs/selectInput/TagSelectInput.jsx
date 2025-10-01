import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { getProductTagList } from "../../../api/admin";
import SelectInput from "./SelectInput";

/**
 * Выпадающий список тегов.
 *
 * Если пустой или не указан, загружаем теги без фильтра по категориям.
 */
const TagSelectInput = ({
    setValue,
    value = null,
    name = "Тег",
    placeholder = "Выберите тег",
    isRequired = false,
    isMulti = false,
    pageSize = 50,
    ordering = ["name"],
    select = [],
    onError,
    ...restProps
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    /** Загрузка тегов */
    const {
        data: options = [],
        isFetching,
    } = useQuery({
        queryKey: ["product-tags", searchTerm],
        queryFn: () =>
            getProductTagList({
                page: 1,
                pageSize,
                search: searchTerm,
                select,
                ordering,
            }).then((res) =>
                (res?.result || []).map((tag) => ({
                    ...tag,
                    value: tag.id,
                    label: tag.name,
                }))
            ),
        keepPreviousData: true,
        onError,
        staleTime: 5 * 60 * 1000,
    });

    /** Обработчик поиска  */
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

TagSelectInput.propTypes = {
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

export default TagSelectInput;
