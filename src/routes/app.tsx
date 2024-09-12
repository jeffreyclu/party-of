import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/protected-route";
import { useUser } from "../hooks/use-user";
import Dashboard from "../pages/dashboard";
import Login from "../pages/login";
import Settings from "../pages/settings";
import Map from "../components/map";
import FavoriteRestaurants from "../components/favorites";

export const AppRoutes: React.FC = () => {
    const { user } = useUser();

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
            <Route path="/settings" element={<ProtectedRoute component={Settings} />} />
            <Route path="/map" element={<ProtectedRoute component={Map} />} />
            <Route path="/favorites" element={<ProtectedRoute component={FavoriteRestaurants} />} />
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        </Routes>
    );
};