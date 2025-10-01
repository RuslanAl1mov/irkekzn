import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './DefaultFloatInputStyle.css';
import { formatNumberWithSpaces } from '../../../utils/formatNumberWithSpaces';

const DefaultFloatInput = ({
  setValue,
  value = '',
  name,
  placeholder = '',
  isRequired = false,
  setDisabled = false,
  suffix = null,        // Проп для суффикса
  maxValue,             // Максимальное значение
  minValue,             // Минимальное значение
  maxDecimals,          // Максимальное количество цифр после запятой
  showErrorText=true,
  className=""
}) => {
  const [error, setError] = useState('');

  // Вспомогательная функция для форматирования числа с разделением групп цифр
  const formatNumber = (num) => {
    let [integerPart, decimalPart] = num.toString().split('.');
    if (integerPart) {
      integerPart = integerPart.replace(/\s+/g, '').replace(/^0+(?!$)/, '');
    }
    if (integerPart) {
      integerPart = integerPart
        .split('')
        .reverse()
        .join('')
        .replace(/\d{3}(?=\d)/g, '$& ')
        .split('')
        .reverse()
        .join('');
    }
    let formatted = integerPart;
    if (decimalPart !== undefined) {
      formatted += '.' + decimalPart;
    }
    return formatted;
  };

  const handleChange = (e) => {
    let inputValue = e.target.value;

    // Заменяем запятые на точки
    inputValue = inputValue.replace(/,/g, '.');

    // Удаляем все символы, кроме цифр и точки
    inputValue = inputValue.replace(/[^\d.]/g, '');

    // Если несколько точек, оставляем только первую
    const parts = inputValue.split('.');
    if (parts.length > 2) {
      inputValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // Разделяем на целую и дробную часть
    let [integerPart, decimalPart] = inputValue.split('.');

    // Если пользователь ввёл только точку или хочет начать с точки
    if (!integerPart && inputValue.startsWith('.')) {
      integerPart = '0';
    }

    if (integerPart) {
      integerPart = integerPart.replace(/\s+/g, '');
      integerPart = integerPart.replace(/^0+(?!$)/, '');
    }

    // Ограничиваем количество цифр после запятой, если задан maxDecimals
    if (decimalPart !== undefined && maxDecimals !== undefined && decimalPart.length > maxDecimals) {
      decimalPart = decimalPart.substring(0, maxDecimals);
    }

    // Форматируем целую часть — добавляем пробелы через каждые 3 цифры (с конца)
    if (integerPart) {
      integerPart = integerPart
        .split('')
        .reverse()
        .join('')
        .replace(/\d{3}(?=\d)/g, '$& ')
        .split('')
        .reverse()
        .join('');
    }

    // Собираем обратно целую и дробную часть
    let formattedValue = integerPart;
    if (decimalPart !== undefined) {
      formattedValue += '.' + decimalPart;
    }

    // Валидация: обязательное поле и проверка на min/max значения (если заданы)
    let errorMsg = '';
    if (isRequired && !formattedValue.trim()) {
      errorMsg = `Поле "${name}" обязательно к заполнению!`;
    } else if (formattedValue.trim()) {
      let numericValue = parseFloat(formattedValue.replace(/\s/g, ''));
      if (minValue !== undefined && numericValue < minValue) {
        numericValue = minValue;
        formattedValue = formatNumber(numericValue);
        errorMsg = `Значение не может быть меньше ${formatNumberWithSpaces(minValue)}`;
      } else if (maxValue !== undefined && numericValue > maxValue) {
        numericValue = maxValue;
        formattedValue = formatNumber(numericValue);
        errorMsg = `Значение не может быть больше ${formatNumberWithSpaces(maxValue)}`;
      }
    }

    setError(errorMsg);
    setValue(formattedValue);
  };

  return (
    <div className={`dtfi-float-input-block ${className}`}>
      <label htmlFor={`dtfi-${name}`}>
        {name}
        {isRequired && <span className="dtfi-required">*</span>}
      </label>

      <div className="dtfi-float-input-wrapper">
        <input
          type="text"
          id={`dtfi-${name}`}
          className={`dtfi-float-input ${isRequired && error ? 'error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `dtfi-error-${name}` : undefined}
          disabled={setDisabled}
        />

        {suffix && <span className="dtfi-float-input-suffix">{suffix}</span>}
      </div>

      {error && showErrorText && (
        <span className="dtfi-error-message" id={`dtfi-error-${name}`}>
          {error}
        </span>
      )}
    </div>
  );
};

DefaultFloatInput.propTypes = {
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  setDisabled: PropTypes.bool,
  suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  maxValue: PropTypes.number,
  minValue: PropTypes.number,
  maxDecimals: PropTypes.number,
};

export default DefaultFloatInput;
