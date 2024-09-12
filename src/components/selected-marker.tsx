import { InfoWindow, Marker } from "@react-google-maps/api";

import "./map.css"

interface SelectedMarkerProps {
    selectedPlace: google.maps.places.PlaceResult;
    isFavorite: (restaurantId: string) => boolean;
    removeRestaurant: (restaurantId: string) => void;
    saveRestaurant: (restaurant: google.maps.places.PlaceResult) => void;
    onClose: () => void;
}

const SelectedMarker: React.FC<SelectedMarkerProps> = ({
    selectedPlace,
    isFavorite,
    removeRestaurant,
    saveRestaurant,
    onClose,
}) => {
    if (!selectedPlace.geometry || !selectedPlace.geometry.location) {
        return null;
    }
    
    return (
        <Marker position={selectedPlace.geometry.location}>
            <InfoWindow position={selectedPlace.geometry.location} onCloseClick={onClose}>
                <div>
                <h3>{selectedPlace.name}</h3>
                <p>{selectedPlace.formatted_address}</p>
                {isFavorite(selectedPlace.place_id || '') ? (
                    <button className="save-button" onClick={() => removeRestaurant(selectedPlace.place_id || '')}>
                    Remove {selectedPlace.name} from Favorites
                    </button>
                ) : (
                    <button className="save-button" onClick={() => saveRestaurant(selectedPlace)}>
                    Save {selectedPlace.name} to Favorites
                    </button>
                )}
                </div>
            </InfoWindow>
        </Marker>
    );
};

export default SelectedMarker;