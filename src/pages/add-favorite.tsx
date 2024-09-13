import { useEffect, useState } from "react";
import Map from "../components/map"
import { useFavoriteRestaurants } from "../hooks/use-favorite-restaurants";
import { useNavigate } from "react-router-dom";

import './add-favorite.css';

export default function AddFavorites () {
    const { favoriteRestaurants, loadingFavoriteRestaurants } = useFavoriteRestaurants();
    const [canContinue, setCanContinue] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setCanContinue(favoriteRestaurants.length >= 5);
    }, [favoriteRestaurants]);

    const handleContinue = () => {
        navigate('/dashboard');
    };

    // TODO: figure out why this causes the bug where the favorites don't appear on the map
    // if (loadingFavoriteRestaurants) {
    //     return <Loading />
    // }

    return (
        <div className="add-favorites-container">
            {!loadingFavoriteRestaurants && favoriteRestaurants.length < 5 ? (
                <div className="message-container">
                    <p className="message">Add at least 5 favorite restaurants to continue!</p>
                    <button className="continue-button" onClick={handleContinue} disabled={!canContinue}>
                        Continue
                    </button>
                </div>
            ) : <h1>Add a favorite restaurant</h1>}
            <p>To add favorite restaurants, search for a restaurant using the search bar.</p>
            <div className="map-wrapper">
                <Map options={{ autoComplete: true, showFavorites: true }} />
            </div>
        </div>
    );
}