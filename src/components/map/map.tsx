import { useEffect, useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Autocomplete, Libraries } from '@react-google-maps/api';

import MapMarker from './map-marker';
import MapPanel from './map-panel';
import { Restaurant, ToastType } from '../../types';
import Loading from '../loading';
import NotFound from '../../pages/404';
import { serverTimestamp } from 'firebase/firestore';
import { useToast } from '../../hooks/use-toast';
import { useFavoriteRestaurants } from '../../hooks/use-favorite-restaurants';

import "./map.css";

interface LatLng {
    lat: number;
    lng: number;
}

const containerStyle = {
    width: '95vw',
    height: '70vh',
};

const defaultLocation: LatLng = {
    lat: 40.730610, // New York City
    lng: -73.935242,
};

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const libraries: Libraries = ['places', 'routes'];

interface MapProps {
    options?: {
        autoComplete?: boolean,
        showFavorites?: boolean,
    }
}

const Map: React.FC<MapProps> = ({ options }) => {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
    const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral>(defaultLocation);
    const [markers, setMarkers] = useState<Restaurant[]>([]);
    
    const { favoriteRestaurants, addFavoriteRestaurant, removeFavoriteRestaurant, loadingFavoriteRestaurants } = useFavoriteRestaurants();
    const { showToast } = useToast();
    
    const { isLoaded: isMapLoaded, loadError: mapLoadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries: libraries,
    });

    useEffect(() => {
        if (!loadingFavoriteRestaurants) {
            setMarkers(favoriteRestaurants);
        }
    }, [favoriteRestaurants, loadingFavoriteRestaurants]);

    // get the user's location
    useEffect(() => {
        if (navigator.geolocation) {
            showToast('Fetching your location...', ToastType.Info);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    showToast('Centering map on your location', ToastType.Success);
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            showToast('User denied the request for Geolocation.', ToastType.Error);
                            break;
                        case error.POSITION_UNAVAILABLE:
                            showToast('Location information is unavailable.', ToastType.Error);
                            break;
                        case error.TIMEOUT:
                            showToast('The request to get user location timed out.', ToastType.Error);
                            break;
                        default:
                            showToast('An unknown error occurred while fetching location.', ToastType.Error);
                            break;
                    }
                },
                {
                    timeout: 5000, // Set a timeout of 5 seconds
                }
            );
        } else {
            showToast('Geolocation is not supported by this browser.', ToastType.Error);
        }
    }, [showToast]);

    // center the map on the user's location if we have it
    useEffect(() => {
        if (currentLocation && mapRef.current) {
            mapRef.current.panTo(currentLocation);
        }
    }, [currentLocation, isMapLoaded]);

    // set the center of the map to the active restaurant
    useEffect(() => {
        if (activeRestaurant) {
            setCurrentLocation({
                lat: activeRestaurant.lat,
                lng: activeRestaurant.lng,
            });
        }
    }, [activeRestaurant]);

    const handlePlaceSelected = () => {
        const place = autocompleteRef.current?.getPlace();
        console.log({place})
        if (place && place.geometry && place.geometry.location) {
            const restaurant = {
                id: place.place_id || '',
                name: place.name || 'Unnamed Place',
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                address: place.formatted_address || '',
                addedAt: serverTimestamp(),
            };

            setActiveRestaurant(restaurant)
        }
    };

    const saveRestaurant = async (restaurant: Restaurant) => {
        await addFavoriteRestaurant(restaurant);
        showToast('Restaurant saved to favorites', ToastType.Success);
        setActiveRestaurant(null);
    };

    const removeRestaurant = async (restaurantId: string) => {
        await removeFavoriteRestaurant(restaurantId);
        showToast('Restaurant removed from favorites', ToastType.Success);
        setActiveRestaurant(null);
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
                center={currentLocation}
                zoom={12}
                onLoad={(map) => {mapRef.current = map}}
                onClick={(e: google.maps.MapMouseEvent) => {
                    if (e.placeId && mapRef.current) {
                        // Prevent the default info window from showing
                        e.stop();

                        const service = new google.maps.places.PlacesService(mapRef.current);

                        service.getDetails({ placeId: e.placeId }, (place, status) => {
                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                console.log(place);
                            }
                        });
                    }
                }}
                clickableIcons={true}
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
