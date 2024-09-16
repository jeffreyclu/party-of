import LoginButton from '../components/login-button';
import logo from '../assets/logo.svg';

import './login.css';

const Login: React.FC = () => {
    return (
        <div className="login-container">
            <img src={logo} alt="Party Of Logo"/>
            <p>Add your favorite restaurants. Invite friends. Get restaurant suggestions.</p>
            <LoginButton />
            <p className="disclaimer">
                Disclaimer: We only store the authentication information provided by Google, which includes your unique user ID, email address, and display name. No other personal data is collected or stored.
            </p>
        </div>
    );
};

export default Login;