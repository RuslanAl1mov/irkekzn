import type { ComponentPropsWithoutRef, FC, PropsWithChildren } from "react";
import cn from "classnames";

import { Loader } from "@/widgets/loader";

import cls from "./Button.module.css";

interface Props extends PropsWithChildren<ComponentPropsWithoutRef<"button">> {
  className?: string;
  size?: "full";
  isLoading?: boolean;
  variant?: "blue" | "gray" | "red";
  type?: "button" | "submit" | "reset";
}

export const Button: FC<Props> = (props) => {
  const {
    className,
    children,
    size,
    isLoading,
    variant = "blue",
    type = "button",
    ...restProps
  } = props;

  return (
    <button
      type={type}
      className={cn(
        cls.btn,
        className,
        {
          [cls.full]: size === "full",
          [cls.withLoading]: isLoading,
          [cls.blue]: variant === "blue",
          [cls.gray]: variant === "gray",
          [cls.red]: variant === "red",
        }
      )}
      {...restProps}
    >
      {isLoading && <Loader size={20} />}
      {children}
    </button>
  );
};
