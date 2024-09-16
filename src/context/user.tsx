import { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { User } from 'firebase/auth';

interface UserContextProps {
    user: User | null;
    loadingUser: boolean;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextProps | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoadingUser(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, loadingUser, setUser }}>
            {children}
        </UserContext.Provider>
    );
};