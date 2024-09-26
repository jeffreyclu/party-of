import { useLogin } from '../hooks/use-login';

import "./login-button.css";

const LoginButton: React.FC = () => {
    const { handleLogin } = useLogin();

    return (
        <div>
            <button className="login-button" onClick={handleLogin}>Login with Google</button>
        </div>
    );
};

export default LoginButton;
