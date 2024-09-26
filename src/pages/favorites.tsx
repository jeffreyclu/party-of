import FavoritesList from "../components/favorites-list"

import "./favorites.css";

export default function Favorites () {
    return (
        <div className="favorites-container">
            <h1>Your Favorite Restaurants</h1>
            <FavoritesList />
        </div>
    );
}