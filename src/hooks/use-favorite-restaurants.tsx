import { useContext } from "react";
import { FavoriteRestaurantsContext } from "../context/restaurants";

export const useFavoriteRestaurants = () => {
    const context = useContext(FavoriteRestaurantsContext);
    if (context === undefined) {
      throw new Error('useFavoriteRestaurants must be used within a FavoriteRestaurantsProvider');
    }
    return context;
  };