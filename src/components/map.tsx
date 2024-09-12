import { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
import { useFavoriteRestaurants } from '../hooks/use-favorite-restaurants';
import MapMarker from './map-marker';
import SelectedMarker from './selected-marker';

import "./map.css";
import MapPanel from './map-panel';
import { Restaurant } from '../types';
interface LatLng {
    lat: number;
    lng: number;
}

const containerStyle = {
    width: '70vw',
    height: '70vh',
};

const defaultCenter: LatLng = {
    lat: 40.730610, // Default center (New York City)
    lng: -73.935242,
};

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Map: React.FC = () => {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
    const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
    
    const { favoriteRestaurants, addFavoriteRestaurant, removeFavoriteRestaurant } = useFavoriteRestaurants();
    
    // get the user's location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                });
            },
            (error) => {
                console.error("Error getting user's location:", error);
            }
            );
        }
    }, []);

    // center the map on the user's location if we have it
    useEffect(() => {
        if (currentLocation && mapRef.current) {
            mapRef.current.panTo(currentLocation);
        }
    }, [currentLocation]);

    const handlePlaceSelected = () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.geometry && place.geometry.location) {
            setSelectedPlace(place);
            setActiveRestaurant(null); // Close any open panel
        }
    };

    const saveRestaurant = async (restaurant: google.maps.places.PlaceResult) => {
        if (restaurant && restaurant.geometry && restaurant.geometry.location) {
            const newRestaurant = {
                id: restaurant.place_id || '',
                name: restaurant.name || 'Unnamed Place',
                lat: restaurant.geometry.location.lat(),
                lng: restaurant.geometry.location.lng(),
                address: restaurant.formatted_address || '',
                addedAt: new Date(),
            };
            await addFavoriteRestaurant(newRestaurant);
            setSelectedPlace(null); // Clear the selected place after saving
            setActiveRestaurant(null); // Close any open panel
        }
    };

    const removeRestaurant = async (restaurantId: string) => {
        await removeFavoriteRestaurant(restaurantId);
        setSelectedPlace(null); // Clear the selected place after removing
        setActiveRestaurant(null); // Close any open panel
    };
    
    const isFavorite = (restaurantId: string) => {
        return favoriteRestaurants.some((restaurant) => restaurant.id === restaurantId);
    };

    const handleMarkerClick = (restaurant: Restaurant) => {
        setActiveRestaurant(restaurant);
    };

    const handlePanelClose = () => {
        setActiveRestaurant(null);
    }

    return (
        <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
            <div className="map-container">
                <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={handlePlaceSelected}
                    types={["cafe", "bakery", "meal_delivery", "meal_takeaway", "restaurant"]}
                >
                    <input
                        type="text"
                        placeholder="Search for restaurants"
                        className="autocomplete-input"
                    />
                </Autocomplete>

                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={selectedPlace?.geometry?.location || currentLocation || defaultCenter}
                    zoom={12}
                    onLoad={(map) => {mapRef.current = map}}
                    clickableIcons={false}
                >
                    {selectedPlace && selectedPlace.geometry && selectedPlace.geometry.location && (
                        <SelectedMarker
                            selectedPlace={selectedPlace}
                            isFavorite={isFavorite}
                            removeRestaurant={removeRestaurant}
                            saveRestaurant={saveRestaurant}
                            onClose={() => setSelectedPlace(null)}
                        />
                    )}
                    {favoriteRestaurants.map((restaurant) => (
                        <MapMarker
                            key={restaurant.id}
                            restaurant={restaurant}
                            onMarkerClick={handleMarkerClick}
                        />
                    ))}
                    {activeRestaurant && (
                        <MapPanel restaurant={activeRestaurant} onClose={handlePanelClose} removeRestaurant={removeRestaurant}/>
                    )}
                </GoogleMap>

            </div>
        </LoadScript>
    );
};

export default Map;