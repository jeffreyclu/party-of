// login.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase/index';
import { signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { useUser } from "../hooks/use-user";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleLogin = () => {
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                return signInWithPopup(auth, provider);
            })
            .then((result) => {
                const user = result.user;
                setUser(user);
                navigate('/dashboard');
            })
            .catch((error) => {
                console.error("Error logging in: ", error);
            });
    };

    return (
        <div>
            <button onClick={handleLogin}>Login with Google</button>
        </div>
    );
};

export default Login;