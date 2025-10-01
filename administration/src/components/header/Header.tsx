import { useAuth } from "context/AuthContext";
import { NavLink } from "react-router-dom";

import userImg from "media/accounts/user.jpg";
import LogoIcon from "media/logo/irke_logo_black.svg";

import styles from "./Header.module.css";

const Header = () => {

  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Логотип */}
        <div className={styles.left}>
          <div className={styles.logoBlock}>
            <img src={LogoIcon} alt="logo" className={styles.logo} />
            <p className={styles.logoText}></p>
          </div>
        </div>

        {/* Правая часть */}
        <div className={styles.right}>
          <ul className={styles.funcList}>
            {/* Уведомления */}
            <li className={styles.funcItem}>
              <NavLink className={styles.iconLink} to="#">
                <div className={styles.icon}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 26">
                    <path d="M17.5 14.5002V10.5395C17.4982 8.77486 16.8697 7.06775 15.7258 5.72052C14.5818 4.3733 12.9963 3.4729 11.25 3.17879V1.82122C11.25 1.4909 11.1183 1.17411 10.8839 0.940536C10.6495 0.706964 10.3315 0.575745 10 0.575745C9.66848 0.575745 9.35054 0.706964 9.11612 0.940536C8.8817 1.17411 8.75 1.4909 8.75 1.82122V3.17879C7.00367 3.4729 5.41816 4.3733 4.27423 5.72052C3.13031 7.06775 2.50179 8.77486 2.5 10.5395V14.5002C1.77056 14.7571 1.13875 15.2326 0.691173 15.8614C0.243598 16.4902 0.00217439 17.2415 0 18.0124V20.5034C0 20.8337 0.131696 21.1505 0.366117 21.384C0.600537 21.6176 0.918479 21.7488 1.25 21.7488H5.175C5.46285 22.8042 6.09125 23.7359 6.96325 24.4001C7.83524 25.0643 8.90237 25.4242 10 25.4242C11.0976 25.4242 12.1648 25.0643 13.0368 24.4001C13.9087 23.7359 14.5371 22.8042 14.825 21.7488H18.75C19.0815 21.7488 19.3995 21.6176 19.6339 21.384C19.8683 21.1505 20 20.8337 20 20.5034V18.0124C19.9978 17.2415 19.7564 16.4902 19.3088 15.8614C18.8612 15.2326 18.2294 14.7571 17.5 14.5002Z" />
                  </svg>
                </div>
              </NavLink>
            </li>

            {/* Пользователь */}
            <li className={styles.funcItem}>
              <div className={`${styles.iconButton} ${styles.userMenu}`}>
                <img
                  className={styles.userAvatar}
                  src={user?.photo || userImg}
                  alt="Аватар пользователя"
                />
                <div className={styles.userDropdown}>
                  <div className={styles.userDropdownContent}>
                    <ul className={styles.userDropdownList}>
                      <li>
                        <a className={styles.userDropdownLink}>Аккаунт</a>
                      </li>
                      <li>
                        <button onClick={logout} className={styles.userDropdownLink}>
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
