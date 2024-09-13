import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/protected-route";
import { useUser } from "../hooks/use-user";
import Dashboard from "../pages/dashboard";
import Login from "../pages/login";
import FavoriteRestaurants from "../pages/favorites";
import NotFound from "../pages/404";
import Profile from "../pages/profile";
import Invite from "../pages/invite";
import CreateInvite from "../pages/create-invite";
import { Events } from "../pages/events";
import AddFavorites from "../pages/add-favorite";

export const AppRoutes: React.FC = () => {
    const { user } = useUser();

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
            <Route path="/favorites" element={<ProtectedRoute component={FavoriteRestaurants} />} />
            <Route path="/favorites/add" element={<ProtectedRoute component={AddFavorites} />} />
            <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
            <Route path="/invite/create" element={<ProtectedRoute component={CreateInvite} />} />
            <Route path="/invite/:inviteId" element={<ProtectedRoute component={Invite} />} />
            <Route path="/invites/hosting" element={<ProtectedRoute component={() => <Events host={true}/>} />} />
            <Route path="/invites/attending" element={<ProtectedRoute component={() => <Events host={false}/>} />} />
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};