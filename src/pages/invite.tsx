import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Loading from '../components/loading';
import NotFound from '../pages/404';
import { useInvite } from '../hooks/use-invite';
import { useUser } from '../hooks/use-user';
import { InviteStatus, ToastType } from '../types';
import { respondToInvite } from '../firebase/invite-functions';
import { useToast } from '../hooks/use-toast';

import './invite.css';
import EventDetails from '../components/invite/event-details';
import RsvpSection from '../components/invite/rsvp-section';
import DeclinedSection from '../components/invite/declined-section';
import SuggestedRestaurantSection from '../components/invite/restaurant-suggestion';
import { useUserProfile } from '../hooks/use-user-profile';
import DietaryRestrictionsSection from '../components/invite/dietary-restrictions';

export default function Invite() {
    const { invite, loadingInvite, fetchInviteById } = useInvite();
    const { inviteId } = useParams<{ inviteId: string }>();
    const { user, loadingUser } = useUser();
    const { userProfileData, loadingUserProfileData } = useUserProfile();
    const { showToast } = useToast();

    const [hasFetchedInvite, setHasFetchedInvite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [changingRsvp, setChangingRsvp] = useState(false);
    const [suggestedRestaurants, setSuggestedRestaurants] = useState<string[]>([]);


    useEffect(() => {
        if (invite && invite.suggestedRestaurants && invite.suggestedRestaurants.length > 0) {
            setSuggestedRestaurants(invite.suggestedRestaurants);
        }
    }, [invite]);

    useEffect(() => {
        const fetchInvite = async () => {
            if (inviteId && !hasFetchedInvite) {
                await fetchInviteById(inviteId);
                setHasFetchedInvite(true);
            }
        }
        
        fetchInvite();
    }, [inviteId, fetchInviteById, hasFetchedInvite]);

    if (loadingInvite || !user || loadingUser || !userProfileData || loadingUserProfileData) {
        return <Loading />;
    }

    if (!invite) {
        return <NotFound />;
    }

    const isUserHost = () => {
        return user.uid === invite.senderId;
    }

    const handleRsvp = async (status: InviteStatus, includeDietaryRestrictions: boolean) => {
        setLoading(true);
        try {
            const dietaryRestrictions = includeDietaryRestrictions ? userProfileData.dietaryRestrictions : [];
            await respondToInvite(invite.id, user.uid, status, dietaryRestrictions);
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
            {invite.status === InviteStatus.Accepted && (
                <SuggestedRestaurantSection
                    suggestedRestaurants={suggestedRestaurants}
                />
            )}             
            {invite.status === InviteStatus.Accepted && (invite.senderDietaryRestrictions.length > 0 || invite.recipientDietaryRestrictions.length > 0) && (<DietaryRestrictionsSection
                senderDietaryRestrictions={invite.senderDietaryRestrictions}
                recipientDietaryRestrictions={invite.recipientDietaryRestrictions}
                isHost={isUserHost()}
            />)}

        </div>
    );
}