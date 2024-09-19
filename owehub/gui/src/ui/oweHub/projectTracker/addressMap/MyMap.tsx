import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { IoClose } from 'react-icons/io5';
import { debounce } from '../../../../utiles/debounce';
import { useNavigate } from 'react-router-dom';

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
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

  const [locations, setLocations] = useState<LocationInfo[]>([{ lat: 25.5941, lng: 85.1376, info: 'Location 1' },
  { lat: 28.7041, lng: 77.1025, info: 'Location 2' },
  { lat: 19.0760, lng: 72.8777, info: 'Location 3' }]);
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  const mapRef = useRef<any | null>(null);
  const [center, setCenter] = useState({ lat: 25.5941, lng: 85.1376 }); // Set an initial center


  const debouncedSetSelectedLocation = useCallback(
    debounce((location: LocationInfo | null) => {
      setSelectedLocation(location);
    }, 100),
    []
  );

  const handleCalcClose = () => {
    navigate(-1);
  };

  const onMarkerHover = useCallback((location: LocationInfo) => {
    debouncedSetSelectedLocation(location);
  }, [debouncedSetSelectedLocation]);

  const onMarkerLeave = useCallback(() => {
    debouncedSetSelectedLocation(null);
  }, [debouncedSetSelectedLocation]);

  useEffect(() => {
    if (isLoaded && locations.length > 0 && window.google) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      const newCenter = {
        lat: (bounds.getNorthEast().lat() + bounds.getSouthWest().lat()) / 2,
        lng: (bounds.getNorthEast().lng() + bounds.getSouthWest().lng()) / 2,
      };
      setCenter(newCenter);
      if (mapRef.current) {
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [isLoaded, locations]);

  const onMarkerClick = useCallback((location: LocationInfo) => {
    setSelectedLocation(prevLocation => prevLocation === location ? null : location);
  }, []);

  const onMapLoad = useCallback((map:any) => {
    mapRef.current = map;
    if (locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      map.fitBounds(bounds);
    }
  }, [locations]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
        <div>
         <div onClick={handleCalcClose} style={{ height: '26px' }}>
              <IoClose className="calendar-close" style ={{float:"right"}}/>
            </div>
            </div>

    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' , marginTop: '5px'}}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        onLoad={onMapLoad}
        zoom={5}
        center={center}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng, }}
            onMouseOver={() => onMarkerHover(location)}
            onMouseOut={onMarkerLeave}
            options={{
              // pixelOffset: new window.google.maps.Size(0, -10),
              anchorPoint: new window.google.maps.Point(0, -10)
            }}
          />
        ))}

        {selectedLocation && (
          <InfoWindow 
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={() => debouncedSetSelectedLocation(null)}
            options={{
              pixelOffset: new window.google.maps.Size(0, -50),
            }}
          >
            <div  className='flex flex-column pb2 pr2 items-center justify-center'  >
              <h4>Location Data</h4>
              <p>{selectedLocation.info}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
    </div>
  );
};

export default MyMapComponent;
