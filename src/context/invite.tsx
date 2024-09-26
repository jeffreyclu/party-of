import { createContext, useState, ReactNode } from 'react';

import { createInvite as createInviteInDB, getInvitesByHost, getInvitesByRecipient, updateInvite as updateInviteInDB } from '../firebase/invite-functions';
import { DietaryOptions, EventType, Invite, Restaurant, ToastType } from '../types';
import { useToast } from '../hooks/use-toast';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Unsubscribe } from 'firebase/auth';

interface InviteContextType {
    createInvite: (
        senderId: string, 
        eventDate: Date, 
        eventType: EventType, 
        dietaryRestrictions: DietaryOptions[], 
        initialSuggestion?: Restaurant
    ) => Promise<string | undefined>;
    updateInvite: (inviteId: string, updates: Partial<Invite>, userId: string) => Promise<void>;
    invite: Invite | null;
    loadingInvite: boolean;
    loadingHostInvites: boolean;
    loadingRecipientInvites: boolean;
    fetchInviteById: (inviteId: string) => Unsubscribe | undefined;
    hostInvites: Invite[];
    recipientInvites: Invite[];
    fetchHostInvites: (userId: string) => Promise<void>;
    fetchRecipientInvites: (userId: string) => Promise<void>;
}

export const InviteContext = createContext<InviteContextType | undefined>(undefined);

export const InviteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [invite, setInvite] = useState<Invite | null>(null);
    const [loadingInvite, setLoadingInvite] = useState<boolean>(false);
    const [hostInvites, setHostInvites] = useState<Invite[]>([]);
    const [recipientInvites, setRecipientInvites] = useState<Invite[]>([]);
    const [loadingHostInvites, setLoadingHostInvites] = useState<boolean>(false);
    const [loadingRecipientInvites, setLoadingRecipientInvites] = useState<boolean>(false);

    const { showToast } = useToast();

    const fetchInviteById = (inviteId: string) => {
        setLoadingInvite(true);
        if (!inviteId) {
            showToast('No invite ID provided', ToastType.Error);
            setInvite(null);
            setLoadingInvite(false);
            return;
        }

        try {
            const inviteDocRef = doc(db, 'invites', inviteId);
            const unsubscribe = onSnapshot(inviteDocRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    setInvite(docSnapshot.data() as Invite);
                } else {
                    showToast('Invite not found', ToastType.Error);
                    setInvite(null);
                }
                setLoadingInvite(false);
            }, (error) => {
                showToast(error.message, ToastType.Error);
                setInvite(null);
                setLoadingInvite(false);
            });

            return unsubscribe;
        } catch (error) {
            showToast((error as Error).message, ToastType.Error);
            setInvite(null);
            setLoadingInvite(false);
        }
    };

    const fetchHostInvites = async (userId: string) => {
        setLoadingHostInvites(true);
        try {
            const invites = await getInvitesByHost(userId);
            setHostInvites(invites);
        } catch (error) {
            showToast((error as Error).message, ToastType.Error);
            setHostInvites([]);
        } finally {
            setLoadingHostInvites(false);
        }
    };

    const fetchRecipientInvites = async (userId: string) => {
        setLoadingRecipientInvites(true);
        try {
            const invites = await getInvitesByRecipient(userId);
            setRecipientInvites(invites);
        } catch (error) {
            showToast((error as Error).message, ToastType.Error);
            setRecipientInvites([]);
        } finally {
            setLoadingRecipientInvites(false);
        }
    };

    const createInvite = async (
        senderId: string, 
        eventDate: Date, 
        eventType: EventType, 
        senderDietaryRestrictions: DietaryOptions[],
        initialSuggestion?: Restaurant
    ) => {
        try {
            const inviteId = await createInviteInDB(
                senderId, 
                eventDate, 
                eventType, 
                senderDietaryRestrictions, 
                initialSuggestion
            );
            showToast('Invite added successfully', ToastType.Success);
            return inviteId;
        } catch (error) {
            showToast((error as Error).message, ToastType.Error);
        }
    };

    const updateInvite = async (inviteId: string, updates: Partial<Invite>, userId: string) => {
        try {
            await updateInviteInDB(inviteId, updates, userId);
            showToast('Invite updated successfully', ToastType.Success);
        } catch (error) {
            showToast((error as Error).message, ToastType.Error);
        }
    };


    return (
        <InviteContext.Provider value={{
            createInvite,
            updateInvite,
            invite,
            loadingInvite,
            loadingHostInvites,
            loadingRecipientInvites,
            fetchInviteById,
            hostInvites,
            recipientInvites,
            fetchHostInvites,
            fetchRecipientInvites
        }}>
            {children}
        </InviteContext.Provider>
    );
};
