import style from "./SummaryBlock.module.css";

import React, { ReactNode } from "react";
import cn from "classnames";


interface SummaryBlockProps {
  children: ReactNode;
  className?: string;
}

const SummaryBlock: React.FC<SummaryBlockProps> = ({ children, className = '' }) => {
  return (
    <div className={cn(style.box, className)}>
      {children}
    </div>
  );
};

export default SummaryBlock;
