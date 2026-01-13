import { LoginForm } from "@/features/auth/login";
import style from "./LoginPage.module.css";
import cn from "classnames";


export default function LoginPage() {
  return (
    <main className={cn("main", style.main)}>
      <div className={cn("mainBlock", style.mainBlock)}>
        <LoginForm />
      </div>
    </main>
  );
}
