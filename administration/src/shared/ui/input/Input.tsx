import cn from "classnames";
import React, { useRef } from "react";

import CloseIcon from "@/assets/icons/close.svg?react";

import cls from "./Input.module.css";

interface Props extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "defaultValue" | "type"
> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  error?: boolean;
  showClearButton?: boolean;

  value?: string;
  setValue?: (v: string) => void;

  defaultValue?: string;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
}

export const Input = ({
  type = "text",
  startIcon,
  endIcon,
  className,
  error = false,
  showClearButton = false,

  value,
  setValue,
  defaultValue,
  disabled,

  ...rest
}: Props) => {  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const hasValue = isControlled ? !!value : false;
  const shouldShowClearButton = showClearButton && hasValue && !disabled;

  function handleContainerMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;

    const isInteractive = target.closest(
      'button, a, [role="button"], input, textarea, select, [contenteditable="true"]'
    );
    if (isInteractive) return;

    e.preventDefault();
    inputRef.current?.focus();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      return;
    }

    setValue?.(e.target.value);
  }

  function handleClear() {
    setValue?.("");
    inputRef.current?.focus();
  }

  const finalEndIcon = shouldShowClearButton ? (
    <button
      type="button"
      className={cls.clearBtn}
      onClick={handleClear}
      onMouseDown={(e) => e.preventDefault()}
      aria-label={"Очистить"}
      title={"Очистить"}
    >
      <CloseIcon />
    </button>
  ) : (
    endIcon
  );

  return (
    <div
      className={cn(
        cls.inputCont,
        { [cls.withStartIcon]: !!startIcon },
        { [cls.withEndIcon]: !!finalEndIcon },
        { [cls.error]: error },
        className,
        { [cls.disable]: disabled }
      )}
      onMouseDown={handleContainerMouseDown}
    >
      {startIcon}

      <div className={cls.input}>
        <input
          ref={inputRef}
          type={type}
          {...(isControlled ? { value: value ?? "" } : { defaultValue })}
          onChange={handleChange}
          {...rest}
          disabled={disabled}
        />
      </div>

      {finalEndIcon}
    </div>
  );
};

export default Input;
