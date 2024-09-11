import React from 'react';
import { useUser } from "../hooks/use-user";
import Map from '../components/map';

const Dashboard: React.FC = () => {
    const { user } = useUser();

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Welcome, {user.displayName}</h2>
            <Map />
        </div>
    );
};

export default Dashboard;