import style from "App.module.css"
import Footer from "components/footer/Footer";
import Header from "components/header/Header";
import HomePage from "pages/homePage/HomePage";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className={style.App}>
      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>


        <Footer />
      </Router>

    </div>
  );
}

export default App;
