import React from 'react';
import { useFavoriteRestaurants } from '../hooks/use-favorite-restaurants';

const FavoriteRestaurants: React.FC = () => {
  const { favoriteRestaurants } = useFavoriteRestaurants();

  return (
    <div>
      <h2>Your Favorite Restaurants</h2>
      <ul>
        {favoriteRestaurants.map((restaurant, index) => (
          <li key={index}>
            {restaurant.name} - {restaurant.address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteRestaurants;