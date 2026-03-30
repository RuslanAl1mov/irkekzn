import cn from "classnames";
import type { ButtonHTMLAttributes, JSX } from "react";

import MoonIcon from "@/assets/icons/moon.svg?react";
import SunIcon from "@/assets/icons/sun.svg?react";

import cls from "./ThemeSwitch.module.css";

type Props = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "role" | "aria-checked" | "children"
> & {
  /** true = тёмная тема */
  dark: boolean;
  onDarkChange: (dark: boolean) => void;
  disabled?: boolean;
};

export const ThemeSwitch = ({
  dark,
  onDarkChange,
  disabled = false,
  className,
  onClick,
  ...rest
}: Props): JSX.Element => {
  const handleClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"] = (
    event
  ) => {
    if (disabled) return;
    onDarkChange(!dark);
    onClick?.(event);
  };

  return (
    <div className={cn(cls.wrap, className, disabled && cls.disabled)}>
      <button
        type="button"
        role="switch"
        aria-checked={dark}
        aria-disabled={disabled}
        disabled={disabled}
        className={cn(cls.switcher, dark && cls.active)}
        onClick={handleClick}
        {...rest}
      >
        <span className={cls.track}>
          <span className={cls.thumb}>
            {dark ? (
              <MoonIcon className={cls.iconMoon} aria-hidden />
            ) : (
              <SunIcon className={cls.iconSun} aria-hidden />
            )}
          </span>
        </span>
      </button>
    </div>
  );
};
