import cls from "./Slider.module.css"

import slide from "@/assets/img/slider/slide1.jpg";


export const Slider = () => {
    return ( 
        <div className={cls.slider}>
            <img className={cls.sliderImg} src={slide}/>
        </div>
     );
}
 