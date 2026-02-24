import { Header } from "@/widgets/header";
import cls from "./AppShell.module.css";

import { Outlet } from "react-router";

export const AppShell = () => {

  return (
    <div className={cls.mainLayout}>
      {/* <Sidebar /> */}
      <div className={cls.allContent}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
};
