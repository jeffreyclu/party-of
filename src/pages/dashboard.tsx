import React from 'react';
import { useUser } from "../hooks/use-user";
import { useLogout } from '../hooks/use-logout';

const Dashboard: React.FC = () => {
    const { user } = useUser();

    const handleLogout = useLogout();

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Welcome, {user.displayName}</h2>
            {user.photoURL && user.displayName && <img src={user.photoURL} alt={user.displayName} />}
            <p>Email: {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;