import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import Header from './components/header/header.tsx'
import { InviteProvider } from './context/invite.tsx'
import { FavoriteRestaurantsProvider } from './context/restaurants.tsx'
import { AppRoutes } from './routes/app.tsx'

import './index.css'
import { ToastProvider } from './context/toast.tsx'
import { UserProfileProvider } from './context/user-profile.tsx'
import { UserProvider } from './context/user.tsx'
import { InviteNotificationsProvider } from './context/notifications.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <UserProvider>
        <UserProfileProvider>
            <InviteNotificationsProvider>
              <FavoriteRestaurantsProvider>
                <InviteProvider>
                  <Router>
                      <Header />
                      <AppRoutes />
                  </Router>
                </InviteProvider>
              </FavoriteRestaurantsProvider>
            </InviteNotificationsProvider>
        </UserProfileProvider>
      </UserProvider>
    </ToastProvider>
  </StrictMode>,
)
