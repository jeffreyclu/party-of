import React from 'react';
import { useFavoriteRestaurants } from '../hooks/use-favorite-restaurants';
import './favorites.css'; // Import the CSS file

const FavoriteRestaurants: React.FC = () => {
  const { favoriteRestaurants } = useFavoriteRestaurants();

  // TODO: clicking on a restaurant show open a map and display it
  return (
    <div className="favorites-container">
      <h1>Your Favorite Restaurants</h1>
      <div className="favorites-scroll-container">
        {favoriteRestaurants.map((restaurant, index) => (
          <div key={index} className="favorite-card">
            <h3>{restaurant.name}</h3>
            <p>{restaurant.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteRestaurants;