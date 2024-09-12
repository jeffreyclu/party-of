import {  Marker } from "@react-google-maps/api";
import { Restaurant } from "../types";

import "./map.css"

interface MapMarkerProps {
    restaurant: Restaurant;
    onMarkerClick: (restaurant: Restaurant) => void;
}

export default function MapMarker ({
    restaurant,
    onMarkerClick,
}: MapMarkerProps) {
    return (
        <Marker
            key={restaurant.id}
            position={{ lat: restaurant.lat, lng: restaurant.lng }}
            title={restaurant.name}
            onClick={() => {
                onMarkerClick(restaurant)
            }}
        >
            {/* {showInfoWindow && (
                <InfoWindow onCloseClick={onInfoWindowClose}>
                    <div className="info-window">
                        <h3>{restaurant.name}</h3>
                        <p>{restaurant.address}</p>
                        <button className="save-button" onClick={() => removeRestaurant(restaurant.id)}>
                            Remove {restaurant.name} from Favorites
                        </button>
                    </div>
                </InfoWindow>
            )} */}
        </Marker>
    );
};