import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';

export const getInviteNotifications = functions.https.onRequest(async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    res.status(400).send('User ID is required');
    return;
  }

  try {
    const notificationsSnapshot = await firestore().collection('notifications').where('userId', '==', userId).get();
    
    const notifications = notificationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Error fetching notifications');
  }
});

export const markNotificationAsRead = functions.https.onRequest(async (req, res) => {
  const notificationId = req.query.notificationId as string;

  if (!notificationId) {
    res.status(400).send('Notification ID is required');
    return;
  }

  try {
    const notificationRef = firestore().collection('notifications').doc(notificationId);
    await notificationRef.update({ status: 'read' });

    res.status(200).send('Notification marked as read');
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).send('Error updating notification');
  }
});