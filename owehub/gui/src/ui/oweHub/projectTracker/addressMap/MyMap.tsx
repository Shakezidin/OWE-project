import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
  Autocomplete,
} from '@react-google-maps/api';
import { IoClose } from 'react-icons/io5';
import { debounce } from '../../../../utiles/debounce';
import { useNavigate } from 'react-router-dom';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { stateOption } from '../../../../core/models/data_models/SelectDataModel';
import { toast } from 'react-toastify';
import { DateRange } from 'react-date-range';
import styles from './styles/mymap.module.css';
import { ICONS } from '../../../../resources/icons/Icons';
import MicroLoader from '../../../components/loader/MicroLoader';
import { toZonedTime } from 'date-fns-tz';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { IoIosSearch } from 'react-icons/io';
import SelectOption from '../../../components/selectOption/SelectOption';
import NotFound from '../../noRecordFound/NotFound';
import DataNotFound from '../../../components/loader/DataNotFound';

import {
  endOfWeek,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  format,
} from 'date-fns';
import Input from '../../../components/text_input/Input';


const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

interface LocationInfo {
  lat: number;
  lng: number;
  unique_id: string;
  home_owner: string;
  project_status: string;
}
export type DateRangeWithLabel = {
  label?: string;
  start: Date;
  end: Date;
};
type LatLng = {
  lat: number;
  lng: number;
};
const MyMapComponent: React.FC = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDestipqgaIX-VsZUuhDSGbNk_bKAV9dX0', // Replace with your API key
    libraries: ['places'],
  });
  const today = getCurrentDateInUserTimezone();
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
  const startOfThisMonth = startOfMonth(today);
  const startOfThisYear = startOfYear(today);
  const startOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );
  const startOfThreeMonthsAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 2,
    1
  );
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  const startOfLastWeek = startOfWeek(subDays(startOfThisWeek, 1), {
    weekStartsOn: 1,
  });
  const endOfLastWeek = endOfWeek(subDays(startOfThisWeek, 1), {
    weekStartsOn: 1,
  });

  const [locations, setLocations] = useState<LocationInfo[]>([]);
  const [search, setSearch] = useState('');
  const [searchValue, setSearchValue] = useState<any>('');

  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [projectCount, setProjectCount] = useState<number>(0);

  const mapRef = useRef<google.maps.Map | null>(null);
  const [center, setCenter] = useState({ lat: 25.5941, lng: 85.1376 });
  const [filteredLocations, setFilteredLocations] = useState<LocationInfo[]>(
    []
  ); // Filtered locations

  const [expandedLeads, setExpandedLeads] = useState<string[]>([]);

  const [selectedPeriod, setSelectedPeriod] =
    useState<DateRangeWithLabel | null>(null);
  const [selectedRanges, setSelectedRanges] = useState([
    { startDate: new Date(), endDate: new Date(), key: 'selection' },
  ]);

  const [selectedDates, setSelectedDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: startOfThisWeek,
    endDate: today,
  });
  const [newFormData, setNewFormData] = useState({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dateRangeRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const [toggledId, setToggledId] = useState<string | null>(null);

  const toggleCalendar = () => {
    setIsCalendarOpen((prevState) => !prevState);
  };
  const [createRePayData, setCreatePayData] = useState({
    state: '',
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await postCaller('get_user_address', {
          unique_ids: [searchValue],
          states: [createRePayData.state],
        });

        if (data.status > 201) {
          toast.error(data.message);
          return;
        }

        // Check if data.data exists and has elements
        if (
          !data?.data ||
          !Array.isArray(data.data) ||
          data.data.length === 0
        ) {
          setLocations([]); // Set empty array if no data
          return;
        }

        const formattedData: LocationInfo[] = data.data
          .filter(
            (location: any) =>
              location.latitute &&
              location.latitute !== 0 &&
              location.lognitude &&
              location.lognitude !== 0
          )
          .map((location: any) => ({
            lat: location.latitute,
            lng: location.lognitude,
            unique_id: location.unique_id || 'No info available',
            home_owner: location.home_owner,
            project_status: location.project_status,
          }));

        setLocations(formattedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [
    selectedDates.startDate,
    selectedDates.endDate,
    createRePayData.state,
  ]);

  const debouncedSetSelectedLocation = useCallback(
    debounce((location: LocationInfo | null) => {
      setSelectedLocation(location);
    }, 100),
    []
  );

  const handleCalcClose = () => {
    navigate(-1);
  };

  const handleChange = (newValue: any, fieldName: string) => {
    setCreatePayData((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : '',
    }));
  };

  const onMarkerHover = useCallback(
    (location: LocationInfo) => {
      debouncedSetSelectedLocation(location);
    },
    [debouncedSetSelectedLocation]
  );

  const onMarkerLeave = useCallback(() => {
    debouncedSetSelectedLocation(null);
  }, [debouncedSetSelectedLocation]);

  const onMarkerClick = useCallback((location: LocationInfo) => {
    setSelectedLocation((prevLocation) =>
      prevLocation === location ? null : location
    );

    if (mapRef.current) {
      mapRef.current.setZoom(15); // Zoom level when marker is clicked
      mapRef.current.panTo({ lat: location.lat, lng: location.lng }); // Center the map on the clicked marker
    }
  }, []);

  const tableData = {
    tableNames: ['states'],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData((prev) => ({ ...prev, ...res.data }));
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  // Function to calculate the distance between two points (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Handle search changes in the Autocomplete input
  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    
    if (!place || !place.geometry || !place.geometry.location) {
      toast.error('No details available for the selected place.');
      return;
    }
  
    const searchedLocation: LatLng = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

 // Set the selected place's name in the search bar
  const selectedAddress = place.formatted_address || place.name || '';
  setSearchValue(selectedAddress); // Update the input field to show the selected address

  
    setCenter(searchedLocation);
  
    // Filter locations within 10 km of the searched address
    const neighboringLocations = locations.filter((location) => {
      const distance = calculateDistance(
        searchedLocation.lat,
        searchedLocation.lng,
        location.lat,
        location.lng
      );
      return distance <= 10; // Locations within 10km
    });
  
    setFilteredLocations(neighboringLocations);
  
    // Adjust the map bounds to show both the searched location and neighboring markers
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(searchedLocation);
  
    neighboringLocations.forEach((location) => {
      bounds.extend({ lat: location.lat, lng: location.lng });
    });
  
    if (mapRef.current) {
      mapRef.current.fitBounds(bounds); // Fit the map to show all markers
    }
  };

  // Add a new function to handle input changes
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const inputValue = event.target.value;

  // If the input is cleared, reload the default locations
  if (inputValue === '') {
    setFilteredLocations(locations); // Reset to all locations
    if (mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      mapRef.current.fitBounds(bounds); // Fit the map to all markers
    }
  }

  setSearchValue(inputValue); // Update the search state (if needed)
};


  // Set all locations by default when no search is performed
  useEffect(() => {
    // Initially set the map to show all locations if no search is performed
    if (locations.length > 0 && filteredLocations.length === 0) {
      setFilteredLocations(locations);
    }
  }, [locations, filteredLocations]);

  // Recalculate bounds when locations change
  useEffect(() => {
    if (mapRef.current && locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [locations]);
  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      // Create a bounds object
      const bounds = new window.google.maps.LatLngBounds();

      // Use filtered locations if there are any, otherwise use all locations
      const locationsToShow =
        filteredLocations.length > 0 ? filteredLocations : locations;

      if (locationsToShow.length > 0) {
        // Extend the bounds for each marker location
        locationsToShow.forEach((location) => {
          bounds.extend({ lat: location.lat, lng: location.lng });
        });

        // Fit the map to the bounds (this adjusts center and zoom to show all markers)
        map.fitBounds(bounds);
      } else {
        // If no locations, set the map to a default center and zoom level
        map.setCenter({ lat: 25.5941, lng: 85.1376 });
        map.setZoom(5); // Adjust default zoom as per your preference
      }
    },
    [filteredLocations, locations]
  );

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  function getUserTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  function getCurrentDateInUserTimezone() {
    const now = new Date();
    const userTimezone = getUserTimezone();
    return toZonedTime(now, userTimezone);
  }

  // Define onLoad function to store the autocomplete instance
  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  console.log(filteredLocations, 'klkogjd');
  console.log(projectCount, 'projectcount');

  return (
    <div className={styles.mapWrap}>
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <h3>Install Map</h3>
          <div className={styles.mapSearch}>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input
                type="text"
                placeholder="Search for an address"
                className={styles.inputsearch}
                style={{ width: '300px', padding: '8px' }}
                onChange={handleInputChange} // Add the input change handler
                value={searchValue} // Bind the input value to state
              />
            </Autocomplete>

            <div className={styles.dropdownstate}>
              <SelectOption
                options={stateOption(newFormData)}
                onChange={(newValue) => handleChange(newValue, 'state')}
                value={
                  stateOption(newFormData)?.find(
                    (option) => option.value === createRePayData.state
                  ) || { label: 'Select State', value: '' }
                }
                menuStyles={{
                  width: 400,
                }}
                menuListStyles={{
                  fontWeight: 400,
                  width: 150,
                }}
                singleValueStyles={{
                  fontWeight: 400,
                }}
                width="150px"
              />
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.mapClose} onClick={handleCalcClose}>
            <IoClose />
          </div>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          height: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '5px',
        }}
      >
        {loading ? (
          <div className={styles.loading}>
            <MicroLoader />
          </div>
        ) : (
          <>
            {locations && locations.length > 0 ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                onLoad={onMapLoad}
                zoom={5}
                center={center}
              >
                {/* Searched location marker */}
                {/* {center && (
          <Marker
            position={center}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', // Customize the icon if needed
            }}
          />
        )} */}

                {/* Display all or filtered markers */}
                {filteredLocations.map((location, index) => (
                  <Marker
                    key={index}
                    position={{ lat: location.lat, lng: location.lng }}
                    onMouseOver={() => onMarkerHover(location)}
                    onClick={() => onMarkerClick(location)}
                    onMouseOut={onMarkerLeave}
                     
                    options={{
                      anchorPoint: new window.google.maps.Point(0, -10),
                    }}
                  />
                ))}

                {selectedLocation && (
                  <InfoWindow
                    position={{
                      lat: selectedLocation.lat,
                      lng: selectedLocation.lng,
                    }}
                    options={{
                      pixelOffset: new window.google.maps.Size(0, -50),
                      disableAutoPan: true,
                    }}
                    onDomReady={() => {
                      const interval = setInterval(() => {
                        const closeButton = document.querySelector(
                          '.gm-ui-hover-effect'
                        ) as HTMLElement;
                        if (closeButton) {
                          closeButton.style.display = 'none';
                          clearInterval(interval);
                        }
                      }, 10);
                    }}
                  >
                    <div className={styles.infoWindow}>
                      <div className={styles.infoWindowRow}>
                        <p className={styles.infoWindowLabel}>Home Owner:</p>
                        <p className={styles.infoWindowValue}>
                          {selectedLocation.home_owner}
                        </p>
                      </div>
                      <div className={styles.infoWindowRow}>
                        <p className={styles.infoWindowLabel}>Unique ID:</p>
                        <p className={styles.infoWindowValue}>
                          {selectedLocation.unique_id}
                        </p>
                      </div>
                      <div className={styles.infoWindowRow}>
                        <p className={styles.infoWindowLabel}>
                          Project Status:
                        </p>
                        <p className={styles.infoWindowValue}>
                          {selectedLocation.project_status}
                        </p>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div
                className=""
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <DataNotFound />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyMapComponent;
