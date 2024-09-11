import { BrowserRouter as Router } from 'react-router-dom';

import { UserProvider } from './context/user';
import Header from './components/header';
import { AppRoutes } from './routes/app';

import './App.css';


export default function App() {
    return (
        <UserProvider>
            <Router>
                <Header />
                <AppRoutes />
            </Router>
        </UserProvider>
    );
}