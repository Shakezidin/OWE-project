import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '500px',
};

 
interface LocationInfo {
  lat: number;
  lng: number;
  info: string;
}

const MyMapComponent: React.FC = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDestipqgaIX-VsZUuhDSGbNk_bKAV9dX0',  
  
  });

  const [locations, setLocations] = useState<LocationInfo[]>([]);  
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    setLocations([
      { lat: 25.5941, lng: 85.1376, info: 'Location 1' },
      { lat: 28.7041, lng: 77.1025, info: 'Location 2' },
      { lat: 19.0760, lng: 72.8777, info: 'Location 3' },
    ]);
  }, []);

  
  useEffect(() => {
    if (locations.length > 0 && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach((location) => {
        bounds.extend(new window.google.maps.LatLng(location.lat, location.lng));
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [locations]);

  const onMarkerHover = useCallback((location: LocationInfo) => {
    setSelectedLocation(location);
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return <div>Error loading maps: {loadError.message}</div>;

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        onLoad={onMapLoad}
        zoom={10}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            onMouseOver={() => onMarkerHover(location)}
            onMouseOut={() => setSelectedLocation(null)}
          />
        ))}

        {selectedLocation && (
          <InfoWindow position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}>
            <div>
              <h4>Location Data</h4>
              <p>{selectedLocation.info}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MyMapComponent;
