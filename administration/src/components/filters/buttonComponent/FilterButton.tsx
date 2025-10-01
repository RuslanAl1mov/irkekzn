import React, { ReactNode } from "react";
import style from "./FilterButton.module.css";
import cn from "classnames";

interface FilterButtonProps {
  title?: string;
  extra_block?: ReactNode;
  className?: string;
  addIcon?: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  title = "Кнопка фильтра",
  extra_block = null,
  className = "",
  addIcon = false,
  onClick,
}) => {
  return (
    <button type="button" className={cn(style.button, className)} onClick={onClick}>
      {title}
      {addIcon ? (
        <svg className={style.buttonIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 18" fill="none">
          <path d="M15.9375 7.9375H9.5625V1.5625C9.5625 1.28071 9.45056 1.01046 9.2513 0.811199C9.05204 0.611942 8.78179 0.5 8.5 0.5C8.21821 0.5 7.94796 0.611942 7.7487 0.811199C7.54944 1.01046 7.4375 1.28071 7.4375 1.5625V7.9375H1.0625C0.780707 7.9375 0.510457 8.04944 0.311199 8.2487C0.111942 8.44796 0 8.71821 0 9C0 9.28179 0.111942 9.55204 0.311199 9.7513C0.510457 9.95056 0.780707 10.0625 1.0625 10.0625H7.4375V16.4375C7.4375 16.7193 7.54944 16.9895 7.7487 17.1888C7.94796 17.3881 8.21821 17.5 8.5 17.5C8.78179 17.5 9.05204 17.3881 9.2513 17.1888C9.45056 16.9895 9.5625 16.7193 9.5625 16.4375V10.0625H15.9375C16.2193 10.0625 16.4895 9.95056 16.6888 9.7513C16.8881 9.55204 17 9.28179 17 9C17 8.71821 16.8881 8.44796 16.6888 8.2487C16.4895 8.04944 16.2193 7.9375 15.9375 7.9375Z" fill="white"/>
        </svg>
      ) : (
        extra_block
      )}
    </button>
  );
};

export default FilterButton;
