import { ToastContainer } from 'react-toastify';
import { AppRouter } from './providers/router';



function App() {
  return (
    <div className="App">
      <AppRouter />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
    </div>
  );
}

export default App;
