import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import { AppRouter } from './providers/router';
import { setupCustomToastUI } from '@/shared/config/toast';
import { useThemeState } from './providers/theme';


setupCustomToastUI();

function App() {
  const { theme } = useThemeState();
  return (
    <div className="App">
      <AppRouter />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        newestOnTop
        theme={theme}
        closeButton={false}
        hideProgressBar
      />
    </div>
  );
}

export default App;
