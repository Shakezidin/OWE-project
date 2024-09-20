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
import { toZonedTime } from 'date-fns-tz';
import {
  endOfWeek,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  format,
} from 'date-fns';

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

interface LocationInfo {
  lat: any;
  lng: any;
  unique_id: string;
  home_owner: string;
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

  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<any | null>(null);
  const [center, setCenter] = useState({ lat: 25.5941, lng: 85.1376 }); // Set an initial center'
  // shams start
  const [expandedLeads, setExpandedLeads] = useState<string[]>([]);
  // const [selectedPeriod, setSelectedPeriod] = useState('This Week');
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

  const handleRangeChange = (ranges: any) => {
    setSelectedRanges([ranges.selection]);
  };

  const onReset = () => {
    setSelectedDates({ startDate: new Date(), endDate: new Date() });
    setIsCalendarOpen(false);
  };

  const onApply = () => {
    const startDate = selectedRanges[0].startDate;
    const endDate = selectedRanges[0].endDate;
    setSelectedDates({ startDate, endDate });
    setIsCalendarOpen(false);
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLabel = e.target.value;
    const selectedOption = periodFilterOptions.find(
      (option) => option.label === selectedLabel
    );
    if (selectedOption) {
      setSelectedDates({
        startDate: selectedOption.start,
        endDate: selectedOption.end,
      });
      setSelectedPeriod(selectedOption || null);
    } else {
      setSelectedDates({ startDate: null, endDate: null });
    }
  };

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dateRangeRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const [toggledId, setToggledId] = useState<string | null>(null);

  const toggleCalendar = () => {
    setIsCalendarOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event: Event) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node) &&
      toggleRef.current &&
      !toggleRef.current.contains(event.target as Node)
    ) {
      setIsCalendarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await postCaller('get_user_address', {
          start_date: selectedDates.startDate
            ? format(selectedDates.startDate, 'dd-MM-yyyy')
            : null,
          end_date: selectedDates.endDate
            ? format(selectedDates.endDate, 'dd-MM-yyyy')
            : null,
        });

        if (data.status > 201) {
          toast.error(data.message);
          return;
        }
        const formattedData: LocationInfo[] = data?.data?.map(
          (location: any) => ({
            lat: location.latitute, // Adjust to match your API response
            lng: location.lognitude, // Adjust to match your API response
            unique_id: location.unique_id || 'No info available', // Default info if not provided
            home_owner: location.home_owner,
          })
        );
        setLocations(formattedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedDates.startDate, selectedDates.endDate]);

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
    setSelectedLocation((prevLocation) =>
      prevLocation === location ? null : location
    );
  }, []);

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

  
  const periodFilterOptions: DateRangeWithLabel[] = [
    { label: 'This Week', start: startOfThisWeek, end: today },
    { label: 'Last Week', start: startOfLastWeek, end: endOfLastWeek },
    { label: 'This Month', start: startOfThisMonth, end: today },
    { label: 'Last Month', start: startOfLastMonth, end: endOfLastMonth },
    { label: 'This Quarter', start: startOfThreeMonthsAgo, end: today },
    { label: 'This Year', start: startOfThisYear, end: today },
  ];

  return (
    <div>
      <div className={styles.cardHeader}>
        <span className={styles.pipeline}>PipeLine</span>
        <div className={styles.date_calendar}>
          {isCalendarOpen && (
            <div ref={calendarRef} className={styles.lead__datepicker_content}>
              <DateRange
                editableDateInputs={true}
                onChange={handleRangeChange}
                moveRangeOnFirstSelection={false}
                ranges={selectedRanges}
              />
              <div className={styles.lead__datepicker_btns}>
                <button className="reset-calender" onClick={onReset}>
                  Reset
                </button>
                <button className="apply-calender" onClick={onApply}>
                  Apply
                </button>
              </div>
            </div>
          )}
          <div>
            {selectedDates.startDate && selectedDates.endDate && (
              <div className={styles.hist_date}>
                <span className={styles.date_display}>
                  {selectedDates.startDate.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {' - '}
                  {selectedDates.endDate.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
          <div className={styles.date_parent}>
            <select
              value={selectedPeriod?.label || ''}
              onChange={handlePeriodChange}
              className={styles.monthSelect}
            >
              {periodFilterOptions.map((option) => (
                <option key={option.label} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
            <div
              ref={toggleRef}
              className={styles.calender}
              onClick={toggleCalendar}
            >
              <img src={ICONS.includes_icon} alt="" />
            </div>
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
              onMouseOut={onMarkerLeave}
              options={{
                // pixelOffset: new window.google.maps.Size(0, -10),
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
              }}
            >
              <div className="flex flex-column pb2 pr2 items-center justify-center">
                <h4> Unique ID: {selectedLocation.unique_id}</h4>
                <p>Home Owner: {selectedLocation.home_owner}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MyMapComponent;
