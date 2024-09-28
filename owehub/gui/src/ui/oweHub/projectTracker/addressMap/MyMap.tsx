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
import { availableStates } from '../../../../core/models/data_models/SelectDataModel';
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
import { TYPE_OF_USER } from '../../../../resources/static_data/Constant';
import useAuth from '../../../../hooks/useAuth';

import {
  endOfWeek,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  format,
} from 'date-fns';
import Input from '../../../components/text_input/Input';
import { RiMapPinLine } from 'react-icons/ri';

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  borderRadius: '14px',
};

interface LocationInfo {
  lat: number;
  lng: number;
  unique_id: string;
  home_owner: string;
  project_status: string;
}
interface StateOption {
  label: string; // This is the name of the state
  value: string; // This is the unique value for the state
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
    googleMapsApiKey: 'AIzaSyDestipqgaIX-VsZUuhDSGbNk_bKAV9dX0',
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
  const { authData, getUpdatedAuthData } = useAuth();

  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [isSearchDisabled, setIsSearchDisabled] = useState(false);

  const [projectCount, setProjectCount] = useState<number>(0);
  const [neighboring, setNeighboring] = useState<LocationInfo[]>([]); // Filtered locations
  const projectCountRef = useRef(projectCount);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [center, setCenter] = useState({ lat: 25.5941, lng: 85.1376 });
  const [searchedLocation, setSearchedLocation] = useState<LatLng | null>(null); // New state for searched location
  const [filteredLocations, setFilteredLocations] = useState<LocationInfo[]>(
    []
  ); // Filtered locations
  const role = authData?.role;
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
    state: "All",
    // other fields...
  });
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const requestData: any = {}; // Initialize an empty object

        const availableStateOptions = availableStates(newFormData);

        const data = await postCaller('get_user_address', {
          states:
            createRePayData.state === 'All'
              ? availableStateOptions.map((state) => state.value)
              : createRePayData.state === ''
                ? ['']
                : [createRePayData.state],

        });

        if (data.status > 201) {
          toast.error(data.message);
          return;
        }

        if (
          !data?.data ||
          !Array.isArray(data.data) ||
          data.data.length === 0
        ) {
          setLocations([]);
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
  }, [selectedDates.startDate, selectedDates.endDate, createRePayData.state]);

  const debouncedSetSelectedLocation = useCallback(
    debounce((location: LocationInfo | null) => {
      setSelectedLocation(location);
    }, 100),
    []
  );

  const handleCalcClose = () => {
    navigate(-1);
  };

  const kmsOptions = [
    { km: 10 },
    { km: 50 },
    { km: 100 },
    { km: 200 },
    { km: 500 },
    { km: 1000 },
  ];
  const milesOptions = [
    { miles: 5 },
    { miles: 10 },
    { miles: 25 },
    { miles: 50 },
    { miles: 100 },
    { miles: 200 },
  ];

  const [selectedKm, setSelectedKm] = useState<any>(10);

  const [selectedMiles, setSelectedMiles] = useState<any>(10); // Default to 10 miles

  // Handle change function
  const handleChange = (newValue: any) => {
    setCreatePayData({
      ...createRePayData,
      state: newValue.value, // Update state with the selected state's value
    });
    setSearchValue('')
    setSearchedLocation(null)
  };

  useEffect(() => {
    if (createRePayData.state !== 'All') {
      setIsSearchDisabled(true);
    } else {
      setIsSearchDisabled(false);
    }
  }, [createRePayData.state]);

  console.log(createRePayData.state, "all")

  // const handleChange = (newValue: any, fieldName: string) => {
  //   // Extract the selected state's value, or set it to 'All' if nothing is selected
  //   const updatedValue = newValue ? newValue.value : 'All';

  //   setCreatePayData((prevData) => {
  //     const availableStateOptions = availableStates(newFormData); // Call the function to get the states

  //     // Handle if "All" is selected (assign all states)
  //     if (updatedValue === 'All') {
  //       return {
  //         ...prevData,
  //         [fieldName]: availableStateOptions.map((state) => state.value), // Set all state values
  //       };
  //     }
  //     // Handle if "-" is selected (assign empty)
  //     else if (updatedValue === '-') {
  //       return {
  //         ...prevData,
  //         [fieldName]: [], // Set an empty state value
  //       };
  //     }
  //     // Handle if a specific state is selected
  //     else {
  //       return {
  //         ...prevData,
  //         [fieldName]: [updatedValue], // Set only the selected state
  //       };
  //     }
  //   });

  //   // Reset the search value when a new state is selected
  //   setSearchValue('');
  // };

  // Function to calculate the distance between two points in miles
  const calculateDistanceInMiles = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
  };

  // Function to filter locations within the selected miles range
  const filterLocationsByMiles = (searchedLocation: LatLng, miles: number) => {
    const neighboringLocations = locations.filter((location) => {
      const distance = calculateDistanceInMiles(
        searchedLocation.lat,
        searchedLocation.lng,
        location.lat,
        location.lng
      );
      return distance <= miles;
    });

    setFilteredLocations(neighboringLocations); // Set the new filtered locations
    setNeighboring(neighboringLocations);

    // Update map bounds to show the filtered locations
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(searchedLocation);
    neighboringLocations.forEach((location) => {
      bounds.extend({ lat: location.lat, lng: location.lng });
    });

    if (mapRef.current) {
      if (neighboringLocations.length > 0) {
        mapRef.current.fitBounds(bounds);
      } else {
        mapRef.current.setCenter(searchedLocation);
        mapRef.current.setZoom(10); // Zoom out if no neighboring locations found
      }
    }
  };

  const handleMilesChange = (newMiles: any) => {
    setSelectedMiles(newMiles);
    if (searchedLocation) {
      filterLocationsByMiles(searchedLocation, newMiles); // Call the filter function for miles
    }
  };

  // const handleKMChange = (newKm: any) => {
  //   setSelectedKm(newKm);
  //   if (searchedLocation) {
  //     filterLocationsByKm(searchedLocation, newKm); // Call the filter function
  //   }
  // };

  // Function to filter locations within the selected KM range
  // const filterLocationsByKm = (searchedLocation: LatLng, km: number) => {
  //   const neighboringLocations = locations.filter((location) => {
  //     const distance = calculateDistance(
  //       searchedLocation.lat,
  //       searchedLocation.lng,
  //       location.lat,
  //       location.lng
  //     );
  //     return distance <= km;
  //   });

  //   setFilteredLocations(neighboringLocations); // Set the new filtered locations
  //   setNeighboring(neighboringLocations);

  //   // Update map bounds to show the filtered locations
  //   const bounds = new window.google.maps.LatLngBounds();
  //   bounds.extend(searchedLocation);
  //   neighboringLocations.forEach((location) => {
  //     bounds.extend({ lat: location.lat, lng: location.lng });
  //   });

  //   if (mapRef.current) {
  //     if (neighboringLocations.length > 0) {
  //       mapRef.current.fitBounds(bounds);
  //     } else {
  //       mapRef.current.setCenter(searchedLocation);
  //       mapRef.current.setZoom(10); // Zoom out if no neighboring locations found
  //     }
  //   }
  // };

  // Function to handle search location change
  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place || !place.geometry || !place.geometry.location) {
      console.log('No details available for the selected place.');
      return;
    }

    const searchedLocation: LatLng = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    const selectedAddress = place.formatted_address || place.name || '';
    console.log(searchedLocation, 'searchedLocation');

    // Update the search value and location state
    setSearchValue(selectedAddress);
    setSearchedLocation(searchedLocation);
    setCenter(searchedLocation);

    // Filter locations within the selected Miles range after search
    filterLocationsByMiles(searchedLocation, selectedMiles);
  };

  useEffect(() => {
    // Ensure the state field exists before proceeding
    if (createRePayData.state !== 'All') {
      const geocoder = new window.google.maps.Geocoder();
      const stateName = createRePayData.state; // Assuming `createPayData.state` holds the state's name or label

      console.log(stateName, 'stateName');

      // Perform geocoding to get the new state's coordinates and update the map
      geocoder.geocode({ address: stateName }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const stateBounds = results[0].geometry.viewport;
          const stateCenter = results[0].geometry.location;

          if (mapRef.current) {
            // Update the map center and bounds with the new state's location
            setCenter({ lat: stateCenter.lat(), lng: stateCenter.lng() });
            mapRef.current.fitBounds(stateBounds);
          }
        } else {
          console.log('Failed to find state location.');
        }
      });
    }
  }, [createRePayData.state]); // Trigger effect whenever `createPayData.state` changes

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
      mapRef.current.setZoom(15);
      mapRef.current.panTo({ lat: location.lat, lng: location.lng });
    }
  }, []);

  const tableData = {
    tableNames: ['available_states'],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData((prev) => ({ ...prev, ...res.data }));
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  // // Function to calculate the distance between two points (Haversine formula)
  // const calculateDistance = (
  //   lat1: number,
  //   lng1: number,
  //   lat2: number,
  //   lng2: number
  // ): number => {
  //   const R = 6371; // Earth's radius in kilometers
  //   const dLat = ((lat2 - lat1) * Math.PI) / 180;
  //   const dLng = ((lng2 - lng1) * Math.PI) / 180;
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos((lat1 * Math.PI) / 180) *
  //       Math.cos((lat2 * Math.PI) / 180) *
  //       Math.sin(dLng / 2) *
  //       Math.sin(dLng / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   return R * c; // Distance in kilometers
  // };

  // Handle search changes in the Autocomplete input
  // const onPlaceChanged = () => {
  //   const place = autocompleteRef.current?.getPlace();

  //   if (!place || !place.geometry || !place.geometry.location) {
  //     toast.error('No details available for the selected place.');
  //     return;
  //   }

  //   const searchedLocation: LatLng = {
  //     lat: place.geometry.location.lat(),
  //     lng: place.geometry.location.lng(),
  //   };

  //   const selectedAddress = place.formatted_address || place.name || '';
  //   setSearchValue(selectedAddress);
  //   setSearchedLocation(searchedLocation);
  //   setCenter(searchedLocation);

  //   // Filter locations within 10 km of the searched address
  //   const neighboringLocations = locations.filter((location) => {
  //     const distance = calculateDistance(
  //       searchedLocation.lat,
  //       searchedLocation.lng,
  //       location.lat,
  //       location.lng
  //     );
  //     return distance <= 10;
  //   });

  //   setFilteredLocations(neighboringLocations);
  //   setNeighboring(neighboringLocations);

  //   // Adjust the map bounds to show both the searched location and neighboring markers
  //   const bounds = new window.google.maps.LatLngBounds();
  //   bounds.extend(searchedLocation);

  //   neighboringLocations.forEach((location) => {
  //     bounds.extend({ lat: location.lat, lng: location.lng });
  //   });

  //   if (mapRef.current) {
  //     if (neighboringLocations.length > 0) {
  //       // If there are neighboring locations, fit bounds to show all markers
  //       mapRef.current.fitBounds(bounds);
  //     } else {
  //       // If no neighboring locations, set a default zoom level (zoom out)
  //       mapRef.current.setCenter(searchedLocation);
  //       mapRef.current.setZoom(10); // Adjust zoom level to show a larger area
  //     }
  //   }
  // };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (inputValue === '') {
      setFilteredLocations(locations);
      if (mapRef.current) {
        const bounds = new window.google.maps.LatLngBounds();
        locations.forEach((location) => {
          bounds.extend({ lat: location.lat, lng: location.lng });
        });
        mapRef.current.fitBounds(bounds);
      }
    }

    setSearchValue(inputValue);
  };

  useEffect(() => {
    // Trim searchValue to remove spaces
    const trimmedSearchValue = searchValue.trim();

    if (trimmedSearchValue) {
      // If searchValue has meaningful content, filter neighboring locations
      setFilteredLocations(neighboring);
    } else if (createRePayData.state) {
      // If no searchValue but state is available, filter by locations in that state
      setFilteredLocations(locations);
    } else if (filteredLocations.length === 0) {
      // If no filtered locations, load the full locations list
      setFilteredLocations(locations);
    } else if (createRePayData.state === '') {
      // If state is an empty string, load full locations list
      setFilteredLocations(locations);
    }
  }, [
    locations,
    filteredLocations,
    createRePayData.state,
    searchValue,
    neighboring,
  ]);

  useEffect(() => {
    // Ensure the state is selected before proceeding
    if (createRePayData.state !== 'All' && createRePayData.state) {
      const geocoder = new window.google.maps.Geocoder();
      const selectedState = createRePayData.state; // Assuming `createRePayData.state` holds the selected state

      // Perform geocoding to get the coordinates and bounds for the selected state and update the map
      geocoder.geocode({ address: selectedState }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const stateLocation = results[0].geometry.location;
          const stateBounds = results[0].geometry.viewport;

          if (mapRef.current) {
            // Center the map on the selected state and fit it to the state's bounds
            setCenter({ lat: stateLocation.lat(), lng: stateLocation.lng() });
            mapRef.current.fitBounds(stateBounds); // This will zoom and center to show only the state
          }
        } else {
          console.log('Failed to find the state location.');
        }
      });
    }
  }, [createRePayData.state, locations]); // Listen for changes to the selected state

  useEffect(() => {
    if (createRePayData.state === '' || createRePayData.state === 'All') {
      if (mapRef.current && locations.length > 0) {
        const bounds = new google.maps.LatLngBounds();

        // Extend bounds to include all markers' positions
        locations.forEach((location) => {
          bounds.extend(new google.maps.LatLng(location.lat, location.lng));
        });

        // Fit the map to the computed bounds
        mapRef.current.fitBounds(bounds);

        // Listener to control zoom if bounds make the map zoom too far
        const listener = google.maps.event.addListener(
          mapRef.current,
          'bounds_changed',
          () => {
            const currentZoom = mapRef.current?.getZoom() ?? 0;
            if (currentZoom > 15) {
              mapRef.current?.setZoom(15); // Set the max zoom level to 15, adjust if needed
            }
            google.maps.event.removeListener(listener); // Remove the listener once the zoom is set
          }
        );
      }
    } else {
      // Logic for when a specific state is selected, e.g., zoom in on state or show markers in that state
      console.log('A specific state is selected:', createRePayData.state);
    }
  }, [locations, createRePayData.state]);

  useEffect(() => {
    // Update state and ref
    if (createRePayData.state !== 'All' && createRePayData.state) {
      setProjectCount(locations.length);
      projectCountRef.current = locations.length;
    } else if (searchValue) {
      setProjectCount(neighboring.length);
    } else {
      setProjectCount(filteredLocations.length);
      projectCountRef.current = filteredLocations.length;
    }
  }, [filteredLocations, createRePayData.state, locations]);

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      const bounds = new window.google.maps.LatLngBounds();

      const locationsToShow =
        filteredLocations.length > 0 ? filteredLocations : locations;

      if (locationsToShow.length > 0) {
        locationsToShow.forEach((location) => {
          bounds.extend({ lat: location.lat, lng: location.lng });
        });

        map.fitBounds(bounds);
      } else {
        map.setCenter({ lat: 25.5941, lng: 85.1376 });
        map.setZoom(5);
      }
    },
    [filteredLocations, locations, createRePayData.state]
  );

  console.log(searchedLocation, "searchloacesdtion")
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

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  console.log(filteredLocations, 'klkogjd');
  console.log(projectCount, 'projectcount');
  console.log(neighboring.length, 'negughtb');
  console.log(searchedLocation, 'searchloaction');

  return (
    <div className={styles.mapWrap}>
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <h3 className={styles.installMap}>Install Map</h3>
          <div className={styles.mapHeaderWrap}>
            <div className={styles.headerDropDowns}>
              <div className={styles.dropdownstate}>
                <SelectOption
                  options={[
                    { label: 'All State', value: 'All' }, // Default "All State" option
                    ...(availableStates(newFormData) || []), // Other states
                  ]}
                  onChange={handleChange} // Update createRePayData.state
                  value={
                    createRePayData.state // Dynamically show the selected state
                      ? (availableStates(newFormData) || []).find(
                        (option) => option.value === createRePayData.state
                      ) || { label: 'All State', value: 'All' } // Default to "All State" if no selection
                      : { label: 'All State', value: 'All' }
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

              <div className={styles.mapSearch}>
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      placeholder="Search for an address"
                      className={styles.inputsearch}
                      maxLength={100}
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement; // Type assertion to HTMLInputElement
                        input.value = input.value.replace(
                          /[^a-zA-Z0-9\s]/g,
                          ''
                        ); // Replace non-alphanumeric characters
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 2rem',
                      }}
                      onChange={handleInputChange}
                      value={searchValue}
                      disabled={isSearchDisabled} // Disable search when a state is selected
                    />
                    {searchValue && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchValue(''); // Clear the search value
                          setFilteredLocations(locations);
                          setSearchedLocation(null);
                          setSelectedMiles(10)// Reset to show all locations

                          if (mapRef.current) {
                            const bounds = new google.maps.LatLngBounds();

                            // Loop through all the locations and extend the bounds to include each marker's position
                            locations.forEach((location) => {
                              bounds.extend(
                                new google.maps.LatLng(
                                  location.lat,
                                  location.lng
                                )
                              );
                            });

                            // Adjust the map to fit the bounds of all markers
                            mapRef.current.fitBounds(bounds);
                          }
                        }}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <IoClose size={16} style={{ marginTop: '4px' }} />
                      </button>
                    )}
                    <RiMapPinLine className={styles.inputMap} />
                  </div>
                </Autocomplete>
              </div>
              {searchValue ? (
                <div className={styles.kmWrap}>
                  <SelectOption
                    options={[

                      ...milesOptions.map((mile) => ({
                        label: `${mile.miles} miles`,
                        value: mile.miles.toString(),
                      })),
                    ]}
                    onChange={(newValue) =>
                      newValue && handleMilesChange(newValue.value)
                    }
                    value={
                      {
                        value: selectedMiles,
                        label: `${selectedMiles} miles`,
                      }

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
                      color:
                        createRePayData.state === '' ? '#868686' : 'inherit',
                    }}
                    width="150px"
                  />
                </div>
              ) : null}
            </div>

            {/* Display total project count */}
            {projectCount > 0 ? (
              <div className={styles.projectCount}>
                <h3 className={styles.totalProjects}>Total Projects : </h3>
                <span className={styles.projectCountValue}>{projectCount}</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* <div className={styles.headerRight}>
          <div className={styles.mapClose} onClick={handleCalcClose}>
            <IoClose />
          </div>
        </div> */}
      </div>

      <div
        style={{
          width: '100%',
          height: '75vh',
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
                options={{
                  minZoom: 2, // Prevent zooming out too far
                  maxZoom: 20, // Set max zoom level
                }}
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

                {/* Searched location marker with different color */}
                <></>
                {searchedLocation && (
                  // <Marker
                  //   position={searchedLocation}
                  //   icon={{
                  //     path: 'M12 2C8.13 2 5 5.13 5 9c0 4.25 4.5 9.75 6.3 11.77.3.36.82.36 1.12 0C14.5 18.75 19 13.25 19 9c0-3.87-3.13-7-7-7zm0 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z',
                  //     fillColor: '#0D84F2', // color
                  //     fillOpacity: 1,
                  //     strokeColor: '#0059AC',
                  //     strokeWeight: 1, // No outline
                  //     scale: 2, // Scale to size
                  //     anchor: new google.maps.Point(12, 24), // Anchor at the bottom of the marker
                  //   }}
                  // />
                  <div>
                    <Marker
                      position={searchedLocation}
                      icon={{
                        path: 'M12 2C8.13 2 5 5.13 5 9c0 4.25 4.5 9.75 6.3 11.77.3.36.82.36 1.12 0C14.5 18.75 19 13.25 19 9c0-3.87-3.13-7-7-7zm0 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z', //Outer circle
                        fillColor: '#0D84F2', // Outer color
                        fillOpacity: 1,
                        strokeColor: '#0059AC',
                        strokeWeight: 1,
                        scale: 2,
                        anchor: new google.maps.Point(12, 24),
                      }}
                    />
                    <Marker
                      position={searchedLocation}
                      icon={{
                        path: 'M12 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', // Inner circle
                        fillColor: '#FFFFFF', // Inner circle color
                        fillOpacity: 1,
                        strokeColor: '#FFFFFF', // outline color of inner circle
                        strokeWeight: 1,
                        scale: 2,
                        anchor: new google.maps.Point(12, 21), // Adjust anchor for inner circle
                      }}
                    />
                  </div>

                )}

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
                {role === TYPE_OF_USER.ADMIN ? (
                  <>
                    <div className={styles.infoWinWrap}>
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
                        >
                          <div className={styles.infoWindow}>
                            <h3 className={styles.projectDetail}>
                              Project Details
                            </h3>
                            <div className={styles.infoWindowRow}>
                              <p className={styles.infoWindowLabel}>
                                Home Owner:
                              </p>
                              <p className={styles.infoWindowValue}>
                                {selectedLocation.home_owner}
                              </p>
                            </div>
                            <div className={styles.infoWindowRow}>
                              <p className={styles.infoWindowLabel}>
                                Unique ID:
                              </p>
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
                    </div>
                  </>
                ) : null}
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
