import { useCallback, useRef, useState } from "react";
import { useNavigate, NavLink } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import cn from "classnames";

import { useAuthStore } from "@/entities/user";
import { logout } from '@/features/auth/logout/api/logout.api';
// import { patchProfile } from "@/entities/profile-edit";
// import { useClickOutside } from "@/shared/lib/react/useClickOutside";

import userImg from "@/assets/app/user.jpg";
import LogoIcon from "@/assets/logo/irke_logo_black.svg";
import cls from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation("common");
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = i18n.language;
  const closeDropdown = useCallback(() => setIsDropdownOpen(false), []);

  // useClickOutside(dropdownRef, closeDropdown);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const handleChangeLanguage = (newLanguage: string) => {
    if (newLanguage === currentLanguage) return;
    void i18n.changeLanguage(newLanguage);
    // void patchProfile({ language: newLanguage })
    //   .then(() => window.location.reload())
    //   .catch((e) => console.error("Language change failed:", e));
  };

  return (
    <header className={cls.header}>
      <div className={cls.container}>
        <div className={cls.left}>
          <img src={LogoIcon} alt="Logo" className={cls.logo} />
        </div>

        <div className={cls.right}>
          <div className={cls.userSection} ref={dropdownRef}>
            <button 
              className={cls.userTrigger}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img 
                src={user?.photo || userImg} 
                alt="User" 
                className={cls.avatar} 
              />
            </button>

            {/* Выпадающее меню */}
            <div className={cn(cls.dropdown, isDropdownOpen && cls.dropdownOpen)}>
              <ul className={cls.menuList}>
                {user?.is_staff && (
                  <li className={cls.menuItem}>
                    <NavLink to="/profile" onClick={closeDropdown} className={cls.menuLink}>
                      {t("header.menu.account")}
                    </NavLink>
                  </li>
                )}

                <li className={cls.menuItem}>
                  <div className={cls.switchersGroup}>
                    {/* Язык */}
                    <div className={cls.switcher}>
                      <button
                        className={cn(cls.switchBtn, currentLanguage === "ru" && cls.active)}
                        onClick={() => handleChangeLanguage("ru")}
                      >
                        RU
                      </button>
                      <button
                        className={cn(cls.switchBtn, currentLanguage === "en" && cls.active)}
                        onClick={() => handleChangeLanguage("en")}
                      >
                        EN
                      </button>
                    </div>
                  </div>
                </li>

                <li className={cls.menuItem}>
                  <button 
                    className={cn(cls.menuLink, cls.logoutBtn)} 
                    onClick={handleLogout}
                  >
                    {t("header.menu.logout")}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
