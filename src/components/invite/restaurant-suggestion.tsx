import { Restaurant } from "../../types";

interface SuggestedRestaurantSectionProps {
    restaurant: Restaurant | null;
    restaurantLoading: boolean;
    restaurantError: string | null;
}

const SuggestedRestaurantSection: React.FC<SuggestedRestaurantSectionProps> = ({ restaurant, restaurantLoading, restaurantError }) => (
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
);

export default SuggestedRestaurantSection;