import { useEffect, useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { useFavoriteRestaurants } from '../hooks/use-favorite-restaurants';
import MapMarker from './map-marker';

import "./map.css";
import MapPanel from './map-panel';
import { Restaurant } from '../types';
import Loading from './loading';
import NotFound from '../pages/404';
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

interface MapProps {
    options?: {
        autoComplete?: boolean,
        showFavorites?: boolean,
    }
}

const Map: React.FC<MapProps> = ({ options }) => {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
    const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
    const [markers, setMarkers] = useState<Restaurant[]>([]);
    
    const { favoriteRestaurants, addFavoriteRestaurant, removeFavoriteRestaurant, loadingFavoriteRestaurants } = useFavoriteRestaurants();

    console.log("loading favorite restaurants", favoriteRestaurants);

    const { isLoaded: isMapLoaded, loadError: mapLoadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries: ['places'],
    });

    useEffect(() => {
        if (!loadingFavoriteRestaurants) {
            setMarkers(favoriteRestaurants);
        }
    }, [favoriteRestaurants, loadingFavoriteRestaurants]);

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
    }, [currentLocation, isMapLoaded]);

    const handlePlaceSelected = () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.geometry && place.geometry.location) {
            const restaurant = {
                id: place.place_id || '',
                name: place.name || 'Unnamed Place',
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                address: place.formatted_address || '',
                addedAt: new Date(),
            };

            setActiveRestaurant(restaurant)
            setSelectedPlace(place);
        }
    };

    const saveRestaurant = async (restaurant: Restaurant) => {
        await addFavoriteRestaurant(restaurant);
        setSelectedPlace(null); // Clear the selected place after saving
        setActiveRestaurant(null); // Close any open panel
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

    if (mapLoadError) {
        return <NotFound />;
    }

    if (!isMapLoaded) {
        return <Loading />;
    }

    return (
        <div className="map-container">
            {options?.autoComplete && <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={handlePlaceSelected}
                types={["cafe", "bakery", "meal_delivery", "meal_takeaway", "restaurant"]}
            >
                <input
                    type="text"
                    placeholder="Search for restaurants"
                    className="autocomplete-input"
                />
            </Autocomplete>}

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={selectedPlace?.geometry?.location || currentLocation || defaultCenter}
                zoom={12}
                onLoad={(map) => {mapRef.current = map}}
                clickableIcons={false}
            >
                {
                    activeRestaurant && (
                        <MapMarker
                            key={activeRestaurant.id}
                            restaurant={activeRestaurant}
                            onMarkerClick={handleMarkerClick}
                        />
                    )
                }
                {options?.showFavorites && markers.map((restaurant) => (
                    <MapMarker
                        key={restaurant.id}
                        restaurant={restaurant}
                        onMarkerClick={handleMarkerClick}
                        opacity={0.5}
                    />
                ))}
                {activeRestaurant && (
                    <MapPanel 
                        restaurant={activeRestaurant} 
                        onClose={handlePanelClose} 
                        removeRestaurant={removeRestaurant}
                        isFavorite={isFavorite}
                        saveRestaurant={saveRestaurant}
                    />
                )}
            </GoogleMap>
        </div>
    );
};

export default Map;