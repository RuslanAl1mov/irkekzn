import { useState, useEffect } from "react";
import "./EmailInputStyle.css";

interface EmailInputProps {
  setValue: (value: string) => void;
  value?: string;
  name?: string;
  placeholder?: string;
  isRequired?: boolean;
  disableAutoCorrect?: boolean;
  disabled?: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({
  setValue,
  value = "",
  name,
  placeholder = "",
  isRequired = false,
  disableAutoCorrect = false,
  disabled = false,
}) => {
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const sanitizeEmail = (email: string) => {
    let sanitized = email.replace(/[^a-zA-Z0-9@._+\-]/g, "");
    if (sanitized.length > 254) sanitized = sanitized.slice(0, 254);
    return sanitized;
  };

  const validate = (email: string) => {
    if (isRequired && email.trim() === "") {
      return `Поле "${name}" обязательно к заполнению!`;
    }
    if (email && !validateEmail(email)) {
      return "Введите корректный email адрес!";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = sanitizeEmail(e.target.value);
    setValue(email);
    setTouched(true);
    setError(validate(email));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = sanitizeEmail(e.clipboardData.getData("text"));
    setValue(pasteData);
    setTouched(true);
    setError(validate(pasteData));
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validate(value));
  };

  useEffect(() => {
    if (touched) {
      setError(validate(value));
    }
  }, [value, touched]);

  return (
    <div className="dei-email-input-block">
      {name && (
        <label htmlFor={`dei-${name}`}>
          {name}
          {isRequired && <span className="dei-required">*</span>}
        </label>
      )}
      <input
        type="email"
        id={`dei-${name}`}
        className={`dei-email-input ${error ? "error" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        onBlur={handleBlur}
        spellCheck={!disableAutoCorrect}
        autoComplete={disableAutoCorrect ? "off" : "on"}
        autoCorrect={disableAutoCorrect ? "off" : "on"}
        autoCapitalize="none"
        aria-invalid={!!error}
        aria-describedby={error ? `dei-error-${name}` : undefined}
        disabled={disabled}
      />
      {touched && error && (
        <span className="dei-error-message" id={`dei-error-${name}`}>
          {error}
        </span>
      )}
    </div>
  );
};

export default EmailInput;
