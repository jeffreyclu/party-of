import { doc, collection, getDocFromServer, getDocsFromServer, serverTimestamp, deleteDoc, setDoc, query, where } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './index';
import { Favorite, Restaurant } from '../types';

// Save a favorite restaurant to Firestore for a specific user
export const saveFavoriteRestaurant = async (user: User, restaurant: Omit<Restaurant, 'addedAt'>) => {
  try {
    // Check if the restaurant already exists in the 'restaurants' collection
    const restaurantsCollectionRef = collection(db, 'restaurants');
    const q = query(restaurantsCollectionRef, where('name', '==', restaurant.name));
    const querySnapshot = await getDocsFromServer(q);

    let restaurantDocRef;
    if (querySnapshot.empty) {
      // Add the restaurant details to the 'restaurants' collection if it doesn't exist
      restaurantDocRef = doc(restaurantsCollectionRef);
      await setDoc(restaurantDocRef, { ...restaurant, addedAt: serverTimestamp() });
      console.log('Restaurant details added to restaurants collection');
    } else {
      // Use the existing restaurant document reference
      restaurantDocRef = querySnapshot.docs[0].ref;
      const restaurantDoc = await getDocFromServer(restaurantDocRef);
      const restaurantData = restaurantDoc.data();
      const addedAt = restaurantData?.addedAt.toDate();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      if (addedAt < oneMonthAgo) {
        // Overwrite the existing restaurant document if addedAt is more than 1 month old
        await setDoc(restaurantDocRef, { ...restaurant, addedAt: serverTimestamp() });
        console.log('Restaurant details updated in restaurants collection');
      } else {
        console.log('Restaurant already exists and is less than 1 month old');
      }
    }
    // Add a reference to the restaurant document ID and the addedAt timestamp in the user's favorites
    const userDocRef = doc(db, 'users', user.uid);
    const favoritesCollection = collection(userDocRef, 'favorites');
    const newFavoriteDocRef = doc(favoritesCollection);

    const newFavorite: Favorite = {
      restaurantId: restaurantDocRef.id,
      addedAt: serverTimestamp(), // Use Firestore server timestamp
    }

    await setDoc(newFavoriteDocRef, newFavorite);
    console.log('Restaurant reference added to user favorites');
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
    const docSnap = await getDocFromServer(restaurantRef);
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
    const snapshot = await getDocsFromServer(favoritesCollection);

    const restaurants: Restaurant[] = [];
    for (const favoriteDoc of snapshot.docs) {
      const favoriteData = favoriteDoc.data();
      const restaurantId = favoriteData.restaurantId;
      const addedAt = favoriteData.addedAt?.toDate() || new Date();

      // Fetch restaurant details from the 'restaurants' collection
      const restaurantDocRef = doc(db, 'restaurants', restaurantId);
      const restaurantDoc = await getDocFromServer(restaurantDocRef);
      if (restaurantDoc.exists()) {
        const restaurantData = restaurantDoc.data() as Restaurant;
        restaurants.push({
          ...restaurantData,
          addedAt,
        });
      } else {
        console.warn(`Restaurant with ID ${restaurantId} not found`);
      }
    }

    return restaurants;
  } catch (error) {
    console.error('Error retrieving favorite restaurants:', error);
    return [];
  }
};

// Retrieve a restaurant from the 'restaurants' collection by ID
export const getRestaurantById = async (restaurantId?: string): Promise<Restaurant | null> => {
  if (!restaurantId) {
    console.error('Restaurant ID is required');
    return null;
  }
  try {
    const restaurantDocRef = doc(db, 'restaurants', restaurantId);
    const restaurantDoc = await getDocFromServer(restaurantDocRef);

    if (restaurantDoc.exists()) {
      return restaurantDoc.data() as Restaurant;
    } else {
      console.log('No such restaurant!');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving restaurant: ', error);
    return null;
  }
};
