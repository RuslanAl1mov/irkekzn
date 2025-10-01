import { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import "./SelectInput.css";

const SelectInput = ({
  setValue,
  value = null,
  name,
  placeholder = '',
  isRequired = false,
  options = [],
  isMulti = false,
  noOptionsMessage = 'Нет доступных опций',
  setDisabled = false,
  setClearable = true,
  onSearchChange = null,
  showErrorText = true,
}) => {
  const [error, setError] = useState('');

  // При выборе/снятии выбранных опций
  const handleChange = (selectedOption) => {
    setValue(selectedOption);
    if (
      isRequired &&
      (!selectedOption || (Array.isArray(selectedOption) && selectedOption.length === 0))
    ) {
      setError(`Выберите параметр "${name}"!`);
    } else {
      setError('');
    }
  };

  // При уходе фокуса с селекта
  const handleBlur = () => {
    if (
      isRequired &&
      (!value || (Array.isArray(value) && value.length === 0))
    ) {
      setError(`Выберите параметр "${name}"!`);
    } else {
      setError('');
    }
  };

  const getSelectClass = () => (error ? 'si-text-input error' : 'si-text-input');

  /**
   * Слушаем ввод пользователя в строке поиска (react-select).
   * `action` может быть:
   *   - 'input-change' (когда реально меняется текст)
   *   - 'menu-close'
   *   - и т.д.
   * 
   * Возвращаем ту же строку, чтобы react-select продолжал её отображать.
   */
  const handleInputChange = (newInputValue, { action }) => {
    if (action === 'input-change') {
      // Вызываем колбэк, чтобы передать родителю введённый текст
      onSearchChange && onSearchChange(newInputValue);
    }
    return newInputValue;
  };

  /**
   * Кастомные стили, как у вас были раньше
   */
  const customStyles = {
    option: (provided, state) => {
      const {
        color = 'var(--black)',
        backgroundColor = 'transparent',
        hoverBackgroundColor = 'var(--blue-light-1)',
        hoverColor = 'var(--blue)',
      } = state.data;

      const isFocused = state.isFocused;
      const isSelected = state.isSelected;
      const finalTextColor = isFocused ? hoverColor : color;

      return {
        ...provided,
        backgroundColor: isSelected
          ? backgroundColor
          : isFocused
          ? hoverBackgroundColor
          : backgroundColor,
        color: finalTextColor,
        ':active': {
          backgroundColor: isFocused ? hoverBackgroundColor : backgroundColor,
        },
      };
    },
    multiValue: (provided, state) => {
      const {
        backgroundColor = 'var(--blue-light-1)',
        color = 'var(--blue)',
      } = state.data;

      return {
        ...provided,
        backgroundColor,
        color,
      };
    },
    multiValueLabel: (provided, state) => {
      const { color = 'var(--blue)' } = state.data;
      return {
        ...provided,
        color,
      };
    },
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'var(--blue)',
      ':hover': {
        backgroundColor: 'var(--red)',
        color: 'white',
      },
    }),
  };

  return (
    <div className="si-text-input-block">
      <label htmlFor={`si-select-${name}`} className="si-label">
        {name}
        {isRequired && <span className="si-required">*</span>}
      </label>
      <div className="si-input-wrapper">
        <Select
          id={`si-select-${name}`}
          classNamePrefix="react-select"
          className={getSelectClass()}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          // <-- добавляем onInputChange
          onInputChange={handleInputChange}
          placeholder={placeholder}
          options={options}
          isMulti={isMulti}
          isClearable={setClearable}
          noOptionsMessage={() => noOptionsMessage}
          styles={customStyles}
          isDisabled={setDisabled}
        />
      </div>
      {error && showErrorText && (
        <span className="si-error-message" id={`si-error-${name}`}>
          {error}
        </span>
      )}
    </div>
  );
};

SelectInput.propTypes = {
  setValue: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string,
      backgroundColor: PropTypes.string,
      hoverBackgroundColor: PropTypes.string,
      hoverColor: PropTypes.string,
    })
  ).isRequired,
  isMulti: PropTypes.bool,
  noOptionsMessage: PropTypes.string,

  // Новый проп
  onSearchChange: PropTypes.func, // (text: string) => void
};

export default SelectInput;
