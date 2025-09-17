import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import style from "./BanerVideoSection.module.css";

// Медиаконтент
import bannerVideo from "media/video/BANNER1.mp4";
import bannerImage1 from "media/images/banners/banner1.jpg";
import bannerImage2 from "media/images/banners/banner2.jpg";

const BanerVideoSection: React.FC = () => {
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  const handleLoadedData = () => {
    setVideoLoaded(true);
  };

  return (
    <section className={style.banerVideoSection}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className={style.banerVideoSectionBlock}
      >
        {/* Слайд с видео */}
        <SwiperSlide>
          <div className={style.videoBlock}>
            <video
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={handleLoadedData}
            >
              <source src={bannerVideo} type="video/mp4" />
            </video>
            <div
              className={style.vssVideoBlackHover}
              style={!videoLoaded ? { backgroundColor: "var(--black)" } : {}}
            />
            <div className={style.vssVideoSectionText}>
              <div className={style.vssVideoSectionTextContent}>
                <h2></h2>
                <a className={style.banerButtonLink} href="#">
                  Перейти
                </a>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Слайд с картинкой 1 */}
        <SwiperSlide>
          <div className={style.videoBlock}>
            <img src={bannerImage1} alt="banner 1" />
            <div className={style.vssVideoBlackHover}></div>
            <div className={style.vssVideoSectionText}>
              <div className={style.vssVideoSectionTextContent}>
                <h2>Обувь</h2>
                <a className={style.banerButtonLink} href="#">
                  Перейти
                </a>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Слайд с картинкой 2 */}
        <SwiperSlide>
          <div className={style.videoBlock}>
            <img src={bannerImage2} alt="banner 2" />
            <div className={style.vssVideoBlackHover}></div>
            <div className={style.vssVideoSectionText}>
              <div className={style.vssVideoSectionTextContent}>
                <h2>Новая коллекция</h2>
                <a className={style.banerButtonLink} href="#">
                  Перейти
                </a>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default BanerVideoSection;
