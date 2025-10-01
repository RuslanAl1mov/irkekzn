import React, { ReactNode } from "react";
import style from "./FilterLabel.module.css";

interface FilterLabelProps {
  children: ReactNode;
}

const FilterLabel: React.FC<FilterLabelProps> = ({ children }) => {
  return (
    <div className={style.box}>
      <div className={style.contentBlock}>
        <p className={style.content}>{children}</p>
      </div>
    </div>
  );
};

export default FilterLabel;
