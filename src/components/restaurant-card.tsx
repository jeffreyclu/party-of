import { Restaurant } from '../types';

import "./restaurant-card.css";

interface RestaurantCardProps {
    restaurant: Restaurant;
    onClick?: (restaurant: Restaurant) => void;
    isSelected: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick, isSelected }) => {
    return (
        <div 
            className={`restaurant-card ${isSelected ? 'selected' : ''}`} 
            onClick={() => onClick ? onClick(restaurant) : undefined}
        >
            {isSelected && (
                <div className="checkmark-container">
                    <i className="fas fa-check checkmark"></i>
                </div>
            )}
            <h3>{restaurant.name}</h3>
            <p>{restaurant.address}</p>
        </div>
    );
};

export default RestaurantCard;
