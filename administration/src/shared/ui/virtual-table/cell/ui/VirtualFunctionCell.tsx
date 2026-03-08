import { type ReactNode } from "react";

import cls from "./VirtualCell.module.css";

type CellFunctionProps = {
  icon: ReactNode;
  title: string;
  onClick: any;
};

type VirtualFunctionCellProps = {
  functions?: CellFunctionProps[];
  align?: "start" | "center" | "end";
};

export const VirtualFunctionCell = ({
  functions,
  align = "start",
}: VirtualFunctionCellProps) => {
  return (
    <div className={cls.wrapper} style={{ justifyContent: align }}>
      {functions &&
        functions.map((funct) => {
          return (
            <div
              className={cls.functionBlock}
              onClick={() => funct.onClick}
              title={funct.title}
            >
              {funct.icon}
            </div>
          );
        })}
    </div>
  );
};
