import { Restaurant } from '../../types';

import './map-panel.css';

interface MapPanelProps {
    restaurant: Restaurant;
    onClose: () => void;
    removeRestaurant: (restaurantId: string) => void;
    isFavorite: (restaurantId: string) => boolean;
    saveRestaurant: (restaurant: Restaurant) => void;
}

const MapPanel: React.FC<MapPanelProps> = ({ removeRestaurant, restaurant, onClose, isFavorite, saveRestaurant }) => {
    const handleSave = () => {
        saveRestaurant(restaurant);
    };

    return (
        <div className="side-panel">
            <button className="close-button" onClick={onClose}>❌</button>
            <h2>{restaurant.name}</h2>
            <p>{restaurant.address}</p>
            {isFavorite(restaurant.id) ? (
                <button className="remove-button" onClick={() => removeRestaurant(restaurant.id)}>
                    Remove Favorite
                </button>
            ) : (
                <button className="save-button" onClick={handleSave}>
                    Save {restaurant.name} to Favorites
                </button>
            )}
        </div>
    );
};

export default MapPanel;
