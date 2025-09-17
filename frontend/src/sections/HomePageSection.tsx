import { ReactNode } from "react";
import style from "./HomePageSection.module.css";

interface HomePageSectionProps {
  children?: ReactNode;
  title?: string;
}

const HomePageSection: React.FC<HomePageSectionProps> = ({
  children,
  title = "",
}) => {
  return (
    <section className={style.homePageSection}>
      <div className={style.homePageSectionBlock}>
        {title && <h1 className={style.sectionTitle}>{title}</h1>}
        {children}
      </div>
    </section>
  );
};

export default HomePageSection;
