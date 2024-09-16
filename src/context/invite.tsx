import { createContext, useState, ReactNode } from 'react';

import { getInviteById, getInvitesByHost, getInvitesByRecipient } from '../firebase/invite-functions';
import { Invite, ToastType } from '../types';
import { useToast } from '../hooks/use-toast';

interface InviteContextType {
    invite: Invite | null;
    loadingInvite: boolean;
    loadingHostInvites: boolean;
    loadingRecipientInvites: boolean;
    fetchInviteById: (inviteId: string) => Promise<void>;
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

    const fetchInviteById = async (inviteId: string) => {
        setLoadingInvite(true);
        if (!inviteId) {
            showToast('No invite ID provided', ToastType.Error);
            setInvite(null);
            setLoadingInvite(false);
            return;
        }

        try {
            const inviteData = await getInviteById(inviteId);
            setInvite(inviteData as Invite);
        } catch (error) {
            showToast((error as Error).message, ToastType.Error);
            setInvite(null);
        } finally {
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

    return (
        <InviteContext.Provider value={{
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
