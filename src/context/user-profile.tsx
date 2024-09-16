import { createContext, useState, useEffect, useCallback } from 'react';
import { getUserProfile, updateUserProfile as updateUserProfileInDB, createUserProfile as createUserProfileInDB } from '../firebase/user-functions';
import { auth } from '../firebase';
import { useToast } from '../hooks/use-toast';
import { useUser } from '../hooks/use-user';
import { ToastType, UserProfile } from '../types';
import { User } from 'firebase/auth';

interface UserProfileContextProps {
    userProfileData: UserProfile | null;
    fetchUserProfile: () => Promise<void>;
    createUserProfile: (user: User) => Promise<void>;
    updateUserProfile: (userProfileData: UserProfile) => Promise<void>;
    loadingUserProfileData: boolean;
}

export const UserProfileContext = createContext<UserProfileContextProps | null>(null);

export const UserProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const [userProfileData, setUserProfileData] = useState<UserProfile | null>(null);
    const [loadingUserProfileData, setLoadingUserProfileData] = useState(true);
    
    const { showToast } = useToast();
    const { user } = useUser();

    const fetchUserProfile = useCallback(async () => {
        if (user) {
            try {
                setLoadingUserProfileData(true);
                const profile = await getUserProfile(user.uid);
                setUserProfileData(profile);
            } catch (error) {
                showToast((error as Error).message, ToastType.Error);
            } finally {
                setLoadingUserProfileData(false);
            }
        }
    }, [showToast, user]);

    const updateUserProfile = useCallback(async (userProfileData: UserProfile) => {
        const user = auth.currentUser;
        if (user) {
            try {
                setLoadingUserProfileData(true);
                await updateUserProfileInDB(user.uid, userProfileData);
                await fetchUserProfile(); // Refresh the profile data after update
            } catch (error) {
                showToast((error as Error).message, ToastType.Error);
            } finally {
                setLoadingUserProfileData(false);
            }
        }
    }, [fetchUserProfile, showToast]);

    const createUserProfile = useCallback(async (user: User) => {
        if (user) {
            try {
                setLoadingUserProfileData(true);
                const newProfile = await createUserProfileInDB(user);
                setUserProfileData(newProfile);
                showToast('User profile created successfully', ToastType.Success);
            } catch (error) {
                showToast((error as Error).message, ToastType.Error);
            } finally {
                setLoadingUserProfileData(false);
            }
        }
    }, [showToast]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    return (
        <UserProfileContext.Provider value={{ userProfileData, fetchUserProfile, createUserProfile, updateUserProfile, loadingUserProfileData }}>
            {children}
        </UserProfileContext.Provider>
    );
};
