import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import style from "App.module.css"

// Компоненты
import Footer from "components/footer/Footer";
import Header from "components/header/Header";

// Страницы
import HomePage from "pages/homePage/HomePage";
import AboutPage from "./pages/aboutPage/AboutPage";

// Утилиты
import ScrollToTop from 'utils/scrollToTop';


function App() {
  return (
    <div className={style.App}>
      <Router>

        <ScrollToTop />
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>

        <Routes>
          <Route path="/about" element={<AboutPage />} />
        </Routes>

        <Footer />
      </Router>

    </div>
  );
}

export default App;
