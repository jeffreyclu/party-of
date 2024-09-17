import { useState } from 'react';
import { useFavoriteRestaurants } from '../hooks/use-favorite-restaurants';
import './favorites.css';
import { Restaurant } from '../types';
import RestaurantCard from '../components/restaurant-card';
import Loading from '../components/loading';

const FavoriteRestaurants: React.FC = () => {
  const { favoriteRestaurants, loadingFavoriteRestaurants } = useFavoriteRestaurants();
  
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  console.log(selectedRestaurant)

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  if (loadingFavoriteRestaurants) {
    return <Loading />;
  }

  // TODO: clicking on a restaurant show open a map and display it
  return (
    <div className="favorites-container">
      <h1>Your Favorite Restaurants</h1>
      <div className="favorites-scroll-container">
        {favoriteRestaurants.map((restaurant, index) => (
          <RestaurantCard
            key={index}
            restaurant={restaurant}
            onClick={handleRestaurantClick}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoriteRestaurants;