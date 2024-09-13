import {  Marker } from "@react-google-maps/api";
import { Restaurant } from "../types";

import "./map.css"

interface MapMarkerProps {
    restaurant: Restaurant;
    onMarkerClick: (restaurant: Restaurant) => void;
    opacity?: number;
}

export default function MapMarker ({
    restaurant,
    onMarkerClick,
    opacity
}: MapMarkerProps) {
    return (
        <Marker
            opacity={opacity || 1}
            key={restaurant.id}
            position={{ lat: restaurant.lat, lng: restaurant.lng }}
            title={restaurant.name}
            onClick={() => {
                onMarkerClick(restaurant)
            }}
        >
        </Marker>
    );
};