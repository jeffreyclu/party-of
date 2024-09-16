import { createContext, useState, useCallback } from 'react';
import Toast from '../components/toast';
import { ToastType } from '../types';

interface ToastContextProps {
    showToast: (message: string, type: ToastType, duration?: number) => void;
}

export const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<ToastType>(ToastType.Info);
    const [toastDuration, setToastDuration] = useState<number>(3000);

    const showToast = useCallback((message: string, type: ToastType, duration: number = 3000) => {
        setToastMessage(message);
        setToastType(type);
        setToastDuration(duration);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toastMessage && <Toast message={toastMessage} type={toastType} duration={toastDuration} />}
        </ToastContext.Provider>
    );
};
