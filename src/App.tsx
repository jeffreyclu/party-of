import { BrowserRouter as Router } from 'react-router-dom';

import { UserProvider } from './context/user';
import Header from './components/header';
import { AppRoutes } from './routes/app';

import './App.css';
import { FavoriteRestaurantsProvider } from './context/restaurants';


export default function App() {
    return (
        <UserProvider>
            <FavoriteRestaurantsProvider>
                <Router>
                    <Header />
                    <AppRoutes />
                </Router>
            </FavoriteRestaurantsProvider>
        </UserProvider>
    );
}