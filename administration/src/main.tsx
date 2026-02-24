import '@/app/styles/index.css';
import 'react-toastify/dist/ReactToastify.css';
import "@/shared/config/i18n";

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/app/App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode >
);

