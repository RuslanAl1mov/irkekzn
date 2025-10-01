import { useState } from 'react';
import PropTypes from 'prop-types';
import "./TextInput.css";

const TextInput = ({
    setValue,
    value = '',
    name,
    placeholder = '',
    isRequired = false,
    setDisabled = false,
    limit = null,
    showErrorText=true
}) => {
    const [error, setError] = useState('');

    const handleChange = (e) => {
        let inputValue = e.target.value;
        // enforce character limit if provided
        if (typeof limit === 'number' && inputValue.length > limit) {
            inputValue = inputValue.slice(0, limit);
        }
        setValue(inputValue);

        // simple validation
        if (isRequired && inputValue.trim() === '') {
            setError(`Поле "${name}" обязательно к заполнению!`);
        } else {
            setError('');
        }
    };

    return (
        <div className="ti-text-input-block">
            {name && <label htmlFor={`ti-${name}`}>{name}{isRequired && <span className="ti-required">*</span>}</label>}
            <input
                type="text"
                id={`ti-${name}`}
                className={`ti-text-input ${isRequired && error ? 'error' : ''}`}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `ti-error-${name}` : undefined}
                disabled={setDisabled}
                {...(typeof limit === 'number' ? { maxLength: limit } : {})}
            />
            {error && showErrorText && <span className="ti-error-message" id={`ti-error-${name}`}>{error}</span>}
        </div>
    );
};

TextInput.propTypes = {
    setValue: PropTypes.func.isRequired,
    value: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    setDisabled: PropTypes.bool,
    limit: PropTypes.number,
};


export default TextInput;
