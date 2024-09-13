import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import Header from './components/header.tsx'
import { InviteProvider } from './context/invite.tsx'
import { FavoriteRestaurantsProvider } from './context/restaurants.tsx'
import { AppRoutes } from './routes/app.tsx'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FavoriteRestaurantsProvider>
            <InviteProvider>
                <Router>
                    <Header />
                    <AppRoutes />
                </Router>
            </InviteProvider>
        </FavoriteRestaurantsProvider>
  </StrictMode>,
)
