import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/use-user';
import Loading from './loading';

interface ProtectedRouteProps {
    component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
    const { user, loadingUser } = useUser();

    if (loadingUser) {
        return <Loading />; // You can replace this with a proper loading indicator
    }

    return user ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;