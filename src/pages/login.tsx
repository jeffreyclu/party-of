import React from 'react';
import LoginButton from '../components/login-button';

const Login: React.FC = () => {
    return (
        <div>
            <h2>You need to login first!</h2>
            <LoginButton />
        </div>
    );
};

export default Login;