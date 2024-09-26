import { doc, collection, getDocFromServer, getDocsFromServer, serverTimestamp, deleteDoc, setDoc, query, where } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './index';
import { Favorite, Restaurant } from '../types';

// Save a favorite restaurant to Firestore for a specific user
export const saveFavoriteRestaurant = async (user: User, restaurant: Omit<Restaurant, 'addedAt'>) => {
  try {
    // Create a document reference using the restaurant's id
    const restaurantDocRef = doc(db, 'restaurants', restaurant.id);
    const restaurantDoc = await getDocFromServer(restaurantDocRef);

    if (!restaurantDoc.exists()) {
      // Add the restaurant details to the 'restaurants' collection if it doesn't exist
      await setDoc(restaurantDocRef, { ...restaurant, addedAt: serverTimestamp() });
      console.log('Restaurant details added to restaurants collection');
    } else {
      // Check the addedAt timestamp
      const restaurantData = restaurantDoc.data();
      const addedAt = restaurantData?.addedAt.toDate();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      if (addedAt < oneMonthAgo) {
        // Overwrite the existing restaurant document if addedAt is more than 1 month old
        await setDoc(restaurantDocRef, { ...restaurant, addedAt: serverTimestamp() });
        console.log('Restaurant details updated in restaurants collection');
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
    const favoritesRef = collection(db, 'users', user.uid, 'favorites');
    const q = query(favoritesRef, where('restaurantId', '==', restaurantId));
    console.log(`Attempting to find favorite with restaurant ID ${restaurantId} for user ${user.uid}`);
    
    const querySnapshot = await getDocsFromServer(q);
    if (querySnapshot.empty) {
      console.error(`No favorite found with restaurant ID ${restaurantId} for user ${user.uid}`);
      return;
    }

    // Assuming there is only one favorite with the given restaurantId
    const favoriteDoc = querySnapshot.docs[0];
    const favoriteId = favoriteDoc.id;
    console.log(`Found favorite with ID ${favoriteId} for restaurant ID ${restaurantId}`);

    const favoriteRef = doc(db, 'users', user.uid, 'favorites', favoriteId);
    await deleteDoc(favoriteRef);
    console.log(`Favorite with ID ${favoriteId} removed from favorites`);

    // Verify deletion
    const docSnapAfter = await getDocFromServer(favoriteRef);
    if (!docSnapAfter.exists()) {
      console.log(`Favorite with ID ${favoriteId} successfully deleted`);
    } else {
      console.error(`Failed to delete favorite with ID ${favoriteId}`);
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

export const getRestaurantsById = async (restaurantIds: string[]): Promise<Restaurant[]> => {
  try {
    const restaurantPromises = restaurantIds.map(async (restaurantId) => {
      const restaurantDocRef = doc(db, 'restaurants', restaurantId);
      const restaurantDoc = await getDocFromServer(restaurantDocRef);

      if (restaurantDoc.exists()) {
        return restaurantDoc.data() as Restaurant;
      } else {
        throw new Error(`No such restaurant with ID: ${restaurantId}`);
      }
    });

    const restaurants = await Promise.all(restaurantPromises);
    const validRestaurants = restaurants.filter(restaurant => restaurant !== null) as Restaurant[];
    return validRestaurants;
  } catch (error) {
    console.error('Error retrieving restaurants: ', error);
    throw new Error('Error retrieving restaurants');
  }
};
