import { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete, InfoWindow } from '@react-google-maps/api';
import { useFavoriteRestaurants } from '../hooks/use-favorite-restaurants';

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
    const [activeMarker, setActiveMarker] = useState<string | null>(null);
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
        }
    };

    const removeRestaurant = async (restaurantId: string) => {
        await removeFavoriteRestaurant(restaurantId);
        setSelectedPlace(null); // Clear the selected place after removing
    };
    
    const isFavorite = (restaurantId: string) => {
        return favoriteRestaurants.some((restaurant) => restaurant.id === restaurantId);
    };

    const handleMarkerClick = (id: string) => {
        setActiveMarker(id);
    };

    const handleInfoWindowClose = () => {
        setActiveMarker(null);
    };

    return (
        <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
            <div className="map-container">
                <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={handlePlaceSelected}
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
                >
                    {selectedPlace && selectedPlace.geometry && selectedPlace.geometry.location && (
                        <Marker position={selectedPlace.geometry.location}>
                            <InfoWindow position={selectedPlace.geometry.location} onCloseClick={() => setSelectedPlace(null)}>
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
                    )}
                    {favoriteRestaurants.map((restaurant) => (
                        <Marker
                        key={restaurant.id}
                        position={{ lat: restaurant.lat, lng: restaurant.lng }}
                        title={restaurant.name}
                        onClick={() => handleMarkerClick(restaurant.id)}
                        >
                        {activeMarker === restaurant.id && (
                            <InfoWindow onCloseClick={handleInfoWindowClose}>
                                <div className="info-window">
                                    <h3>{restaurant.name}</h3>
                                    <p>{restaurant.address}</p>
                                    <button className="save-button" onClick={() => removeRestaurant(restaurant.id || '')}>
                                            Remove {restaurant.name} from Favorites
                                    </button>
                                </div>
                            </InfoWindow>
                        )}
                        </Marker>
                    ))}
                </GoogleMap>
            </div>
        </LoadScript>
    );
};

export default Map;