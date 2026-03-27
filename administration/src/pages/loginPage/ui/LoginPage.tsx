import cls from "./LoginPage.module.css";
import cn from "classnames";

import { useThemeState } from "@/app/providers/theme/model/store";
import { LoginForm } from "@/features/auth/login";

import backgroundImageLight from "@/assets/backgrounds/login-white-bg.jpg";
import backgroundImageDark from "@/assets/backgrounds/login-black-bg.png";


export const LoginPage = () => {
  const { theme } = useThemeState();

  return (
    <main className={cn("main", cls.main)}>
      <div className={cn("mainBlock", cls.mainBlock)}
        style={{ backgroundImage: `url(${theme === "light" ? backgroundImageLight : backgroundImageDark})` }}
      >
        <LoginForm />
      </div>
    </main>
  );
}
