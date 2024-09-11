import React from 'react';
import { useUser } from '../hooks/use-user';

import logo from '../assets/temp-logo.png';
import './header.css';
import { useLogout } from '../hooks/use-logout';

const Header: React.FC = () => {
    const { user } = useUser();

    const handleLogout = useLogout();

    const getInitial = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    return (
        <header>
            <nav>
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                {user && (
                    <div className="user-info">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName || 'User'} className="user-photo" />
                        ) : (
                            <div className="user-initial">
                                {user.displayName ? getInitial(user.displayName) : 'U'}
                            </div>
                        )}
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;