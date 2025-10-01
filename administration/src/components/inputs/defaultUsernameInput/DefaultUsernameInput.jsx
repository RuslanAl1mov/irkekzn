// src/components/inputs/DefaultUsernameInput.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "./DefaultUsernameInputStyle.css";

const DefaultUsernameInput = ({
    setValue,
    value = '',
    name,
    placeholder = '',
    isRequired = false,
    disableAutoCorrect = false,
    disabled = false
}) => {
    const [error, setError] = useState('');

    const validateUsername = (username) => {
        // Валидация: от 3 до 15 символов, только буквы, цифры и подчеркивания
        const re = /^[a-zA-Z0-9_]{3,15}$/;
        return re.test(username);
    };

    const handleChange = (e) => {
        let username = e.target.value;

        // Удаление недопустимых символов
        username = username.replace(/[^a-zA-Z0-9_]/g, '');

        // Ограничение длины до 15 символов
        if (username.length > 15) {
            username = username.slice(0, 15);
        }

        setValue(username);

        // Валидация
        if (isRequired && username.trim() === '') {
            setError(`Поле "${name}" обязательно к заполнению!`);
        } else if (username && !validateUsername(username)) {
            setError(`Имя пользователя должно содержать от 3 до 15 символов и может включать буквы, цифры и подчеркивания.`);
        } else {
            setError('');
        }
    };

    return (
        <div className="dui-username-input-block">
            <label htmlFor={`dui-${name}`}>
                {name}{isRequired && <span className="dui-required">*</span>}
            </label>
            <input
                type="text"
                id={`dui-${name}`}
                className={`dui-username-input ${isRequired && error ? 'error' : ''}`}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                spellCheck={!disableAutoCorrect}
                autoComplete={disableAutoCorrect ? 'off' : 'on'}
                autoCorrect={disableAutoCorrect ? 'off' : 'on'}
                autoCapitalize="none"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `dui-error-${name}` : undefined}
                disabled={disabled}
            />
            {error && <span className="dui-error-message" id={`dui-error-${name}`}>{error}</span>}
        </div>
    );
};

DefaultUsernameInput.propTypes = {
    setValue: PropTypes.func.isRequired,
    value: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    disableAutoCorrect: PropTypes.bool,
    disabled: PropTypes.bool,
};

// Удалены defaultProps

export default DefaultUsernameInput;
