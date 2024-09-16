import { signOut } from 'firebase/auth';
import { auth } from '../firebase/index';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../hooks/use-user";
import { useToast } from './use-toast';
import { ToastType } from '../types';

export const useLogout = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const { showToast } = useToast();

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setUser(null);
                showToast('Logout successful', ToastType.Success);
                navigate('/');
            })
            .catch((error) => {
                showToast((error as Error).message, ToastType.Error);
            });
    };

    return handleLogout;
};