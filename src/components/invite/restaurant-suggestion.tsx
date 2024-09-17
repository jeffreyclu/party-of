import { useEffect, useState } from "react";
import useRestaurants from "../../hooks/use-restaurant";
import { useToast } from "../../hooks/use-toast";
import { Restaurant, ToastType } from "../../types";
import Loading from "../loading";
import RestaurantCard from "../restaurant-card";
import { useInvite } from "../../hooks/use-invite";

interface SuggestedRestaurantSectionProps {
    suggestedRestaurants: string[];
}

const SuggestedRestaurantSection: React.FC<SuggestedRestaurantSectionProps> = ({ suggestedRestaurants }) => {
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

        // Call updateInvite with the updated array of restaurant IDs
        updateInvite(invite?.id, { suggestedRestaurants: updatedRestaurantIds });

        // Clear the pending state
        setPendingSuggestedRestaurant(null);
    };

    const handleCancelClick = () => {
        // Revert the changes by resetting the updatedRestaurants to the original restaurants
        setUpdatedRestaurants(restaurants);
        setSuggestedRestaurant(restaurants[0]);
        setPendingSuggestedRestaurant(null);
    };

    return (
        <div className="suggested-restaurant-section">
            <h2>Suggested Restaurant:</h2>
            {suggestedRestaurant && (
                <RestaurantCard
                    restaurant={suggestedRestaurant}
                />
            )}
            <div className="more-restaurants-container">
                {
                    showMore && (
                        <>
                            <h3>Other suggestions:</h3>
                            {updatedRestaurants.slice(1).map((restaurant, index) => (
                                <RestaurantCard
                                    key={index}
                                    restaurant={restaurant}
                                    onClick={() => handleRestaurantClick(restaurant)}
                                />
                            ))}
                        </>
                    )
                }
            </div>
            {restaurants.length > 1 && (
                <span style={{ color: 'blue', cursor: 'pointer' }} onClick={handleShowMoreClick}>
                    {showMore ? 'Show Less' : 'Show More'}
                </span>
            )}
            {pendingSuggestedRestaurant && (
                <div className="pending-actions">
                    <button onClick={handleSaveClick}>Save Suggestion</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default SuggestedRestaurantSection;