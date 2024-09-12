import React from 'react';
import './map-panel.css';

interface MapPanelProps {
    restaurant: {
        id: string;
        name: string;
        address: string;
        lat: number;
        lng: number;
    };
    onClose: () => void;
    removeRestaurant: (restaurantId: string) => void;
}

const MapPanel: React.FC<MapPanelProps> = ({ removeRestaurant, restaurant, onClose }) => {
    return (
        <div className="side-panel">
            <button className="close-button" onClick={onClose}>Close</button>
            <h2>{restaurant.name}</h2>
            <p>{restaurant.address}</p>
            <p>Latitude: {restaurant.lat}</p>
            <p>Longitude: {restaurant.lng}</p>
            <button className="save-button" onClick={() => removeRestaurant(restaurant.id)}>
                Remove {restaurant.name} from Favorites
            </button>
        </div>
    );
};

export default MapPanel;
