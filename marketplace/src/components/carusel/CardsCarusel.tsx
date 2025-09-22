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

type Breakpoints = Record<
  number,
  {
    slidesPerView: number | "auto";
    spaceBetween: number;
  }
>;

interface CardsCaruselProps<T extends CardBase> {
  data: T[];
  card: React.ComponentType<T>;
  breakpoints?: Breakpoints;
}

const defaultBreakpoints: Breakpoints = {
  0: { slidesPerView: 3, spaceBetween: 30 },
  951: { slidesPerView: 5, spaceBetween: 30 },
};

const CardsCarusel = <T extends CardBase>({
  data: cardsList,
  card: Card,
  breakpoints = defaultBreakpoints, // дефолтное значение
}: CardsCaruselProps<T>) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [navState, setNavState] = useState({ isBeginning: true, isEnd: false });

  const isPrevDisabled = !swiper || navState.isBeginning;
  const isNextDisabled = !swiper || navState.isEnd;

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
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={5}
        breakpoints={breakpoints}
        onSwiper={(s) => {
          setSwiper(s);
          setNavState({ isBeginning: s.isBeginning, isEnd: s.isEnd });
        }}
        onSlideChange={(s) =>
          setNavState({ isBeginning: s.isBeginning, isEnd: s.isEnd })
        }
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
