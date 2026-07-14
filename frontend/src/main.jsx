import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './routes/AppRouter.jsx'
import { Toaster } from 'react-hot-toast'

// Initialize theme before render to prevent flash of unstyled content
const initializeTheme = () => {
  const saved = localStorage.getItem("theme");
  const isDark = saved === "dark" || 
    (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (isDark) {
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");
  }
};

initializeTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
    <Toaster
      position="top-right"
      gutter={12}
      toastOptions={{
        duration: 4000,
        className: 'premium-toast',
        style: {
          background: 'var(--toast-bg)',
          color: 'var(--toast-color)',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 10px 30px rgba(0,0,0,.12)',
          fontFamily: 'inherit',
          fontSize: '14px',
          lineHeight: '1.5',
        },
        success: {
          icon: '✅',
          style: {
            borderLeft: '4px solid #22c55e',
          }
        },
        error: {
          icon: '❌',
          style: {
            borderLeft: '4px solid #ef4444',
          }
        },
        warning: {
          icon: '⚠️',
          style: {
            borderLeft: '4px solid #f97316',
          }
        },
        info: {
          icon: 'ℹ️',
          style: {
            borderLeft: '4px solid #3b82f6',
          }
        }
      }}
    />
  </StrictMode>,
)