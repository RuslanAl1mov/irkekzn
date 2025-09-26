import React from "react";
import mainStyle from "App.module.css";
import styles from "./AboutPage.module.css";

import cn from "classnames";

// Компоненты
import BlogPageSection from "sections/BlogPageSection";
import AdvBannerImg from "sections/AdvBannerImg";
import ExtraListBlock from "components/extraDataBlock/ExtraListBlock";

// Фото
import advBanner from "media/images/banners/aboutImg.png";
import aboutImg from "media/images/banners/about.png";


// Icons
import GroceryIcon from '@mui/icons-material/LocalGroceryStoreOutlined';
import ForumIcon from '@mui/icons-material/ForumOutlined';
import Title from "components/title/Title";
import CorneredButton from "components/buttons/CorneredButton";
import GridIcon from '@mui/icons-material/GridViewOutlined';


const AboutPage: React.FC = () => {
  return (
    <main className={cn(mainStyle.main, styles.aboutPageMain)}>
      <div className={cn(mainStyle.mainBlock, styles.aboutPageMainBlock)}>
        <Title>О нас</Title>

        <div className={styles.aboutFlexBlock}>

          <BlogPageSection>
            <AdvBannerImg photo={advBanner} />

            <p className={styles.aboutText}>IRKE - <span className={styles.aboutTextItalic}>современная элегантность в деталях</span></p>

            <p className={styles.aboutTextTitle}>История бренда:</p>
            <p className={styles.aboutText}>Бренд Irke родился в 2015 году в Казани как небольшое ателье по индивидуальному пошиву. С первых дней мы создавали не просто одежду, а произведения портновского искусства – с идеальной посадкой, продуманным силуэтом и тщательно отобранными материалами.</p>
            <p className={styles.aboutText}>Сегодня Irke – это бренд для всей России, объединяющий эстетику минимализма, функциональность и роскошь в каждой детали. Наши коллекции – это не просто одежда, а выверенные образы для современных женщин, которые ценят стиль, удобство и исключительное качество.</p>

            <p className={styles.aboutTextTitle}>Премиальные Итальянские Ткани – Стандарт Роскоши:</p>
            <p className={styles.aboutText}>Главное отличие Irke – это материалы. Мы выбираем лучшие итальянские ткани премиального качества, чтобы каждая вещь дарила комфорт, эстетическое удовольствие и уверенность в себе.</p>

            <p className={styles.aboutTextTitle}>Философия Бренда:</p>
            <p className={styles.aboutText}>Irke – это баланс между классической элегантностью и актуальными трендами. Мы создаем изысканную, лаконичную и универсальную одежду, которая подходит для повседневной жизни, работы, деловых встреч и особых случаев.</p>
            <p className={styles.aboutText}>Наши коллекции включают элегантные жакеты, стильные базовые рубашки и футболки, женственные платья, утонченные брюки, юбки и шорты – всё, что позволяет выглядеть безупречно в любой ситуации.</p>
            <p className={styles.aboutText}>Мы вдохновляемся архитектурой силуэтов, естественными линиями и чистотой форм, создавая образы, которые легко адаптируются к разным стилям.</p>

            <p className={styles.aboutTextTitle}>Irke Сегодня:</p>
            <p className={styles.aboutText}>Irke – это больше, чем просто одежда. Это настроение, уверенность и отражение вашего внутреннего мира. Мы создаем вещи, которые станут основой безупречного гардероба и помогут выглядеть элегантно в любой ситуации.</p>
            <AdvBannerImg photo={aboutImg} />

          </BlogPageSection>

          <BlogPageSection width="46%" className={styles.phoneFlexWrap}>
            <ExtraListBlock
              title="Полезные ссылки"
              icon={<GroceryIcon />}
              listItems={[
                { link: "/", text: "Связаться с отделом поддержки клиентов" },
                { link: "/", text: "Связаться с отделом рекламы" },
                { link: "/", text: "Связаться с отделом кадров" },
              ]}
            />

            <ExtraListBlock
              title="Обратная связь"
              icon={<ForumIcon />}
              listItems={[
                { link: null,
                  text: <>Мы хотим радовать вас!<br />
                    Поделись с нами вашим мнением о качестве сервиса</>
                },
                {
                  link: "#mail_follow",
                  text: <CorneredButton className={styles.followButton} text="ПОДПИСАТЬСЯ" />,
                  className: styles.followButton
                }
              ]}
            />

            <ExtraListBlock
              listItems={[
                { link: "/", text: "КОЛЛЕКЦИЯ", fullLink: true, lined: true, icon: <GridIcon style={{fill: "var(--gray)", stroke: "var(--white)", strokeWidth: "0.5px"}}/>},
                { link: "/", text: "АКСЕССУАРЫ", fullLink: true, lined: true, icon: <GridIcon style={{fill: "var(--gray)", stroke: "var(--white)", strokeWidth: "0.5px"}}/>},
                { link: "/", text: "SALE", fullLink: true, icon: <GridIcon style={{fill: "var(--gray)", stroke: "var(--white)", strokeWidth: "0.5px"}}/>},
              ]}
            />

          </BlogPageSection>


        </div>

      </div>
    </main>
  );
};

export default AboutPage;
