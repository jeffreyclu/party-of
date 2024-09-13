import { doc, setDoc, getDocFromServer } from 'firebase/firestore';
import { db } from './index'; // Adjust the import path as needed
import { UserProfile } from '../types';

export const updateUserProfile = async (uid: string, displayName: string, dietaryRestrictions: string[]) => {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
        displayName,
        dietaryRestrictions,
    }, { merge: true });
};

export const getUserProfile = async (id: string) => {
    const userDocRef = doc(db, 'users', id);
    try {
        const userDoc = await getDocFromServer(userDocRef);
        if (!userDoc.exists()) {
            console.error('User document not found');
            return null;
        }
        return userDoc.data() as UserProfile;
    } catch(error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
};