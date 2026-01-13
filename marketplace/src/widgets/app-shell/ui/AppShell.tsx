import { Outlet } from "react-router";

import cls from "./AppShell.module.css";

export const AppShell = () => {

  return (
    <div className={cls.mainLayout}>
      {/* <Header />
      <Sidebar /> */}
      <div className={cls.allContent}>
        <Outlet />
      </div>
    </div>
  );
};
