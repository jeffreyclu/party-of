import { doc, setDoc, updateDoc, Timestamp, collection, getDocs, getDoc, query, where } from 'firebase/firestore';
import { db } from '.';  // Your Firebase setup
import { EventType, Invite, InviteStatus } from '../types';



export const createInvite = async (senderId: string, eventDate: Date, eventType: EventType) => {
    const inviteId = `${senderId}_${eventDate.getTime()}`;

    // Fetch the sender's favorite restaurants
    const senderFavoritesRef = collection(db, 'users', senderId, 'favorites');
    const senderFavoritesSnap = await getDocs(senderFavoritesRef);
    const senderFavorites = senderFavoritesSnap.docs.map(doc => doc.data().restaurantId);

    const invite: Omit<Invite, "recipientId" | "recipientFavorites" | "suggestedRestaurants"> = {
        id: inviteId,
        senderId,
        eventDate: Timestamp.fromDate(eventDate),
        eventType,
        status: InviteStatus.Pending,
        senderFavorites,
    };

    await setDoc(doc(db, 'invites', inviteId), invite);
    console.log('Invite created');
    return inviteId;
};

export const respondToInvite = async (inviteId: string, recipientId: string, status: InviteStatus) => {
    const inviteRef = doc(db, 'invites', inviteId);
    
    // Fetch the invite document to get the favorite restaurant ids
    const inviteDoc = await getDoc(inviteRef);
    if (!inviteDoc.exists()) {
        throw new Error('Invite not found');
    }
    const inviteData = inviteDoc.data() as Invite;
    const senderFavorites = inviteData.senderFavorites || [];

    const recipientFavoritesRef = collection(db, 'users', recipientId, 'favorites');
    const recipientFavoritesSnap = await getDocs(recipientFavoritesRef);
    const recipientFavorites = recipientFavoritesSnap.docs.map(doc => doc.data().restaurantId);

    // Update the invite with the recipientId and status and recipient favorites
    await updateDoc(inviteRef, {
        recipientId,
        status: status,
        recipientFavorites,
    });
    console.log(`Invite ${status}`);

    // If the status is accepted, suggest restaurants and update the invite
    if (status === InviteStatus.Accepted) {
        // Suggest restaurants based on both sender's and recipient's favorites
        const suggestedRestaurants = await suggestRestaurants(senderFavorites, recipientFavorites);
        await updateDoc(inviteRef, {
            suggestedRestaurants,
        });
        console.log('Suggested Restaurants and recipient favorites updated in invite');
    }
};

export const getInviteById = async (inviteId: string) => {
    const inviteRef = doc(db, 'invites', inviteId);
    const inviteDoc = await getDoc(inviteRef);
    if (inviteDoc.exists()) {
        return inviteDoc.data() as Invite;
    } else {
        throw new Error('Invite not found');
    }
};

export const getInvitesByHost = async (userId: string) => {
    const invitesRef = collection(db, 'invites');
    const q = query(invitesRef, where('senderId', '==', userId));
    const querySnapshot = await getDocs(q);
    const invites: Invite[] = [];
    querySnapshot.forEach((doc) => {
        invites.push(doc.data() as Invite);
    });
    return invites;
};

export const getInvitesByRecipient = async (userId: string) => {
    const invitesRef = collection(db, 'invites');
    const q = query(invitesRef, where('recipientId', '==', userId));
    const querySnapshot = await getDocs(q);
    const invites: Invite[] = [];
    querySnapshot.forEach((doc) => {
        invites.push(doc.data() as Invite);
    });
    return invites;
};


// Suggest restaurant after invite acceptance
export async function suggestRestaurants(senderFavorites: string[], recipientFavorites: string[]) {
    try {
        // Combine the favorite lists
        const combinedFavorites = [...new Set([...senderFavorites, ...recipientFavorites])];

        // Shuffle the combined list randomly
        const shuffledFavorites = combinedFavorites.sort(() => Math.random() - 0.5);

        console.log('Suggested Restaurant IDs:', shuffledFavorites);
        return shuffledFavorites;
    } catch (error) {
        console.error('Error suggesting restaurants:', error);
        return [];
    }
}