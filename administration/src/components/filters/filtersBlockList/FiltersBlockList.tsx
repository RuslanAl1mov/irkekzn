import React, { ReactNode } from "react";
import style from "./FiltersBlockList.module.css";

interface FiltersBlockListProps {
  children: ReactNode;
  left_content?: ReactNode;
}

const FiltersBlockList: React.FC<FiltersBlockListProps> = ({
  children,
  left_content = null,
}) => {
  return (
    <div className={style.blockList}>
      <div className={style.blockListChild}>{left_content}</div>
      <div className={style.blockListChild}>{children}</div>
    </div>
  );
};

export default FiltersBlockList;
