import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import Header from './components/header.tsx'
import { InviteProvider } from './context/invite.tsx'
import { FavoriteRestaurantsProvider } from './context/restaurants.tsx'
import { AppRoutes } from './routes/app.tsx'

import './index.css'
import { ToastProvider } from './context/toast.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <FavoriteRestaurantsProvider>
          <InviteProvider>
              <Router>
                  <Header />
                  <AppRoutes />
              </Router>
            </InviteProvider>
        </FavoriteRestaurantsProvider>
    </ToastProvider>
  </StrictMode>,
)
