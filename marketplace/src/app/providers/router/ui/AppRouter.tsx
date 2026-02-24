import { Home } from "@/pages/home";
import { AppShell } from "@/widgets/app-shell";
import { Routes, Route, Navigate} from "react-router-dom";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<AppShell />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />}/>
      </Route>
    </Routes>
  );
};
