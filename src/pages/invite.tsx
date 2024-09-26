import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Loading from '../components/loading';
import NotFound from '../pages/404';
import { useInvite } from '../hooks/use-invite';
import { useUser } from '../hooks/use-user';
import { InviteStatus, ToastType } from '../types';
import { respondToInvite } from '../firebase/invite-functions';
import { useToast } from '../hooks/use-toast';
import EventDetails from '../components/invite/event-details';
import RsvpSection from '../components/invite/rsvp-section';
import DeclinedSection from '../components/invite/declined-section';
import RestaurantSuggestion from '../components/invite/restaurant-suggestion';
import { useUserProfile } from '../hooks/use-user-profile';
import DietaryRestrictionsSection from '../components/invite/dietary-restrictions';

import './invite.css';

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
            setLoading(false);
        } catch (error) {
            showToast((error as Error).message, ToastType.Error);
        }
    };
    
    const showRsvpSection = !isUserHost()
    const showDeclinedSection = isUserHost() && invite.status === InviteStatus.Declined;
    const isAccepted = invite.status === InviteStatus.Accepted;
    const showDietaryRestrictions = isAccepted && (invite.senderDietaryRestrictions.length > 0 || invite.recipientDietaryRestrictions.length > 0);

    return (
        <div className="invite-container">
            <EventDetails invite={invite} isHost={!showRsvpSection} />
            {showRsvpSection && (
                <RsvpSection 
                    invite={invite}
                    user={userProfileData} 
                    changingRsvp={changingRsvp} 
                    handleRsvp={handleRsvp} 
                    loading={loading} 
                    setChangingRsvp={setChangingRsvp} 
                />
            )}
            {showDeclinedSection && (
                <DeclinedSection />
            )}
            {invite.status === InviteStatus.Accepted && (
                <RestaurantSuggestion
                    suggestedRestaurants={suggestedRestaurants}
                    user={user}
                />
            )}             
            {showDietaryRestrictions && (
                <DietaryRestrictionsSection
                    senderDietaryRestrictions={invite.senderDietaryRestrictions}
                    recipientDietaryRestrictions={invite.recipientDietaryRestrictions}
                    isHost={isUserHost()}
                />
            )}
        </div>
    );
}