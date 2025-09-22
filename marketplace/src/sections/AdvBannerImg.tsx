import style from "./AdvBannerImg.module.css";

interface AdvBannerImgProps {
  photo?: string | null; // путь к картинке (может быть null)
  height?: string;       // CSS-высота (например "600px" или "auto")
  width?: string;        // CSS-ширина (например "100%")
}

const AdvBannerImg: React.FC<AdvBannerImgProps> = ({
  photo = null,
  height = "fit-content",
  width = "100%",
}) => {
  return (
    <div className={style.advBannerBox} style={{ height, width }}>
      <a className={style.advBannerLink}>
        {photo && (
          <img
            className={style.advBannerImg}
            alt="advert-banner-image"
            src={photo}
          />
        )}
      </a>
    </div>
  );
};

export default AdvBannerImg;
