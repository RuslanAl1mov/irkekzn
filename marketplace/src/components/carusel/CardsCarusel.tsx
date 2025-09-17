import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import style from "./CardsCarusel.module.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardIosRounded";

interface CardBase {
  id: string | number;
}

interface CardsCaruselProps<T extends CardBase> {
  data: T[];
  card: React.ComponentType<T>;
}

const CardsCarusel = <T extends CardBase>({
  data: cardsList,
  card: Card,
}: CardsCaruselProps<T>) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [current, setCurrent] = useState(0);

  const isPrevDisabled = current === 0;
  const isNextDisabled = swiper !== null && current >= cardsList.length - 5;

  return (
    <div className={style.carouselWrapper}>
      <div className={style.arrowsTop}>
        <button
          onClick={() => swiper?.slidePrev()}
          className={`${style.arrow} ${isPrevDisabled ? style.disabled : ""}`}
          disabled={isPrevDisabled}
        >
          <ArrowBackIcon />
        </button>
        <button
          onClick={() => swiper?.slideNext()}
          className={`${style.arrow} ${isNextDisabled ? style.disabled : ""}`}
          disabled={isNextDisabled}
        >
          <ArrowForwardIcon />
        </button>
      </div>

      <Swiper
        onSwiper={setSwiper}
        onSlideChange={(s) => setCurrent(s.activeIndex)}
        modules={[Navigation]}
        slidesPerView="auto"
        spaceBetween={30}
      >
        {cardsList.map((p) => (
          <SwiperSlide key={p.id} className={style.slide}>
            <Card {...p} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardsCarusel;
