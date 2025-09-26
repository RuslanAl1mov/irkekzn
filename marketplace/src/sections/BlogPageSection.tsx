import { ReactNode } from "react";
import cn from "classnames";
import style from "./BlogPageSection.module.css";

interface BlogPageSectionProps {
  children?: ReactNode;
  width?: string;
  className?: string;
}

const BlogPageSection: React.FC<BlogPageSectionProps> = ({
  children,
  width = "100%",
  className = ""
}) => {
  return (
    <section className={cn(style.blogPageSection, className)} style={{width: width}}>
      <div className={cn(style.blogPageSectionBlock, className)}>
        {children}
      </div>
    </section>
  );
};

export default BlogPageSection;