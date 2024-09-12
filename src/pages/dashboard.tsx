import React from 'react';
import { useUser } from "../hooks/use-user";
import Map from '../components/map';
import FavoriteRestaurants from '../components/favorites';

const Dashboard: React.FC = () => {
    const { user } = useUser();

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Map />
            <FavoriteRestaurants />
        </div>
    );
};

export default Dashboard;