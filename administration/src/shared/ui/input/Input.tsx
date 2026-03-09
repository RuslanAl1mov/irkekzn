import cn from "classnames";
import React, { useRef } from "react";

import CloseIcon from "@/assets/icons/close.svg?react";

import cls from "./Input.module.css";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "defaultValue" | "type"
> {
  label?: string;
  showLabel?: boolean;
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
  label,
  showLabel = true,
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
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const hasValue = isControlled ? !!value : false;
  const shouldShowClearButton = showClearButton && hasValue && !disabled;
  const hasEndSlot = !!endIcon || showClearButton;

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

  const finalEndIcon = endIcon ?? (
    showClearButton ? (
      <button
        type="button"
        className={cls.clearBtn}
        onClick={handleClear}
        onMouseDown={(e) => e.preventDefault()}
        aria-label="Очистить"
        title="Очистить"
        tabIndex={shouldShowClearButton ? 0 : -1}
        style={{
          visibility: shouldShowClearButton ? "visible" : "hidden",
          pointerEvents: shouldShowClearButton ? "auto" : "none",
        }}
      >
        <CloseIcon />
      </button>
    ) : null
  );

  const inputNode = (
    <div
      className={cn(
        cls.inputCont,
        { [cls.withStartIcon]: !!startIcon },
        { [cls.withEndIcon]: hasEndSlot },
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

  if (!label || !showLabel) {
    return inputNode;
  }

  return (
    <label className={cls.field}>
      <span className={cls.label}>{label}</span>
      {inputNode}
    </label>
  );
};

export default Input;
