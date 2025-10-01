import  "App.css";
import style from "./LoginPage.module.css";

import cn from "classnames";
import { toast } from "react-toastify";
import { useState } from "react";

// Лого
import LogoIcon from "media/logo/irke_logo_black.svg";

// Контексты
import { useAuth } from "context/AuthContext";

// Компоненты
import EmailInput from "components/inputs/emailInput/EmailInput";
import PasswordInput from "components/inputs/passwordInput/PasswordInput";


export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async () => {
    if (!email || !password) {
      toast.warn("Заполните все поля!");
      return;
    }
    try {
      await login(email, password);
      toast.success("Добро пожаловать!");
    } catch (error) {
      toast.error("Кажется, мы вас не узнаём...");
    }
  };

  return (
    <main className={cn("main", style.main)}>
      <div className={cn("mainBlock", style.mainBlock)}>
        <form
          className={style.authForm}
          onSubmit={(e) => {
            e.preventDefault();
            handleLoginSubmit();
          }}
        >
          {/* Логотип */}
          <div className={style.logoBlock}>
            <img src={LogoIcon} alt="ARDS Lux logo" className={style.logo} />
            <p className={style.title}>Администратор</p>
          </div>

          {/* Поля ввода */}
          <div className={style.inputsBlock}>
            <EmailInput
              value={email}
              setValue={setEmail}
              placeholder="Email"
            />
            <PasswordInput
              value={password}
              setValue={setPassword}
              placeholder="Password"
            />
          </div>

          {/* Кнопки входа */}
          <div className={style.btnsBlock}>
            <button type="submit" className={style.submitBtn}>
              Войти
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
