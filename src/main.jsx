import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#201F1C',
                color: '#EAE7DF',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '0.8rem',
                borderRadius: '2px',
                border: '1px solid rgba(234,231,223,0.15)',
              },
              success: { iconTheme: { primary: '#E8A233', secondary: '#201F1C' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
