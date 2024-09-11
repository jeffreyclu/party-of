import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/protected-route";
import { useUser } from "../hooks/use-user";
import Dashboard from "../pages/dashboard";
import Login from "../pages/login";

export const AppRoutes: React.FC = () => {
    const { user, loading } = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        </Routes>
    );
};