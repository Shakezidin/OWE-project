import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
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
  lat: any;
  lng: any;
  unique_id: string;
  home_owner: string;
  project_status: string;
}
export type DateRangeWithLabel = {
  label?: string;
  start: Date;
  end: Date;
};

const MyMapComponent: React.FC = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDestipqgaIX-VsZUuhDSGbNk_bKAV9dX0',
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
  const [searchValue, setSearchValue] = useState<string>('');

  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<any | null>(null);
  const [center, setCenter] = useState({ lat: 25.5941, lng: 85.1376 });

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

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dateRangeRef = useRef<HTMLDivElement>(null);
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
    searchValue,
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
  const [newFormData, setNewFormData] = useState({});
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

  console.log(newFormData);

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
  const handleSearchChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    }, 800),
    []
  );

  const onMapLoad = useCallback(
    (map: any) => {
      mapRef.current = map;
      if (locations.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        locations.forEach((location) => {
          bounds.extend({ lat: location.lat, lng: location.lng });
        });
        map.fitBounds(bounds);
      }
    },
    [locations]
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

  console.log(createRePayData.state, 'dhhfj');
  return (
    <div>
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <h3>Install Map</h3>
          <div className={styles.mapSearch}>
            <Input
              type="text"
              placeholder="Search for Unique ID or Name"
              value={search}
              className={styles.inputsearch}
              name="Search Here ...."
              onChange={(e) => {
                handleSearchChange(e);
                setSearch(e.target.value);
              }}
            />
          </div>
          <div className={styles.dropdownselect}>
            <span>State:</span>
            <div className={styles.dropdownstate}>
              <SelectOption
                options={stateOption(newFormData)}
                onChange={(newValue) => handleChange(newValue, 'state')}
                value={stateOption(newFormData)?.find(
                  (option) => option.value === createRePayData.state
                )}
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
          height: '100vh',
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
                {locations.map((location, index) => (
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
