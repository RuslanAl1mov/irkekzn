import React from "react";

import cls from "./Loader.module.css";

type LoaderProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export const Loader: React.FC<LoaderProps> = ({
  size = 20,
  color = "var(--blue)",
  strokeWidth = 5,
}) => {
  const r = 25 - strokeWidth / 2;

  return (
    <svg
      className={cls.spinner}
      viewBox="0 0 50 50"
      // инлайн-стили гарантированно задают размер
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label={"Loading"}
    >
      <circle
        className={cls.path}
        cx="25"
        cy="25"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};
