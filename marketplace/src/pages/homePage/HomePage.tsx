import mainStyle from "App.module.css";

import BanerVideoSection from "sections/BanerVideoSection";
import HomePageSection from "sections/HomePageSection";
import CardsCarusel from "components/carusel/CardsCarusel";
import CorneredButton from "components/buttons/CorneredButton";

// картинки
import img1 from "media/images/content/img1.jpg";
import img2 from "media/images/content/img2.jpg";
import img3 from "media/images/content/img3.jpg";
import img4 from "media/images/content/img4.png";
import img5 from "media/images/content/img21.webp";
import advBanner from "media/images/banners/advBanner.jpg";

import CategoryCard from "components/categoryCard/CategoryCard";
import AdvBannerImg from "sections/AdvBannerImg";
import ProductCard from "components/productCard/ProductCards";

// типы товаров и категорий
interface Product {
  id: number;
  badge: string;
  title: string;
  price: string;
  colors: string[];
  image: string;
}

interface Category {
  id: number;
  title: string;
  image: string;
}

const HomePage: React.FC = () => {
  const products: Product[] = [
    {
      id: 1,
      badge: "НОВИНКА",
      title: "ПАЛЬТО DOUBLE FACE ИЗ ШЕРСТИ",
      price: "42 990 ₽",
      colors: ["#b38a65", "#000"],
      image: img1,
    },
    {
      id: 2,
      badge: "НОВИНКА",
      title: "ПАЛЬТО DOUBLE FACE ИЗ ШЕРСТИ",
      price: "49 990 ₽",
      colors: ["#000", "#795548"],
      image: img2,
    },
    {
      id: 3,
      badge: "НОВИНКА",
      title: "ПАЛЬТО DOUBLE FACE ИЗ ШЕРСТИ",
      price: "49 990 ₽",
      colors: ["#000", "#795548", "#d2b48c"],
      image: img3,
    },
    {
      id: 4,
      badge: "НОВИНКА",
      title: "БОМБЕР ИЗ ПАЛЬТОВОЙ ТКАНИ",
      price: "24 990 ₽",
      colors: ["#d2b48c"],
      image: img4,
    },
    {
      id: 5,
      badge: "НОВИНКА",
      title: "ДВУБОРТНОЕ ПАЛЬТО ИЗ ШЕРСТИ",
      price: "42 990 ₽",
      colors: ["#e0d7c6", "#795548", "#3e2723"],
      image: img5,
    },
    {
      id: 6,
      badge: "НОВИНКА",
      title: "ПАЛЬТО DOUBLE FACE ИЗ ШЕРСТИ",
      price: "42 990 ₽",
      colors: ["#b38a65", "#000"],
      image: img1,
    },
    {
      id: 7,
      badge: "НОВИНКА",
      title: "ПАЛЬТО DOUBLE FACE ИЗ ШЕРСТИ",
      price: "49 990 ₽",
      colors: ["#000", "#795548"],
      image: img2,
    },
    {
      id: 8,
      badge: "НОВИНКА",
      title: "ПАЛЬТО DOUBLE FACE ИЗ ШЕРСТИ",
      price: "49 990 ₽",
      colors: ["#000", "#795548", "#d2b48c"],
      image: img3,
    },
    {
      id: 9,
      badge: "НОВИНКА",
      title: "БОМБЕР ИЗ ПАЛЬТОВОЙ ТКАНИ",
      price: "24 990 ₽",
      colors: ["#d2b48c"],
      image: img4,
    },
    {
      id: 10,
      badge: "НОВИНКА",
      title: "ДВУБОРТНОЕ ПАЛЬТО ИЗ ШЕРСТИ",
      price: "42 990 ₽",
      colors: ["#e0d7c6", "#795548", "#3e2723"],
      image: img5,
    },
  ];

  const categories: Category[] = [
    { id: 1, title: "ПАЛЬТО", image: img3 },
    { id: 2, title: "Куртки и тренчи", image: img5 },
    { id: 3, title: "Мужская коллекция", image: img2 },
    { id: 4, title: "Рубашки и блузы", image: img4 },
    { id: 5, title: "Костюмы", image: img1 },
  ];

  return (
    <main className={mainStyle.main}>
      <div className={mainStyle.mainBlock}>
        <BanerVideoSection />

        <HomePageSection title="Новинки">
          <CardsCarusel data={products} card={ProductCard} />
          <CorneredButton text="Смотреть все" />
        </HomePageSection>

        <HomePageSection>
          <AdvBannerImg photo={advBanner} height="600px" />
        </HomePageSection>

        <HomePageSection title="Категории">
          <CardsCarusel data={categories} card={CategoryCard} />
          <CorneredButton text="Перейти в каталог" />
        </HomePageSection>

        <HomePageSection />
      </div>
    </main>
  );
};

export default HomePage;
