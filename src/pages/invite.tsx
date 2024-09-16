import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Loading from '../components/loading';
import NotFound from '../pages/404';
import { useInvite } from '../hooks/use-invite';
import { useUser } from '../hooks/use-user';
import { InviteStatus, ToastType } from '../types';
import { respondToInvite } from '../firebase/invite-functions';
import useRestaurant from '../hooks/use-restaurant';
import { useToast } from '../hooks/use-toast';

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
            <div>
                <h1>Party of 2 for {invite.eventType} </h1>
                <h2>{new Date(invite.eventDate.toDate()).toLocaleDateString()} at {new Date(invite.eventDate.toDate()).toLocaleTimeString()}</h2>
                <h3>Event status: {invite.status}</h3>
                {invite.status === InviteStatus.Pending && <p>Refresh to check status.</p>}
            </div>
            
            {!isUserHost() && (
                <div className="rsvp-section">
                    {invite.status === InviteStatus.Pending && <h2>Dear {user.displayName}, please RSVP</h2>}
                    {changingRsvp || invite.status === InviteStatus.Pending ? (
                        <>
                            <button 
                                className="rsvp-button accept" 
                                onClick={() => handleRsvp(InviteStatus.Accepted)} 
                                disabled={loading || (changingRsvp && invite.status === InviteStatus.Accepted)}
                            >  
                                Accept
                            </button>
                            <button 
                                className="rsvp-button decline" 
                                onClick={() => handleRsvp(InviteStatus.Declined)} 
                                disabled={loading || (changingRsvp && invite.status === InviteStatus.Declined )}
                            >
                                Decline
                            </button>
                        </>
                    ) : (
                        <button className="rsvp-button change" onClick={() => setChangingRsvp(true)}>Change RSVP</button>
                    )}
                </div>
            )}
            {isUserHost() && invite.status === InviteStatus.Declined && (
                <div className="declined-section">
                    <h2>Sorry, the RSVP was declined.</h2>
                    <Link to="/event/create" className="create-event-link">Create another event?</Link>
                </div>
            )}
            {invite.status === InviteStatus.Accepted && suggestedRestaurantId && (
                <div className="suggested-restaurant-section">
                    <h2>Suggested Restaurant:</h2>
                    {restaurantLoading ? (
                        <p>Loading...</p>
                    ) : restaurantError ? (
                        <p>{restaurantError}</p>
                    ) : restaurant ? (
                        <div>
                            <h3>{restaurant.name}</h3>
                            <p>{restaurant.address}</p>
                            {/* Add more restaurant details as needed */}
                        </div>
                    ) : (
                        <p>No restaurant found</p>
                    )}
                </div>
            )}
        </div>
    );
}