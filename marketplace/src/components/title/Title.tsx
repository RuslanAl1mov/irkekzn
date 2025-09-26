import React from "react";
import cn from "classnames";
import styles from "./Title.module.css";

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

const Title: React.FC<TitleProps> = ({ children, className }) => {
  return <h1 className={cn(styles.title, className)}>{children}</h1>;
};

export default Title;
