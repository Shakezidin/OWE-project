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
import { toast } from 'react-toastify';
import { DateRange } from 'react-date-range';
import styles from './styles/mymap.module.css';
import { ICONS } from '../../../../resources/icons/Icons';
import MicroLoader from '../../../components/loader/MicroLoader';
import { toZonedTime } from 'date-fns-tz';
import { IoIosSearch } from 'react-icons/io';
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

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await postCaller('get_user_address', {
          // start_date: selectedDates.startDate
          //   ? format(selectedDates.startDate, 'dd-MM-yyyy')
          //   : null,
          // end_date: selectedDates.endDate
          //   ? format(selectedDates.endDate, 'dd-MM-yyyy')
          //   : null,
          unique_ids: [searchValue],
        });

        if (data.status > 201) {
          toast.error(data.message);
          return;
        }
        const formattedData: LocationInfo[] = data?.data
          ?.filter(
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
  }, [selectedDates.startDate, selectedDates.endDate, searchValue]);

  const debouncedSetSelectedLocation = useCallback(
    debounce((location: LocationInfo | null) => {
      setSelectedLocation(location);
    }, 100),
    []
  );

  const handleCalcClose = () => {
    navigate(-1);
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

  return (
    <div>
      <div className={styles.cardHeader}>
        <span className={styles.pipeline}>Install Map</span>

        <div className={styles.mapClose} onClick={handleCalcClose} >
          <IoClose />
        </div>
      </div>

      <div className={styles.mapHeader2}>
        <div className={styles.date_calendar}>
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
            {' '}
            <MicroLoader />
          </div>
        ) : (
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
                  // Continuously try to hide the close button after DOM is ready
                  const interval = setInterval(() => {
                    const closeButton = document.querySelector('.gm-ui-hover-effect') as HTMLElement;
                    if (closeButton) {
                      closeButton.style.display = 'none';
                      clearInterval(interval); // Stop checking once the button is hidden
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
                    <p className={styles.infoWindowLabel}>Project Status:</p>
                    <p className={styles.infoWindowValue}>
                      {selectedLocation.project_status}
                    </p>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default MyMapComponent;
