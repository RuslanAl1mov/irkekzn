import styles from "./Header.module.css";
import { NavLink } from "react-router-dom";
import { logout } from '@/features/auth/logout/api/logout.api';
import { useNavigate } from 'react-router-dom';

import userImg from "@/assets/app/user.jpg";
import LogoIcon from "@/assets/logo/irke_logo_black.svg";
import NotificationsIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { useAuthStore } from "@/entities/user";
import { Box } from "@mui/material";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.logoBlock}>
            <img src={LogoIcon} alt="logo" className={styles.logo} />
          </div>
        </div>

        <div className={styles.right}>
          <ul className={styles.funcList}>
            <li className={styles.funcItem}>
              <NavLink className={styles.iconLink} to="#">
                <Box className={styles.icon}>
                  <NotificationsIcon />
                </Box>
              </NavLink>
            </li>

            <li className={styles.funcItem}>
              <div className={`${styles.iconButton} ${styles.userMenu}`}>
                <img
                  className={styles.userAvatar}
                  src={user?.photo || userImg}
                  alt={user?.first_name || "Аватар пользователя"}
                />
                <div className={styles.userDropdown}>
                  <div className={styles.userDropdownContent}>
                    <ul className={styles.userDropdownList}>
                      <li>
                        <span className={styles.userDropdownLink}>
                          {user?.email || "Аккаунт"}
                        </span>
                      </li>
                      <li>
                        <button onClick={handleLogout} className={styles.userDropdownLink}>
                          Выход
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
