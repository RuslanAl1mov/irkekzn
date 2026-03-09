import cn from "classnames";
import type { ButtonHTMLAttributes, JSX } from "react";

import cls from "./Switch.module.css";

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "role" | "aria-checked" | "children" | "value"
  > {
  value: boolean;
  setValue?: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch = ({
  value,
  setValue,
  label,
  className,
  disabled = false,
  onClick,
  ...restProps
}: Props): JSX.Element => {
  const handleClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"] = (
    event
  ) => {
    if (disabled) {
      return;
    }

    setValue?.(!value);
    onClick?.(event);
  };

  return (
    <label
      className={cn(cls.field, className, {
        [cls.disabled]: disabled,
      })}
    >
      {label && <span className={cls.label}>{label}</span>}

      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-disabled={disabled}
        disabled={disabled}
        className={cn(cls.switcher, {
          [cls.active]: value,
        })}
        onClick={handleClick}
        {...restProps}
      >
        <span className={cls.track}>
          <span className={cls.thumb} />
        </span>
      </button>
    </label>
  );
};
