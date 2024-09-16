import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Loading from '../components/loading';
import NotFound from '../pages/404';
import { useInvite } from '../hooks/use-invite';
import { useUser } from '../hooks/use-user';
import { InviteStatus, ToastType } from '../types';
import { respondToInvite } from '../firebase/invite-functions';
import useRestaurant from '../hooks/use-restaurant';
import { useToast } from '../hooks/use-toast';

import EventDetails from './EventDetails';
import RsvpSection from './RsvpSection';
import DeclinedSection from './DeclinedSection';
import SuggestedRestaurantSection from './SuggestedRestaurantSection';

import './invite.css';

export default function Invite() {
    const { invite, loadingInvite, fetchInviteById } = useInvite();
    const { inviteId } = useParams<{ inviteId: string }>();
    const { user } = useUser();
    const { showToast } = useToast();

    const [hasFetchedInvite, setHasFetchedInvite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [changingRsvp, setChangingRsvp] = useState(false);
    const [suggestedRestaurantId, setSuggestedRestaurantId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (invite && invite.suggestedRestaurants && invite.suggestedRestaurants.length > 0) {
            setSuggestedRestaurantId(invite.suggestedRestaurants[0]);
        }
    }, [invite]);

    const { restaurant, loading: restaurantLoading, error: restaurantError } = useRestaurant(suggestedRestaurantId);

    useEffect(() => {
        const fetchInvite = async () => {
            if (inviteId && !hasFetchedInvite) {
                await fetchInviteById(inviteId);
                setHasFetchedInvite(true);
            }
        }
        
        fetchInvite();
    }, [inviteId, fetchInviteById, hasFetchedInvite]);

    if (loadingInvite || !user || restaurantLoading) {
        return <Loading />;
    }

    if (!invite) {
        return <NotFound />;
    }

    const isUserHost = () => {
        return user.uid === invite.senderId;
    }

    const handleRsvp = async (status: InviteStatus) => {
        setLoading(true);
        try {
            await respondToInvite(invite.id, user.uid, status);
            showToast('RSVP updated successfully!', ToastType.Success);
            setTimeout(() => {
                window.location.reload();
                setLoading(false);
            }, 1000); // Reload the page after 1 second
        } catch (error) {
            showToast((error as Error).message, ToastType.Error);
        }
    };

    return (
        <div className="invite-container">
            <EventDetails invite={invite} />
            {!isUserHost() && (
                <RsvpSection 
                    invite={invite} 
                    user={user} 
                    changingRsvp={changingRsvp} 
                    handleRsvp={handleRsvp} 
                    loading={loading} 
                    setChangingRsvp={setChangingRsvp} 
                />
            )}
            {isUserHost() && invite.status === InviteStatus.Declined && (
                <DeclinedSection />
            )}
            {invite.status === InviteStatus.Accepted && suggestedRestaurantId && (
                <SuggestedRestaurantSection 
                    restaurant={restaurant} 
                    restaurantLoading={restaurantLoading} 
                    restaurantError={restaurantError} 
                />
            )}
        </div>
    );
}