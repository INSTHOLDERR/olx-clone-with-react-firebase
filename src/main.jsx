import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './Components/Context/Auth.jsx';
import { ItemsContextProvider } from './Components/Context/Item.jsx';
import { BrowserRouter } from 'react-router-dom'; // <- import BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>          {/* Wrap the app in BrowserRouter */}
      <ItemsContextProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ItemsContextProvider>
    </BrowserRouter>
  </StrictMode>
);
