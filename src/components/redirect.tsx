import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/use-user";

export default function Redirect() {
    const { user } = useUser();

    if (user) {
        // Redirect to dashboard if user is logged in
        return <Navigate to="/dashboard" replace />;
    } else {
        // Redirect to login if user is not logged in
        return <Navigate to="/login" replace />;
    }
}