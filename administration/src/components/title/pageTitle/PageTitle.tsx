import style from "./PageTitle.module.css";
import React, { ReactNode } from "react";
import cn from "classnames";


interface PageTitleProps {
  children: ReactNode;
  className?: string;
  label?: string | null;
}

const PageTitle: React.FC<PageTitleProps> = ({ 
  children, 
  className = '',
  label = null
}) => {
  return (
    <h1 className={cn(style.title, className)}>
      {children}
      <span className={style.smallTitle}>{label ?? ""}</span>
    </h1>
  );
};

export default PageTitle;
