import { AuthProvider } from './lib/auth'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routing/router'
import './styles/index.css'
import { ThemeProvider } from './lib/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider><RouterProvider router={router} /></AuthProvider>
    </ThemeProvider>
  </StrictMode>
)