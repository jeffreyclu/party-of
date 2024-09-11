import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

interface MapProps {
  apiKey: string;
}

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

const Map: React.FC<MapProps> = () => {
  const [selectedPlace, setSelectedPlace] = useState<LatLng | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceSelected = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setSelectedPlace(location);
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceSelected}
      >
        <input
          type="text"
          placeholder="Search for restaurants"
          style={{ width: '70vw', padding: '10px', boxSizing: 'border-box' }}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedPlace || defaultCenter}
        zoom={12}
        onClick={(event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            setSelectedPlace({
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            });
          }
        }}
      >
        {selectedPlace && <Marker position={selectedPlace} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;