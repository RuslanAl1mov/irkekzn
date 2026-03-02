import { LoginForm } from "@/features/auth/login";
import cls from "./LoginPage.module.css";
import cn from "classnames";


export default function LoginPage() {
  return (
    <main className={cn("main", cls.main)}>
      <div className={cn("mainBlock", cls.mainBlock)}>
        <LoginForm />
      </div>
    </main>
  );
}
