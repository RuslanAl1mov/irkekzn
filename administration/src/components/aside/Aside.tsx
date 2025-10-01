import { useState } from "react";
import { useAside } from "context/AsideContext";
import styles from "./Aside.module.css";
import { Box } from "@mui/material";
import Home from "@mui/icons-material/HomeRounded";
import Products from "@mui/icons-material/CategoryRounded";
import ProductTag from "@mui/icons-material/LoyaltyRounded";
import Categories from "@mui/icons-material/LayersRounded";
import CallRequests from "@mui/icons-material/HeadsetMicRounded";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import CompanyIcon from "@mui/icons-material/ApartmentTwoTone";
import { NavLink } from "react-router-dom";
import { usePermissions } from "hooks/usePermissions";

type GetLinkClass = {
  isActive: boolean;
};

const Aside: React.FC = () => {
  const { has } = usePermissions();
  const { openAside, toggleAside } = useAside();

  const [isHovered, setIsHovered] = useState(false);

  const isMenuWide = openAside || isHovered;

  const getLinkClass = ({ isActive }: GetLinkClass): string =>
    `${styles.menuItemLink} ${isMenuWide ? styles.menuItemLinkWide : ""} ${
      isActive ? styles.menuItemLinkActive : ""
    }`;

  return (
    <aside
      className={`${styles.aside} ${isMenuWide ? styles.asideWide : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.wrapper}>
        <div className={styles.section}>
          {isMenuWide && (
            <p className={`${styles.sectionTitle} ${styles.sectionTitleVisible}`}>
              Главное меню
            </p>
          )}
          <ul className={styles.list}>
            <li>
              <NavLink to="/dashboard" className={getLinkClass}>
                <Box className={styles.icon}>
                  <Home />
                </Box>
                <span className={`${styles.itemTitle} ${isMenuWide ? styles.itemTitleVisible : ""}`}>
                  Главная
                </span>
              </NavLink>
            </li>

            {has("marketplace.view_product_list") && (
              <li>
                <NavLink to="/products" className={getLinkClass}>
                  <Box className={styles.icon}>
                    <Products />
                  </Box>
                  <span className={`${styles.itemTitle} ${isMenuWide ? styles.itemTitleVisible : ""}`}>
                    Товары
                  </span>
                </NavLink>
              </li>
            )}

            {has("marketplace.view_productcategory_list") && (
              <li>
                <NavLink to="/categories" className={getLinkClass}>
                  <Box className={styles.icon}>
                    <Categories />
                  </Box>
                  <span className={`${styles.itemTitle} ${isMenuWide ? styles.itemTitleVisible : ""}`}>
                    Категории
                  </span>
                </NavLink>
              </li>
            )}

            {has("marketplace.view_producttag_list") && (
              <li>
                <NavLink to="/product-tags" className={getLinkClass}>
                  <Box className={styles.icon}>
                    <ProductTag />
                  </Box>
                  <span className={`${styles.itemTitle} ${isMenuWide ? styles.itemTitleVisible : ""}`}>
                    Теги товаров
                  </span>
                </NavLink>
              </li>
            )}
          </ul>

          {has("services.view_callrequest_list") && (
            <>
              <div className={styles.divider}></div>
              {isMenuWide && (
                <p className={`${styles.sectionTitle} ${styles.sectionTitleVisible}`}>Сервисы</p>
              )}
            </>
          )}

          <ul className={styles.list}>
            {has("services.view_callrequest_list") && (
              <li>
                <NavLink to="/client-call-requests" className={getLinkClass}>
                  <Box className={styles.icon}>
                    <CallRequests />
                  </Box>
                  <span className={`${styles.itemTitle} ${isMenuWide ? styles.itemTitleVisible : ""}`}>
                    Запросы на звонок
                  </span>
                </NavLink>
              </li>
            )}
          </ul>

          {has("company.view_aboutcompany") && (
            <>
              <div className={styles.divider}></div>
              {isMenuWide && (
                <p className={`${styles.sectionTitle} ${styles.sectionTitleVisible}`}>Компания</p>
              )}
            </>
          )}

          <ul className={styles.list}>
            {has("company.view_aboutcompany") && (
              <li>
                <NavLink to="/about-company" className={getLinkClass}>
                  <Box className={styles.icon}>
                    <CompanyIcon />
                  </Box>
                  <span className={`${styles.itemTitle} ${isMenuWide ? styles.itemTitleVisible : ""}`}>
                    О компании
                  </span>
                </NavLink>
              </li>
            )}
          </ul>
        </div>

        <div className={styles.section}>
          <ul className={styles.list}>
            <li>
              <button type="button" className={styles.menuItemLink} onClick={toggleAside}>
                <Box className={`${styles.icon} ${openAside ? styles.toggleIconOpen : ""}`}>
                  <KeyboardDoubleArrowRightRoundedIcon />
                </Box>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Aside;
