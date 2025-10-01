import style from "./ServiceImageBlock.module.css";
import React from "react";

interface ServiceImageBlockProps {
  title?: string;
  imgSrc?: string | null;
}

const ServiceImageBlock: React.FC<ServiceImageBlockProps> = ({
  title = "",
  imgSrc = null,
}) => {
  return (
    <div className={style.box}>
      <div className={style.imageBox}>
        {imgSrc && (
          <img alt="service-image" className={style.image} src={imgSrc} />
        )}
        {title && <p className={style.title}>{title}</p>}
      </div>
    </div>
  );
};

export default ServiceImageBlock;
