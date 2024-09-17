import { Restaurant } from '../types';

interface RestaurantCardProps {
    restaurant: Restaurant;
    onClick?: (restaurant: Restaurant) => void;
    }

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
    return (
        <div className="favorite-card" onClick={() => onClick ? onClick(restaurant) : undefined}>
            <h3>{restaurant.name}</h3>
            <p>{restaurant.address}</p>
        </div>
    );
};

export default RestaurantCard;
