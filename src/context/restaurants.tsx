import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Restaurant } from '../types';
import { deleteFavoriteRestaurant, getFavoriteRestaurants, saveFavoriteRestaurant } from '../firebase/restaurant-functions';
import { useUser } from '../hooks/use-user';

interface FavoriteRestaurantsContextType {
    favoriteRestaurants: Restaurant[];
    setFavoriteRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>;
    addFavoriteRestaurant: (restaurant: Restaurant) => Promise<void>;
    removeFavoriteRestaurant: (restaurantId: string) => Promise<void>;
    loadingFavoriteRestaurants: boolean;
}

export const FavoriteRestaurantsContext = createContext<FavoriteRestaurantsContextType | undefined>(undefined);

export const FavoriteRestaurantsProvider = ({ children }: { children: ReactNode }) => {
    const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
    const [loadingFavoriteRestaurants, setLoadingFavoriteRestaurants] = useState<boolean>(true);
    const { user, loadingUser } = useUser();

    useEffect(() => {
        const fetchFavoriteRestaurants = async () => {
            try {
                if (user) {
                    const restaurants = await getFavoriteRestaurants(user);
                    console.log('Retrieved favorite restaurants:', restaurants);
                    setFavoriteRestaurants(restaurants || []);
                }
            } catch (error) {
                console.error('Error fetching favorite restaurants: ', error);
            } finally {
                setLoadingFavoriteRestaurants(false);
            }
        };

        if (!loadingUser) {
            fetchFavoriteRestaurants();
        }
    }, [user, loadingUser]);

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
        <FavoriteRestaurantsContext.Provider value={{ favoriteRestaurants, setFavoriteRestaurants, addFavoriteRestaurant, removeFavoriteRestaurant, loadingFavoriteRestaurants }}>
            {children}
        </FavoriteRestaurantsContext.Provider>
    );
};