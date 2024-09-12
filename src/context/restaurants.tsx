import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Restaurant } from '../types';
import { deleteFavoriteRestaurant, getFavoriteRestaurants, saveFavoriteRestaurant } from '../firebase/restaurant-functions';
import { useUser } from '../hooks/use-user';

interface FavoriteRestaurantsContextType {
    favoriteRestaurants: Restaurant[];
    setFavoriteRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>;
    addFavoriteRestaurant: (restaurant: Restaurant) => Promise<void>;
    removeFavoriteRestaurant: (restaurantId: string) => Promise<void>;
}

export const FavoriteRestaurantsContext = createContext<FavoriteRestaurantsContextType | undefined>(undefined);

export const FavoriteRestaurantsProvider = ({ children }: { children: ReactNode }) => {
    const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
    const { user } = useUser();

    useEffect(() => {
        const fetchFavoriteRestaurants = async () => {
        if (user) {
            const restaurants = await getFavoriteRestaurants(user);
            setFavoriteRestaurants(restaurants || []);
        }
        };

        fetchFavoriteRestaurants();
    }, [user]);

    const addFavoriteRestaurant = async (restaurant: Restaurant) => {
        if (user) {
        await saveFavoriteRestaurant(user, restaurant);
        setFavoriteRestaurants((prevFavorites) => [...prevFavorites, restaurant]);
        }
    };

    const removeFavoriteRestaurant = async (restaurantId: string) => {
        if (user) {
            await deleteFavoriteRestaurant(user, restaurantId);
            setFavoriteRestaurants((prevFavorites) => prevFavorites.filter((restaurant) => restaurant.id !== restaurantId));
        }
    };

    return (
        <FavoriteRestaurantsContext.Provider value={{ favoriteRestaurants, setFavoriteRestaurants, addFavoriteRestaurant, removeFavoriteRestaurant }}>
        {children}
        </FavoriteRestaurantsContext.Provider>
    );
};