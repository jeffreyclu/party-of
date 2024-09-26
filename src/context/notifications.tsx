import { createContext, useEffect, useState } from 'react';
import { useUser } from '../hooks/use-user';
import { query, collection, where, onSnapshot, doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

import { InviteNotification } from '../types';

export interface InviteNotificationsContextType {
    loadingNotifications: boolean;
    notifications: InviteNotification[];
    markAsRead: (notificationIds: string[]) => Promise<void>;
}

export const InviteNotificationsContext = createContext<InviteNotificationsContextType | undefined>(undefined);

export const InviteNotificationsProvider = ({ children }: { children: React.ReactNode}) => {

    const [notifications, setNotifications] = useState<InviteNotification[]>([]);
    const [loadingNotifications, setLoadingNotifications] = useState(true);
    
    const { user } = useUser();

    useEffect(() => {
        if (!user) return;

        const userId = user.uid;

        const q = query(collection(db, 'notifications'), where('userId', '==', userId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newNotifications = snapshot.docs.map(doc => (
                doc.data() as InviteNotification
            ));
            setNotifications(newNotifications);
            setLoadingNotifications(false);
        }, (error) => {
            console.error('Error fetching notifications:', error);
            setLoadingNotifications(false);
        });

        return () => unsubscribe();
    }, [user]);

    const markAsRead = async (notificationIds: string[]) => {
        const batch = writeBatch(db);
        try {
            notificationIds.forEach(notificationId => {
                const notificationRef = doc(db, 'notifications', notificationId);
                batch.update(notificationRef, { read: true });
            });
            await batch.commit();
        } catch (error) {
            console.error('Error updating notifications:', error);
        }
    };
    return (
        <InviteNotificationsContext.Provider value={{ loadingNotifications, notifications, markAsRead }}>
            {children}
        </InviteNotificationsContext.Provider>
    );
};

