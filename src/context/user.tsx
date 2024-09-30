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
        const unsubscribe = auth.onIdTokenChanged(async (user) => {
            if (!user) {
                setUser(null);
                setLoadingUser(false);
                return;
            }

            const tokenResult = await user.getIdTokenResult();
            const authTime = tokenResult.claims.auth_time;

            // Check if auth_time is defined
            if (!authTime) {
                console.error('auth_time is undefined');
                return;
            }

            const authTimeMs = parseInt(authTime, 10) * 1000; // convert to milliseconds
            const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // one week ago

            // If the user has been logged in for over a week, log them out
            if (authTimeMs < oneWeekAgo) {
                auth.signOut();
                setUser(null);
                setLoadingUser(false);
                return;
            }

            // Update the token to enforce one-session-per-user
            await user.getIdToken(true);
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