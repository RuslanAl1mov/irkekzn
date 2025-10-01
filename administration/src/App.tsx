import PrivateRoute from 'routes/PrivateRoute';
import 'App.css';

import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppContentSection from 'components/content/AppContentSection';
import DashboardPage from 'pages/dashboardPage/DashboardPage';
import PublicRoute from 'routes/PublicRoute';
import LoginPage from 'pages/loginPage/LoginPage';
import { ToastContainer } from 'react-toastify';
import Aside from 'components/aside/Aside';
import Header from 'components/header/Header';

const HeaderLayout = () => {
  const location = useLocation();

  const hideHeaderRoutes = ['/login'];
  const shouldHideHeader = hideHeaderRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {!shouldHideHeader && <Header />}
    </>
  );
};

const AsideLayout = () => {
  const location = useLocation();

  const hideHeaderRoutes = ['/login'];
  const shouldHideHeader = hideHeaderRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {!shouldHideHeader && <Aside />}
    </>
  );
};


function App() {
  return (
    <div className="App">

      <HeaderLayout />
      <AsideLayout />

      <Routes>

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Navigate to="/dashboard" replace />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AppContentSection>
                <DashboardPage />
              </AppContentSection>
            </PrivateRoute>
          }
        />

      </Routes>

       <ToastContainer
        className="toast-styles"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

    </div>
  );
}

export default App;
