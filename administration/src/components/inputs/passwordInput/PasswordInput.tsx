import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./PasswordInputStyle.css";

interface PasswordInputProps {
  setValue: (value: string) => void;
  value?: string;
  name?: string;
  placeholder?: string;
  isRequired?: boolean;
  disableAutoCorrect?: boolean;
  disabled?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  setValue,
  value = "",
  name = "",
  placeholder = "",
  isRequired = false,
  disableAutoCorrect = false,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setValue(pwd);

    if (isRequired && pwd.trim() === "") {
      setError(`Поле "${name}" обязательно к заполнению!`);
    } else {
      setError("");
    }
  };

  const toggleShow = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <div className="pswin-password-input-block">
      {name && (
        <label htmlFor={`pswin-${name}`}>
          {name}
          {isRequired && <span className="pswin-required">*</span>}
        </label>
      )}
      <div className="pswin-password-input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          id={`pswin-${name}`}
          className={`pswin-password-input ${error ? "error" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          spellCheck={!disableAutoCorrect}
          autoComplete={disableAutoCorrect ? "off" : "on"}
          autoCorrect={disableAutoCorrect ? "off" : "on"}
          autoCapitalize="none"
          aria-invalid={!!error}
          aria-describedby={error ? `pswin-error-${name}` : undefined}
          disabled={disabled}
        />
        <button
          type="button"
          className="pswin-password-toggle"
          onClick={toggleShow}
          onMouseDown={handleMouseDown}
          aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </button>
      </div>
      {error && (
        <span className="pswin-error-message" id={`pswin-error-${name}`}>
          {error}
        </span>
      )}
    </div>
  );
};

export default PasswordInput;
