import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "./DefaultTextAreaInputStyle.css";

const DefaultTextAreaInput = ({
  setValue,
  value = '',
  name,
  placeholder = '',
  isRequired = false,
  setDisabled = false,
  limit = null,
}) => {
  const [error, setError] = useState('');

  const handleChange = (e) => {
    let inputValue = e.target.value;
    // enforce character limit if provided
    if (typeof limit === 'number' && inputValue.length > limit) {
      inputValue = inputValue.slice(0, limit);
    }
    setValue(inputValue);

    // Простая валидация на заполнение обязательного поля
    if (isRequired && inputValue.trim() === '') {
      setError(`Поле "${name}" обязательно к заполнению!`);
    } else {
      setError('');
    }
  };

  return (
    <div className="dtai-textarea-input-block">
      <label htmlFor={`dtai-${name}`}> 
        {name}
        {isRequired && <span className="dtai-required">*</span>}
      </label>
      <textarea
        id={`dtai-${name}`}
        className={`dtai-textarea-input ${isRequired && error ? 'error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `dtai-error-${name}` : undefined}
        disabled={setDisabled}
        {...(typeof limit === 'number' ? { maxLength: limit } : {})}
      />
      {error && (
        <span className="dtai-error-message" id={`dtai-error-${name}`}> 
          {error}
        </span>
      )}
    </div>
  );
};

DefaultTextAreaInput.propTypes = {
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  setDisabled: PropTypes.bool,
  limit: PropTypes.number,
};

DefaultTextAreaInput.defaultProps = {
  value: '',
  placeholder: '',
  isRequired: false,
  setDisabled: false,
  limit: null,
};

export default DefaultTextAreaInput;