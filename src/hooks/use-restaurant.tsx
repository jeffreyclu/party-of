import { useState, useEffect } from 'react';
import { Restaurant } from '../types';
import { getRestaurantById } from '../firebase/restaurant-functions';

const useRestaurant = (restaurantId: string | undefined) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!restaurantId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const restaurantData = await getRestaurantById(restaurantId);
        if (restaurantData) {
          setRestaurant(restaurantData);
        } else {
          setError('Restaurant not found');
        }
      } catch (err) {
        setError('Error retrieving restaurant');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  return { restaurant, loading, error };
};

export default useRestaurant;