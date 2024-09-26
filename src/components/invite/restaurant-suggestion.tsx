import { useEffect, useState } from "react";
import { User } from "firebase/auth";

import useRestaurants from "../../hooks/use-restaurant";
import { useToast } from "../../hooks/use-toast";
import { Restaurant, ToastType } from "../../types";
import Loading from "../loading";
import RestaurantCard from "../restaurant-card";
import { useInvite } from "../../hooks/use-invite";

import './restaurant-suggestion.css';

interface RestaurantSuggestionProps {
    suggestedRestaurants: string[];
    user: User
}

const RestaurantSuggestion: React.FC<RestaurantSuggestionProps> = ({ suggestedRestaurants, user }) => {
    const { restaurants, loading, error } = useRestaurants(suggestedRestaurants);
    const { showToast } = useToast();
    const { invite, loadingInvite, updateInvite } = useInvite();
    
    const [suggestedRestaurant, setSuggestedRestaurant] = useState<Restaurant | null>(null);
    const [showMore, setShowMore] = useState<boolean>(false);
    const [pendingSuggestedRestaurant, setPendingSuggestedRestaurant] = useState<Restaurant | null>(null);
    const [updatedRestaurants, setUpdatedRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        if (error) {
            showToast(error, ToastType.Error);
        }
    }, [error, showToast]);

    useEffect(() => {
        if (!loading && restaurants.length > 0) {
            setSuggestedRestaurant(restaurants[0]);
            setUpdatedRestaurants(restaurants);
        }
    }, [restaurants, loading]);

    if (loading || loadingInvite || !invite) {
        return <Loading />;
    }

    const isUserSender = () => user.uid === invite.senderId;
    const isUserRecipient = () => user.uid === invite.recipientId;

    const handleShowMoreClick = () => {
        setShowMore(!showMore);
    };

    const handleRestaurantClick = (clickedRestaurant: Restaurant) => {
        if (!suggestedRestaurant) return;

        const newSuggestedRestaurant = clickedRestaurant;

        // Find the index of the suggestedRestaurant and clickedRestaurant
        const suggestedIndex = updatedRestaurants.findIndex(restaurant => restaurant.id === suggestedRestaurant.id);
        const clickedIndex = updatedRestaurants.findIndex(restaurant => restaurant.id === newSuggestedRestaurant.id);

        // Create a copy of the restaurants array
        const newUpdatedRestaurants = [...updatedRestaurants];

        // Swap the suggestedRestaurant with the clickedRestaurant
        [newUpdatedRestaurants[suggestedIndex], newUpdatedRestaurants[clickedIndex]] = [newUpdatedRestaurants[clickedIndex], newUpdatedRestaurants[suggestedIndex]];

        // Update the state to reflect the swap
        setSuggestedRestaurant(newSuggestedRestaurant);
        setUpdatedRestaurants(newUpdatedRestaurants);
        setPendingSuggestedRestaurant(newSuggestedRestaurant);
    };

    const handleSaveClick = () => {
        if (!pendingSuggestedRestaurant) {
            return;
        }

        // Extract the IDs from the updated restaurants array
        const updatedRestaurantIds = updatedRestaurants.map(restaurant => restaurant.id);

        // Determine the acceptance state based on the current user
        const updateData = {
            suggestedRestaurants: updatedRestaurantIds,
            senderAccepted: isUserSender() ? true : false,
            recipientAccepted: isUserRecipient() ? true : false,
        };

        // Call updateInvite with the updated array of restaurant IDs
        updateInvite(invite?.id, updateData, user.uid);

        // Clear the pending state
        setPendingSuggestedRestaurant(null);

        setShowMore(false);
    };

    const handleCancelClick = () => {
        // Revert the changes by resetting the updatedRestaurants to the original restaurants
        setUpdatedRestaurants(restaurants);
        setSuggestedRestaurant(restaurants[0]);
        setPendingSuggestedRestaurant(null);
    };

    const handleAcceptSuggestionClick = async () => {
        if (isUserRecipient()) {
            await updateInvite(invite.id, { recipientAccepted: true }, user.uid);
        } else if (isUserSender()) {
            await updateInvite(invite.id, { senderAccepted: true }, user.uid);
        }
        setPendingSuggestedRestaurant(null);
        setShowMore(false);
    };

    const shouldShowAcceptButton = () => {
        if (isUserRecipient() && !invite.recipientAccepted) {
            return true;
        }
        if (isUserSender() && !invite.senderAccepted) {
            return true;
        }
        return false;
    };

    // TODO: suggested restaurants should update when either user adds more favorites

    return (
        <>
            <div className="suggested-restaurant-section">
                <h2>Suggested Restaurant:</h2>
                {suggestedRestaurant && (
                    <RestaurantCard
                        restaurant={suggestedRestaurant}
                        isSelected={!pendingSuggestedRestaurant && invite.recipientAccepted && invite.senderAccepted}
                    />
                )}
                {(pendingSuggestedRestaurant || shouldShowAcceptButton()) && (
                    <div className="pending-actions">
                        {shouldShowAcceptButton() && (
                            <button
                                style={{ backgroundColor: 'green', color: 'white' }}
                                onClick={handleAcceptSuggestionClick}
                            >
                                Accept Suggestion
                            </button>
                        )}
                        {pendingSuggestedRestaurant && (
                            <div>
                                <button onClick={handleSaveClick}>Save suggestion</button>
                                <button onClick={handleCancelClick}>Cancel</button>
                            </div>
                        )}
                        
                    </div>
                )}
            </div>
            {showMore && <div className="more-restaurants-container">
                {updatedRestaurants.slice(1).map((restaurant, index) => (
                    <RestaurantCard
                        key={index}
                        restaurant={restaurant}
                        onClick={() => handleRestaurantClick(restaurant)}
                        isSelected={false} // we don't show the selected restaurant in the list
                    />
                ))}
            </div>}
            {restaurants.length > 1 && (
                <div className="show-more-restaurants-container">
                    <span style={{ color: 'blue', cursor: 'pointer' }} onClick={handleShowMoreClick}>
                        {showMore ? 'Hide' : 'Suggest another restaurant'}
                    </span>
                </div>
            )}
        </>
    );
}

export default RestaurantSuggestion;
