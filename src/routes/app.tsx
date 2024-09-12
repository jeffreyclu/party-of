import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/protected-route";
import { useUser } from "../hooks/use-user";
import Dashboard from "../pages/dashboard";
import Login from "../pages/login";
import Map from "../components/map";
import FavoriteRestaurants from "../components/favorites";
import NotFound from "../pages/404";
import Profile from "../pages/profile";

export const AppRoutes: React.FC = () => {
    const { user } = useUser();

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
            <Route path="/map" element={<ProtectedRoute component={Map} />} />
            <Route path="/favorites" element={<ProtectedRoute component={FavoriteRestaurants} />} />
            <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};