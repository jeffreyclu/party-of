import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase/index';
import { signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { useUser } from './use-user';
import { createUserProfile } from '../firebase/user-functions';
import { useToast } from './use-toast';
import { ToastType } from '../types';

export const useLogin = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const { showToast } = useToast();

    const handleLogin = async () => {
        try {
            await setPersistence(auth, browserLocalPersistence);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // showToast('Login successful', ToastType.Success);

            setUser(user);
            createUserProfile(user);
            navigate('/dashboard');
        } catch (error) {
            showToast((error as Error).message, ToastType.Error);
        }
    };

    return { handleLogin };
};