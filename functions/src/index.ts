import { firestore } from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

import { Invite, InviteNotification, InviteNotificationType } from '../../src/types';

admin.initializeApp();
const db = admin.firestore();

// Firestore trigger to listen for updates on invites
export const onInviteUpdate = firestore.onDocumentUpdated('invites/{inviteId}', async (event) => {
    const inviteId = event.params.inviteId;
    if (!event.data) {
        throw new Error(`Invite with ID ${inviteId} not found`);
    }

    const beforeData = event.data.before.data() as Invite;
    const afterData = event.data.after.data() as Invite;

    // Check if RSVP status has changed
    if (beforeData.status !== afterData.status) {
        await createInviteNotification(
            {
                inviteId,
                userId: afterData.senderId,
                type: InviteNotificationType.RSVP_CHANGED,
                inviteStatus: afterData.status,
                inviteDate: afterData.eventDate,
                inviteType: afterData.eventType,
                message: `RSVP status updated.`,
            }
        );
    }

    const suggestedRestaurantsChanged = JSON.stringify(beforeData.suggestedRestaurants) !== JSON.stringify(afterData.suggestedRestaurants);

    // Check for suggested restaurants change
    if (suggestedRestaurantsChanged) {
        const userIdToNotify = afterData.lastModifiedBy === afterData.senderId ? afterData.recipientId : afterData.senderId;
        await createInviteNotification({
            inviteId,
            userId: userIdToNotify,
            type: InviteNotificationType.RESTAURANT_SUGGESTION_UPDATE,
            inviteStatus: afterData.status,
            inviteDate: afterData.eventDate,
            inviteType: afterData.eventType,
            message: `Suggested restaurant updated.`,
        });
    }

    // Check for sender acceptance of suggested restaurant
    if (!suggestedRestaurantsChanged && beforeData.senderAccepted !== afterData.senderAccepted && afterData.senderAccepted === true) {
        await createInviteNotification({
            inviteId,
            userId: afterData.recipientId,
            type: InviteNotificationType.SUGGESTED_RESTAURANT_ACCEPTED_BY_SENDER,
            inviteStatus: afterData.status,
            inviteDate: afterData.eventDate,
            inviteType: afterData.eventType,
            message: `Restaurant suggestion accepted.`,
        });
    }

    // Check for recipient acceptance of suggested restaurant
    if (!suggestedRestaurantsChanged && beforeData.recipientAccepted !== afterData.recipientAccepted && afterData.recipientAccepted === true) {
        await createInviteNotification({
            inviteId,
            userId: afterData.senderId,
            type: InviteNotificationType.SUGGESTED_RESTAURANT_ACCEPTED_BY_RECIPIENT,
            inviteStatus: afterData.status,
            inviteDate: afterData.eventDate,
            inviteType: afterData.eventType,
            message: `Restaurant suggestion accepted.`,
        });
    }

});

// Function to create notifications
async function createInviteNotification(
    { inviteId, userId, inviteDate, inviteType, inviteStatus, type, message }: Omit<InviteNotification, 'id' | 'timestamp' | 'read'>
) {
    try {
        console.log(`Creating notification for inviteId: ${inviteId}, userId: ${userId}, with type: ${type}`);

        const notificationRef = db.collection('notifications').doc();

        const newNotification: InviteNotification = {
            id: notificationRef.id,
            inviteId,
            inviteDate,
            inviteType,
            inviteStatus,
            userId,
            type,
            message,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            read: false,
        };

        await notificationRef.set(newNotification);

        console.log('Notification successfully created');
    } catch (error) {
            console.error('Error creating notificationssss:', error);
    }
}
