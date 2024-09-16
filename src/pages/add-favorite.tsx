import { useEffect, useState } from "react";

import Map from "../components/map"
import { useFavoriteRestaurants } from "../hooks/use-favorite-restaurants";
import { useUserProfile } from "../hooks/use-user-profile";
import { useUser } from "../hooks/use-user";
import Loading from "../components/loading";

import './add-favorite.css';

export default function AddFavorites () {
    const { favoriteRestaurants } = useFavoriteRestaurants();
    const { user, loadingUser } = useUser();
    const { userProfileData, updateUserProfile, loadingUserProfileData } = useUserProfile();

    const [newUser, setNewUser] = useState(false);
    const [canContinue, setCanContinue] = useState(false);

    useEffect(() => {
        if (user && userProfileData && !userProfileData.completedIntro) {
            setNewUser(true);
        }
    }, [user, userProfileData]);

    useEffect(() => {
        setCanContinue(favoriteRestaurants.length >= 5);
    }, [favoriteRestaurants]);


    const handleContinue = () => {
        if (userProfileData && !userProfileData.completedIntro) {
            updateUserProfile({ ...userProfileData, completedIntro: true });
            window.location.href = '/dashboard';
        }
    };

    if (loadingUser || loadingUserProfileData) {
        return <Loading />;
    }
    

    return (
        <div className="add-favorites-container">
            {newUser && (
                <div className="message-container">
                    <p className="message">Add at least 5 favorite restaurants to continue!</p>
                    <button className="continue-button" onClick={handleContinue} disabled={!canContinue}>
                        Continue
                    </button>
                </div>
            )}
            <p>To add favorite restaurants, search for a restaurant using the search bar.</p>
            <div className="map-wrapper">
                <Map options={{ autoComplete: true, showFavorites: true }} />
            </div>
        </div>
    );
}