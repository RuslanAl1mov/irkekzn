import { ToastContainer } from 'react-toastify';
import { AppRouter } from './providers/router';
import { setupCustomToastUI } from '@/shared/config/toast';
import "react-toastify/dist/ReactToastify.css";


setupCustomToastUI();

function App() {
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
        closeButton={false}
        hideProgressBar
      />
    </div>
  );
}

export default App;
