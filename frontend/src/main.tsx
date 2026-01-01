import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import Snowfall from 'react-snowfall';
import { registerSW } from "virtual:pwa-register";
import App from './App.tsx';
import router from './routes/router.tsx';
import './style.css';

registerSW();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* ❄️ Snowfall must be outside RouterProvider */}
    <Snowfall
      color="#cfd8dc"           // light gray-blue (visible on white)
      snowflakeCount={180}
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0.9,
      }}
    />


    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </StrictMode>,
)
