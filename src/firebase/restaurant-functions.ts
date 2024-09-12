import { doc, collection, addDoc, getDoc, getDocs, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './index';
import { Restaurant } from '../types';

// Save a favorite restaurant to Firestore for a specific user
export const saveFavoriteRestaurant = async (user: User, restaurant: Omit<Restaurant, 'addedAt'>) => {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const favoritesCollection = collection(userDocRef, 'favorites');

    // Add the restaurant to the favorites subcollection
    await addDoc(favoritesCollection, {
      ...restaurant,
      addedAt: serverTimestamp(), // Use Firestore server timestamp
    });
    console.log('Restaurant added to favorites');
  } catch (error) {
    console.error('Error adding restaurant to favorites:', error);
  }
};

// Delete a favorite restaurant from Firestore for a specific user
export const deleteFavoriteRestaurant = async (user: User, restaurantId: string) => {
  try {
    const restaurantRef = doc(db, 'users', user.uid, 'favorites', restaurantId);
    await deleteDoc(restaurantRef);
    console.log(`Restaurant with ID ${restaurantId} removed from favorites`);

    // Verify deletion
    const docSnap = await getDoc(restaurantRef);
    if (!docSnap.exists()) {
      console.log(`Restaurant with ID ${restaurantId} successfully deleted`);
    } else {
      console.error(`Failed to delete restaurant with ID ${restaurantId}`);
    }
  } catch (error) {
    console.error('Error removing favorite restaurant: ', error);
  }
};

// Retrieve favorite restaurants for a user
export const getFavoriteRestaurants = async (user: User) => {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const favoritesCollection = collection(userDocRef, 'favorites');
    const snapshot = await getDocs(favoritesCollection);

    const restaurants: Restaurant[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Convert Firestore timestamp to Date
      const addedAt = data.addedAt?.toDate() || new Date();
      restaurants.push({
        ...data,
        addedAt,
      } as Restaurant);
    });

    return restaurants;
  } catch (error) {
    console.error('Error retrieving favorite restaurants:', error);
  }
};