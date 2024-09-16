import { useState, useEffect } from 'react';
import './toast.css';
import { ToastType } from '../types';

interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000 }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration]);

    if (!visible) return null;

    const handleClose = () => {
        setVisible(false);
    };

    return (
        <div className={`toast ${type.toLowerCase()}`}>
            <div className="toast-message">
                {message}
            </div>
            <button className="toast-close" onClick={handleClose}>
                ✖️
            </button>
        </div>
    );
};

export default Toast;