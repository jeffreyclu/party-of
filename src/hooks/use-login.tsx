import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase/index';
import { signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { useUser } from './use-user';
import { createUserProfile } from '../firebase/user-functions';

export const useLogin = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleLogin = async () => {
        try {
            await setPersistence(auth, browserLocalPersistence);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            setUser(user);
            createUserProfile(user);
            navigate('/dashboard');
        } catch (error) {
            console.error("Error logging in: ", error);
        }
    };

    return { handleLogin };
};