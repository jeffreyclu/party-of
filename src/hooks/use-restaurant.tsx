import { useState, useEffect } from 'react';
import { Restaurant } from '../types';
import { getRestaurantsById } from '../firebase/restaurant-functions';

const useRestaurants = (restaurantIds: string[]) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (restaurantIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedRestaurants = await getRestaurantsById(restaurantIds);
        setRestaurants(fetchedRestaurants);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [restaurantIds]);

  return { restaurants, loading, error };
};

export default useRestaurants;
