import React from 'react';
import { useUser } from '../hooks/use-user';

import logo from '../assets/logo.svg';
import './header.css';
import { useLogout } from '../hooks/use-logout';
import { Link } from 'react-router-dom';
import LoginButton from './login-button';

const Header: React.FC = () => {
    const { user, loadingUser } = useUser();

    const handleLogout = useLogout();

    const getInitial = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    return (
        <header>
            <nav>
                <div className="logo-container">
                    <Link to="/">
                        <img src={logo} alt="Party Of Logo" className="logo" />
                    </Link>
                </div>
                {!loadingUser && (
                    user ? (
                        <div className="user-info">
                            <span>{user.displayName}</span>
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.displayName || 'User'} className="user-photo" />
                            ) : (
                                <div className="user-initial">
                                    {user.displayName ? getInitial(user.displayName) : 'U'}
                                </div>
                            )}
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    ) : <LoginButton />
                )}
            </nav>
        </header>
    );
};

export default Header;