import { useState, useEffect, useCallback } from 'react';
import { ToastType, UserProfile } from '../types';
import { User } from 'firebase/auth';
import { getUserProfile, updateUserProfile as updateUserProfileInDB } from '../firebase/user-functions';
import { useToast } from './use-toast';

const useUserProfile = (user: User | null) => {
    const { showToast } = useToast();

    const [userProfileData, setUserProfileData] = useState<UserProfile | null>(null);
    const [loadingUserProfileData, setLoadingUserProfileData] = useState(true);

    const fetchUserProfile = useCallback(async () => {
        if (user) {
            try {
                const profileData = await getUserProfile(user.uid);
                setUserProfileData(profileData);
            } catch (error) {
                showToast((error as Error).message, ToastType.Error);
            } finally {
                setLoadingUserProfileData(false);
            }
        }
    }, [user, showToast]);

    const updateUserProfile = useCallback(async (userProfileData: UserProfile) => {
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
    }, [user, fetchUserProfile, showToast]);

    useEffect(() => {
        fetchUserProfile();
    }, [user, fetchUserProfile]);

    return {
        userProfileData,
        fetchUserProfile,
        updateUserProfile,
        loadingUserProfileData,
    };
};

export default useUserProfile;
