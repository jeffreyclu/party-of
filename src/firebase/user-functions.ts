import { doc, setDoc, getDocFromServer, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';

import { db } from './index';
import { UserProfile } from '../types';

export const createUserProfile = async (user: User) => {
    const userDocRef = doc(db, 'users', user.uid);
    const newUserProfile: UserProfile = {
        id: user.uid,
        displayName: user.displayName ?? '',
        email: user.email ?? '',
        dietaryRestrictions: [],
        favorites: [],
        completedIntro: false,
        createdAt: serverTimestamp(),
    };
    try {
        await setDoc(userDocRef, newUserProfile);
        console.log('User profile created successfully');
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
};

export const updateUserProfile = async (uid: string, userProfileData: UserProfile) => {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, userProfileData, { merge: true });
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