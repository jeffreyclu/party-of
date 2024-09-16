import { createContext, useState, useCallback, useEffect } from 'react';
import Toast from '../components/toast';
import { ToastMessage, ToastType } from '../types';

interface ToastContextProps {
    showToast: (message: string, type: ToastType, duration?: number) => void;
}

export const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toastQueue, setToastQueue] = useState<ToastMessage[]>([]);
    const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);

    const showToast = useCallback((message: string, type: ToastType, duration: number = 1000) => {
        setToastQueue(prevQueue => [...prevQueue, { message, type, duration }]);
    }, []);

    useEffect(() => {
        if (!currentToast && toastQueue.length > 0) {
            setCurrentToast(toastQueue[0]);
            setToastQueue(prevQueue => prevQueue.slice(1));
        }
    }, [currentToast, toastQueue]);

    useEffect(() => {
        if (currentToast) {
            const timer = setTimeout(() => {
                setCurrentToast(null);
            }, currentToast.duration);
            return () => clearTimeout(timer);
        }
    }, [currentToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {currentToast && <Toast message={currentToast.message} type={currentToast.type} duration={currentToast.duration} />}
        </ToastContext.Provider>
    );
};