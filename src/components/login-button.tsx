import React from 'react';
import { useLogin } from '../hooks/use-login';

const LoginButton: React.FC = () => {
    const { handleLogin } = useLogin();

    return (
        <div>
            <button onClick={handleLogin}>Login with Google</button>
        </div>
    );
};

export default LoginButton;