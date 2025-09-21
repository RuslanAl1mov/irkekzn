import cl from "classnames";
import { useEffect, useRef, useState } from "react";
import style from "./Header.module.css";
import centerHorizontally from "utils/centerHorizontally";

// logo
import logoDark from "media/logo/irke_logo_black.svg"

// Icons
import { Box } from "@mui/material";
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// functional icons
import SearchIcon from '@mui/icons-material/Search';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Clear';


// images
import img1 from "media/images/content/img1.jpg";
import img2 from "media/images/content/img2.jpg";
import img3 from "media/images/content/img3.jpg";
import img4 from "media/images/content/img4.png";

import img21 from "media/images/content/img21.webp";
import img22 from "media/images/content/img22.jpg";


const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isSmall, setIsSmall] = useState<boolean>(false);
    const [openTabs, setOpenTabs] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 1110px)");
        const update = () => setIsSmall(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    const popupRefs = [
        useRef<HTMLDivElement | null>(null),
        useRef<HTMLDivElement | null>(null),
        useRef<HTMLDivElement | null>(null),
        useRef<HTMLDivElement | null>(null),
    ];

    const handleMouseEnter = (index: number) => {
        if (popupRefs[index].current) {
            centerHorizontally(popupRefs[index].current);
        }
    };

    // Открытие/закрытие владок маленького меню
    const toggleTab = (key: string) => {
        if (!isSmall) return;
        setOpenTabs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Статус открытия/закрытия владок маленького меню
    const isOpen = (key: string) => !!openTabs[key];

    return (
        <header className={style.header}>
            <div className={style.headerBlock}>

                {/* burger (show aside block) */}
                <div className={style.headerBurgerBlock}>
                    <button className={style.headerBurgerButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ?
                            <CloseIcon className={style.headerBurgerIcon} />
                            : <MenuIcon className={style.headerBurgerIcon} />
                        }
                    </button>
                </div>

                {/* logo */}
                <div className={style.headerLogoBlock}>
                    <img className={style.headerLogo} alt="header-logo" src={logoDark} />
                </div>

                {/* content */}
                <div className={cl(style.headerContentBlock, isMenuOpen && style.headerContentBlock__ShowSmall)}>
                    <nav className={style.headerContentNav}>
                        <ul className={style.headerContentList}>


                            {/* Коллекция */}
                            <li className={style.headerContentListItem}>
                                <div className={style.contentContainer} onMouseEnter={() => handleMouseEnter(0)}>
                                    <div className={style.contentLabelBlock} onClick={() => toggleTab("collection")}>
                                        <p className={style.contentLabel}>Коллекция</p>
                                        <Box className={cl(style.contentLableIconBlock, isOpen("collection") && style.contentLableIconBlock__Active)}>
                                            <ArrowDownIcon className={style.contentLableIcon} />
                                        </Box>
                                    </div>

                                    {/* Мелкий список для бокового меню */}
                                    {/* добавить popupHeaderMenuSmallOpen для открытия */}
                                    {isSmall && (
                                        <div className={cl(style.popupHeaderMenuSmall, isOpen("collection") && style.popupHeaderMenuSmallOpen)}>
                                            <div className={style.popupHeaderMenuBlockSmall}>
                                                <div className={style.menuCatalogBlock}>
                                                    <ul className={style.menuCatalogList}>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Смотреть все</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">NEW</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Платья</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Рубашки и блузы</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Футболки и майки</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Топы</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Брюки</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Юбки</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Шорты</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Жакеты и жилеты</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Куртки и бомберы</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Кардиганы и жилеты</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Пальто и плащи</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Вязаные изделия и трикотаж</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Бесшовный базовый трикотаж</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Премиальный трикотаж</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Sale</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Основной большой список */}
                                    <div ref={popupRefs[0]} className={style.popupHeaderMenu}>
                                        <div className={style.popupHeaderMenuBlock}>
                                            <div className={style.menuCatalogBlock}>
                                                {/* Первый столбец */}
                                                <ul className={style.menuCatalogList}>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Смотреть все</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">NEW</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Платья</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Рубашки и блузы</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Футболки и майки</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Топы</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Брюки</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Юбки</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Шорты</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Жакеты и жилеты</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Куртки и бомберы</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Кардиганы и жилеты</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Пальто и плащи</a></li>
                                                </ul>

                                                {/* Второй столбец */}
                                                <ul className={style.menuCatalogList}>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Вязаные изделия и трикотаж</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Бесшовный базовый трикотаж</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Премиальный трикотаж</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Sale</a></li>
                                                </ul>

                                            </div>

                                            <div className={style.menuSuggestBlock}>
                                                <a href="/" className={style.menuSuggestBlockContent}>
                                                    <img className={style.menuSuggestImg} src={img1} alt="Новинки" />
                                                    <p className={style.menuCatalogSuggestText}>Новинки</p>
                                                </a>

                                                <a href="/" className={style.menuSuggestBlockContent}>
                                                    <img className={style.menuSuggestImg} src={img2} alt="Рекомендации по уходу" />
                                                    <p className={style.menuCatalogSuggestText}>Рекомендации по уходу</p>
                                                </a>

                                                <a href="/" className={style.menuSuggestBlockContent}>
                                                    <img className={style.menuSuggestImg} src={img3} alt="Образы" />
                                                    <p className={style.menuCatalogSuggestText}>Образы</p>
                                                </a>

                                                <a href="/" className={style.menuSuggestBlockContent}>
                                                    <img className={style.menuSuggestImg} src={img4} alt="Look Book" />
                                                    <p className={style.menuCatalogSuggestText}>Look Book</p>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            {/* Аксессуары */}
                            <li className={style.headerContentListItem}>
                                <div className={style.contentContainer} onMouseEnter={() => handleMouseEnter(1)}>
                                    <div className={style.contentLabelBlock} onClick={() => toggleTab("accessuar")}>
                                        <p className={style.contentLabel}>Аксессуары</p>
                                        <Box className={cl(style.contentLableIconBlock, isOpen("accessuar") && style.contentLableIconBlock__Active)}>
                                            <ArrowDownIcon className={style.contentLableIcon} />
                                        </Box>
                                    </div>

                                    {/* Мелкий список для бокового меню */}
                                    {isSmall && (
                                        <div className={cl(style.popupHeaderMenuSmall, isOpen("accessuar") && style.popupHeaderMenuSmallOpen)}>
                                            <div className={style.popupHeaderMenuBlockSmall}>
                                                <div className={style.menuCatalogBlock}>
                                                    <ul className={style.menuCatalogList}>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Смотреть все</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">NEW</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Украшения</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Парфюмерия</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Платки и палантины</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Шарфы и снуды</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Ремни и пояса</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Головные уборы</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Sale</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Основной блок */}
                                    <div ref={popupRefs[1]} className={style.popupHeaderMenu}>
                                        <div className={style.popupHeaderMenuBlock}>
                                            <div className={style.menuCatalogBlock}>
                                                {/* Первый столбец */}
                                                <ul className={style.menuCatalogList}>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Смотреть все</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">NEW</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Украшения</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Парфюмерия</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Платки и палантины</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Шарфы и снуды</a></li>
                                                </ul>

                                                {/* Второй столбец */}
                                                <ul className={style.menuCatalogList}>

                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Ремни и пояса</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Головные уборы</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Sale</a></li>
                                                </ul>


                                            </div>

                                            <div className={style.menuSuggestBlock}>
                                                <a href="/" className={style.menuSuggestBlockContent}>
                                                    <img className={style.menuSuggestImg} src={img21} alt="Новинки" />
                                                    <p className={style.menuCatalogSuggestText}>Новинки</p>
                                                </a>

                                                <a href="/" className={style.menuSuggestBlockContent}>
                                                    <img className={style.menuSuggestImg} src={img22} alt="Рекомендации по уходу" />
                                                    <p className={style.menuCatalogSuggestText}>Рекомендации по уходу</p>
                                                </a>

                                                <div className={style.menuSuggestBlockContent}>

                                                </div>

                                                <div className={style.menuSuggestBlockContent}>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            {/* Sale */}
                            <li className={style.headerContentListItem}>
                                <div className={style.contentContainer} onMouseEnter={() => handleMouseEnter(2)}>
                                    <div className={style.contentLabelBlock} onClick={() => toggleTab("sale")}>
                                        <p className={style.contentLabel}>Sale</p>
                                        <Box className={cl(style.contentLableIconBlock, isOpen("sale") && style.contentLableIconBlock__Active)}>
                                            <ArrowDownIcon className={style.contentLableIcon} />
                                        </Box>
                                    </div>

                                    {/* Мелкий список для бокового меню */}
                                    {isSmall && (
                                        <div className={cl(style.popupHeaderMenuSmall, isOpen("sale") && style.popupHeaderMenuSmallOpen)}>
                                            <div className={style.popupHeaderMenuBlockSmall}>
                                                <div className={style.menuCatalogBlock}>
                                                    <ul className={style.menuCatalogList}>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Смотреть все</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">NEW</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Платья</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Рубашки и блузы</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Футболки и майки</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Топы</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Брюки</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Юбки</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Шорты</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Вязаные изделия и трикотаж</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Бесшовный базовый трикотаж</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Премиальный трикотаж</a></li>
                                                        <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Sale</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Основно блок */}
                                    <div ref={popupRefs[2]} className={style.popupHeaderMenu}>
                                        <div className={style.popupHeaderMenuBlock}>
                                            <div className={style.menuCatalogBlock}>
                                                {/* Первый столбец */}
                                                <ul className={style.menuCatalogList}>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Смотреть все</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">NEW</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Платья</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Рубашки и блузы</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Футболки и майки</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Топы</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Брюки</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Юбки</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Шорты</a></li>

                                                </ul>

                                                {/* Второй столбец */}
                                                <ul className={style.menuCatalogList}>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Вязаные изделия и трикотаж</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Бесшовный базовый трикотаж</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Премиальный трикотаж</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Sale</a></li>
                                                </ul>

                                            </div>

                                            <div className={style.menuSuggestBlock}>
                                                <a href="/" className={style.menuSuggestBlockContent}>
                                                    <img className={style.menuSuggestImg} src={img3} alt="Новинки" />
                                                    <p className={style.menuCatalogSuggestText}>Новинки</p>
                                                </a>


                                                <a href="/" className={style.menuSuggestBlockContent}>
                                                    <img className={style.menuSuggestImg} src={img1} alt="Образы" />
                                                    <p className={style.menuCatalogSuggestText}>Образы</p>
                                                </a>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            {/* О нас */}
                            <li className={style.headerContentListItem}>
                                <div className={style.contentContainer}>
                                    <p className={style.contentLabel}>О нас</p>
                                </div>
                            </li>

                            {/* Покупателю */}
                            <li className={style.headerContentListItem}>
                                <div className={style.contentContainer}>
                                    <div className={style.contentLabelBlock} onClick={() => toggleTab("customer")}>
                                        <p className={style.contentLabel}>Покупателю</p>
                                        <Box className={cl(style.contentLableIconBlock, isSmall && isOpen("customer") && style.contentLableIconBlock__Active)}>
                                            <ArrowDownIcon className={style.contentLableIcon} />
                                        </Box>
                                    </div>

                                    <div className={cl(style.popupHeaderMenuSmall, isSmall && isOpen("customer") && style.popupHeaderMenuSmallOpen)}>
                                        <div className={style.popupHeaderMenuBlockSmall}>
                                            <div className={style.menuCatalogBlock}>
                                                {/* Первый столбец */}
                                                <ul className={style.menuCatalogList}>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Бутики</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Связаться с нами</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Оплата и доставка</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Система скидок</a></li>
                                                    <li className={style.menuCatalogListItem}><a className={style.menuCatalogLink} href="/">Политика конфиденциальности</a></li>
                                                </ul>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </nav>
                </div>

                {/* functions */}
                <div className={style.headerFunctionsBlock}>

                    {/* search */}
                    <div className={style.functionalBlock}>
                        <SearchIcon className={style.functionalIcon} />
                    </div>

                    {/* Instagram */}
                    <div className={style.functionalBlock}>
                        <InstagramIcon className={style.functionalIcon} />
                    </div>

                    {/* WhatsApp */}
                    <div className={style.functionalBlock}>
                        <WhatsAppIcon className={style.functionalIcon} />
                    </div>

                    {/* telegram */}
                    <div className={style.functionalBlock}>
                        <TelegramIcon className={style.functionalIcon} />
                    </div>




                </div>
            </div>
        </header >
    );
}

export default Header;
