import cls from "./Sidebar.module.css";
import cn from 'classnames';

import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useLogout } from "@/features/auth/logout";
import { useThemeState } from "@/app/providers/theme";
import { ThemeSwitch } from "@/shared/ui/theme-switch";
import { useSidebarState } from "@/widgets/sidebar";
import { useAuthStore } from "@/entities/user";

import Logo from "@/assets/logo/logo.svg?react";
import DashboardIcon from "@/assets/icons/dashboard.svg?react";
import ClientsIcon from "@/assets/icons/users.svg?react";
import EmployessIcon from "@/assets/icons/employee.svg?react";
import DoubleArrowIcon from "@/assets/icons/arrow.svg?react";
import UserImage from "@/assets/app/user.jpg";
import ExitIcon from "@/assets/icons/exit.svg?react";
import SettingsIcon from "@/assets/icons/settings.svg?react";
import ShopsIcon from "@/assets/icons/house.svg?react";
import CategoriesIcon from "@/assets/icons/layers.svg?react";
import ProductCardsIcon from "@/assets/icons/product-card.svg?react";
import ProductsIcon from "@/assets/icons/products.svg?react";
import StockIcon from "@/assets/icons/notebook.svg?react";

type GetLinkClass = {
  isActive: boolean;
};

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const { isOpen, toggleSidebar } = useSidebarState();
  const { theme, setTheme } = useThemeState();
  const [isHovered, setIsHovered] = useState(false);
  const isMenuWide = isOpen || isHovered;
  const isDarkTheme = theme === "dark";

  const { mutate: logout } = useLogout({
    onSuccess: () => {
      toast.success("До свидания!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const getLinkClass = ({ isActive }: GetLinkClass): string =>
    cn(cls.menuListLink, isMenuWide && cls.menuListLink__wide, isActive && cls.menuListLink__active);

  return (
    <aside className={cn(cls.aside, isMenuWide && cls.asideWide)}>
      <div className={cls.asideBlock}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={cls.headerBlock}>
          <div className={cls.logoBlock}>
            <Logo className={cls.logo} />
          </div>
          {isMenuWide && (
            <div className={cls.titleBlock}>
              <h1 className={cls.title} title="IRKE">IRKE</h1>
              <p className={cls.subTitle} title="Управление сайтом">Управление сайтом</p>
            </div>
          )}

        </div>
        <div className={cls.content}>

          {/* Главное меню */}
          <ul className={cls.contentList}>
            <li>
              <NavLink to="/dashboard" className={getLinkClass}>
                <DashboardIcon className={cls.menuListIcon} />
                <p className={cn(cls.menuListTitle, isMenuWide && cls.menuListTitle__visible)}>
                  Панель управления
                </p>
              </NavLink>
            </li>

            {/* Товары и категории */}
            <li>
              <div className={cn(cls.menuListSectionTitleBock, isMenuWide && cls.menuListSectionTitleBock__visible)}>
                <p className={cn(cls.menuListSectionTitle, isMenuWide && cls.menuListSectionTitle__visible)}>Товары и категории</p>
              </div>
            </li>
            <li>
              <NavLink to="/categories" className={getLinkClass}>
                <CategoriesIcon className={cls.menuListIcon} />
                <p className={cn(cls.menuListTitle, isMenuWide && cls.menuListTitle__visible)}>
                  Категории
                </p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/product-cards" className={getLinkClass}>
                <ProductCardsIcon className={cls.menuListIcon} />
                <p className={cn(cls.menuListTitle, isMenuWide && cls.menuListTitle__visible)}>
                  Карточки товаров
                </p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className={getLinkClass}>
                <ProductsIcon className={cls.menuListIcon} />
                <p className={cn(cls.menuListTitle, isMenuWide && cls.menuListTitle__visible)}>
                  Товары
                </p>
              </NavLink>
            </li>

            {/* Пользователи */}
            <li>
              <div className={cn(cls.menuListSectionTitleBock, isMenuWide && cls.menuListSectionTitleBock__visible)}>
                <p className={cn(cls.menuListSectionTitle, isMenuWide && cls.menuListSectionTitle__visible)}>Пользователи</p>
              </div>
            </li>
            <li>
              <NavLink to="/clients" className={getLinkClass}>
                <ClientsIcon className={cls.menuListIcon} />
                <p className={cn(cls.menuListTitle, isMenuWide && cls.menuListTitle__visible)}>
                  Клиенты
                </p>
              </NavLink>
            </li>

            <li>
              <NavLink to="/employees" className={getLinkClass}>
                <EmployessIcon className={cls.menuListIcon} />
                <p className={cn(cls.menuListTitle, isMenuWide && cls.menuListTitle__visible)}>
                  Сотрудники
                </p>
              </NavLink>
            </li>

            {/* Бутики */}
            <li>
              <div className={cn(cls.menuListSectionTitleBock, isMenuWide && cls.menuListSectionTitleBock__visible)}>
                <p className={cn(cls.menuListSectionTitle, isMenuWide && cls.menuListSectionTitle__visible)}>Управление и настройки</p>
              </div>
            </li>
            <li>
              <NavLink to="/shops" className={getLinkClass}>
                <ShopsIcon className={cls.menuListIcon} />
                <p className={cn(cls.menuListTitle, isMenuWide && cls.menuListTitle__visible)}>
                  Бутики
                </p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/products-stock" className={getLinkClass}>
                <StockIcon className={cls.menuListIcon} />
                <p className={cn(cls.menuListTitle, isMenuWide && cls.menuListTitle__visible)}>
                  Складской учет
                </p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings?tab=general" className={getLinkClass}>
                <SettingsIcon className={cls.menuListIcon} />
                <p className={cn(cls.menuListTitle, isMenuWide && cls.menuListTitle__visible)}>
                  Настройки
                </p>
              </NavLink>
            </li>

          </ul>

          <div
            className={cn(cls.themeBlock, !isMenuWide && cls.themeBlockCompact)}
            title={`Тема: ${isDarkTheme ? "темная" : "светлая"}`}
          >
            {isMenuWide && (
              <div className={cls.themeTextBlock}>
                <p className={cls.themeTitle}>Тема</p>
              </div>
            )}

            <ThemeSwitch
              dark={isDarkTheme}
              onDarkChange={(nextDark) =>
                setTheme(nextDark ? "dark" : "light")
              }
              aria-label="Переключить тему"
            />
          </div>
        </div>

        <div className={cls.userBlock}>
        <NavLink to="/profile" className={cls.userInfoBlockLink}>
          <div className={cls.userInfoBlock}>
              <img src={UserImage} alt="User photo" className={cls.userPhoto} />
              {isMenuWide && (

                <div className={cls.userNameBlock}>
                  <p className={cls.userName} title={`${user?.first_name} ${user?.last_name}`}>{`${user?.first_name} ${user?.last_name}`}</p>
                  <p className={cls.userEmail} title={user?.email}>{user?.email}</p>
                </div>
              )}
            </div>
          </NavLink>

          {isMenuWide && (
            <div className={cls.exitBlock} title="Выйти из системы" onClick={() => logout()}>
              <ExitIcon className={cls.exitIcon} />
            </div>
          )}

        </div>
      </div>

      {/* Кнопка сжатия панели */}
      <button type="button" className={cls.hideSidebarButton} onClick={toggleSidebar}>
        <DoubleArrowIcon className={cn(cls.hideSidebarIcon, isOpen && cls.hideSidebarIcon__open)} />
      </button>
    </aside >
  );
};
