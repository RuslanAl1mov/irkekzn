import { useCallback, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { logout } from '@/features/auth/logout/api/logout.api';
import cn from "classnames";

import userImg from "@/assets/app/user.jpg";
import LogoIcon from "@/assets/logo/irke_logo_black.svg";
import cls from "./Header.module.css";
import { useClickOutside } from "@/shared/lib/react";

export const Header = () => {
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => setIsDropdownOpen(false), []);

  useClickOutside(dropdownRef, closeDropdown);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <header className={cls.header}>
      <div className={cls.container}>

        <div className={cls.left}>
          <img src={LogoIcon} alt="Logo" className={cls.logo} />
        </div>

        {/* Правый блок с иконками */}
        <ul className={cls.right}>
          <li className={cls.funcItem}>
            <div className={cls.userMenu} ref={dropdownRef}>
              <img className={cls.userAvatar} src={userImg} onClick={() => setIsDropdownOpen(!isDropdownOpen)} />

              {/* Меню пользователя */}
              <div className={cn(cls.modalBlock, isDropdownOpen && cls.modalBlockOpen)}>
                <ul className={cls.modalList}>
                  <li className={cls.modalListItem}>
                    <button
                      className={cn(cls.modalLink, cls.modalLink__red)}
                      onClick={() => {
                        closeDropdown();
                        void handleLogout();
                      }}
                    >
                      Выйти
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </header >
  );
};
