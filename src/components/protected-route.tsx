import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/use-user';

interface ProtectedRouteProps {
    component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
    const { user } = useUser();

    return user ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;