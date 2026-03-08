import cls from "./Sidebar.module.css";
import cn from 'classnames';

import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useLogout } from "@/features/auth/logout";
import { useSidebarState } from "@/widgets/sidebar";

import Logo from "@/assets/logo/logo.svg?react";
import DashboardIcon from "@/assets/icons/dashboard.svg?react";
import ClientsIcon from "@/assets/icons/users.svg?react";
import EmployessIcon from "@/assets/icons/employee.svg?react";
import DoubleArrowIcon from "@/assets/icons/arrow.svg?react";
import UserImage from "@/assets/app/user.jpg";
import ExitIcon from "@/assets/icons/exit.svg?react";


type GetLinkClass = {
  isActive: boolean;
};

export const Sidebar: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebarState();
  const [isHovered, setIsHovered] = useState(false);
  const isMenuWide = isOpen || isHovered;

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

          </ul>
        </div>

        <div className={cls.userBlock}>
          <div className={cls.userInfoBlock}>
            <img src={UserImage} alt="User photo" className={cls.userPhoto} />
            {isMenuWide && (

              <div className={cls.userNameBlock}>
                <p className={cls.userName} title="Ruslan Alimov">Ruslan Alimov</p>
                <p className={cls.userEmail} title="ruslan.alimov@irkekzn.com">ruslan.alimov@.com</p>
              </div>
            )}
          </div>

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
