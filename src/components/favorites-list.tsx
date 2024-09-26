import { useState } from 'react';

import { useFavoriteRestaurants } from '../hooks/use-favorite-restaurants';
import { Restaurant } from '../types';
import RestaurantCard from './restaurant-card';
import Loading from './loading';

import './favorites-list.css';

interface FavoritesListProps {
  singleRow?: boolean;
  onClick?: (restaurant: Restaurant) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ singleRow = false, onClick }) => {
  const { favoriteRestaurants, loadingFavoriteRestaurants } = useFavoriteRestaurants();
  
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    if (onClick) {
      onClick(restaurant);
    }
  };

  if (loadingFavoriteRestaurants) {
    return <Loading />;
  }

  // TODO: clicking on a restaurant show open a map and display it
  return (
    <div className={`favorites-scroll-container ${singleRow ? 'single-row': ''}`}>
      {favoriteRestaurants.map((restaurant, index) => (
        <RestaurantCard
          key={index}
          restaurant={restaurant}
          onClick={handleRestaurantClick}
          isSelected={selectedRestaurant?.id === restaurant.id}
        />
      ))}
    </div>
  );
};

export default FavoritesList;
