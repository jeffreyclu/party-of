import { signOut } from 'firebase/auth';
import { auth } from '../firebase/index';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../hooks/use-user";

export const useLogout = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setUser(null);
                navigate('/');
            })
            .catch((error) => {
                console.error("Error logging out: ", error);
            });
    };

    return handleLogout;
};