import { useState, useEffect } from 'react';
import { auth } from '../firebase/index'; // Adjust the import as necessary
import { User } from 'firebase/auth';

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoadingUser(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loadingUser, setUser };
};