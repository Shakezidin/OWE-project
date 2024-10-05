import React, { useState, useEffect } from 'react';
import styles from './styles/customerlist.module.css';
import SortingDropDown from '../components/SortingDropdown/SortingDropDown';
import { ICONS } from '../../../resources/icons/Icons';
import { CiMail } from 'react-icons/ci';
import { BiPhone } from 'react-icons/bi';
import { TbChevronDown } from 'react-icons/tb';
import { CSSObjectWithLabel } from 'react-select';
import { IoLocationOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import MicroLoader from '../../components/loader/MicroLoader';
import DataNotFound from '../../components/loader/DataNotFound';
import DayPickerCalendar from '../components/ProgressCalendar/ProgressCalendar';
import { IoIosInformationCircle } from 'react-icons/io';
import { format } from 'date-fns';
import SelectOption from '../../components/selectOption/SelectOption';
import { CalendarIcon } from './components/Icons';
import useMatchMedia from '../../../hooks/useMatchMedia';
import { IoClose } from 'react-icons/io5';
interface ITimeSlot {
  id: number;
  time: string;
  uniqueId: number;
}
const Marker = ({
  text,
  lat,
  lng,
}: {
  text: string;
  lat: number;
  lng: number;
}) => <div>{text}</div>;

interface propTypes {
  mapStyles?: CSSObjectWithLabel;
}
export interface ICustomer {
  roof_type: string;
  home_owner: string;
  customer_email: string;
  customer_phone_number: string;
  system_size: string;
  address: string;
}
const customers = [
  {
    roof_type: 'XYZ Rooftype',
    home_owner: 'Jacob Martin',
    customer_email: 'Alexsimon322@gmail.com',
    customer_phone_number: '(831) 544-1235',
    system_size: '450 KW',
    address: '2443 Sierra Nevada Road, Mammoth Lakes CA 93546',
  },
  {
    roof_type: 'XYZ Rooftype',
    home_owner: 'Jacob Martin',
    customer_email: 'Alexsimon322@gmail.com',
    customer_phone_number: '(831) 544-1235',
    system_size: '450 KW',
    address: '2443 Sierra Nevada Road, Mammoth Lakes CA 93546',
  },
  {
    roof_type: 'XYZ Rooftype',
    home_owner: 'Jacob Martin',
    customer_email: 'Alexsimon322@gmail.com',
    customer_phone_number: '(831) 544-1235',
    system_size: '450 KW',
    address: '2443 Sierra Nevada Road, Mammoth Lakes CA 93546',
  },
  {
    roof_type: 'XYZ Rooftype',
    home_owner: 'Jacob Martin',
    customer_email: 'Alexsimon322@gmail.com',
    customer_phone_number: '(831) 544-1235',
    system_size: '450 KW',
    address: '2443 Sierra Nevada Road, Mammoth Lakes CA 93546',
  },
  {
    roof_type: 'XYZ Rooftype',
    home_owner: 'Jacob Martin',
    customer_email: 'Alexsimon322@gmail.com',
    customer_phone_number: '(831) 544-1235',
    system_size: '450 KW',
    address: '2443 Sierra Nevada Road, Mammoth Lakes CA 93546',
  },
  {
    roof_type: 'XYZ Rooftype',
    home_owner: 'Jon Jones',
    customer_email: 'Alexsimon322@gmail.com',
    customer_phone_number: '(831) 544-1235',
    system_size: '450 KW',
    address: '2443 Sierra Nevada Road, Mammoth Lakes CA 93546',
  },
];
const CustomersList = () => {
  const navigate = useNavigate();
  const [customer, setCustomers] = useState<ICustomer[]>(customers);
  const [selectedCustomer, setSelectedCustomer] = useState(-1);
  const [collapse, setCollapse] = useState(-1);
  const [isPending, setIsPending] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableSlots, setAvailableSlots] = useState<ITimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<ITimeSlot>();
  const [isSurveyScheduled, setIsSurveyScheduled] = useState(false);
  const [sortBy, setSortBy] = useState('New To Old');
  const isSmallScreen = useMatchMedia('(max-width:968px)');
  const isMobile = useMatchMedia('(max-width:450px)');
  const getCustomers = async () => {
    try {
      setIsPending(true);
      const data = await postCaller('scheduling_home', {
        page_number: page,
        page_size: 10,
        queue: 'priority',
        order: 'asc',
      });
      if (data.status > 201) {
        setIsPending(false);
        toast.error((data as Error).message as string);
        return;
      }
      setCustomers(data?.data?.scheduling_list || customers);
      setIsPending(false);
    } catch (error) {
      setIsPending(false);
      toast.error((error as Error).message as string);
    }
  };

  useEffect(() => {
    getCustomers();
  }, [page]);

  const handleAddClick = () => {
    navigate('/add-new-salesrep-schedule');
  };

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };
  const timeSlots = [
    { id: 1, time: '6:00 Am - 9:00 Am', uniqueId: 1 },
    { id: 7, time: '9:30 Am - 12:30 Pm', uniqueId: 2 },
    { id: 7, time: '1:00 Pm - 4:00 Pm', uniqueId: 3 },
    { id: 1, time: '4:30 Pm - 7:30 Pm', uniqueId: 4 },
    { id: 7, time: '8:00 Pm - 11:00 Pm', uniqueId: 5 },
  ];

  const dayWithProgress = [
    { id: 1, date: new Date(2024, 8, 20), progress: 75 },
    { id: 2, date: new Date(2024, 8, 23), progress: 35 },
    { id: 3, date: new Date(2024, 8, 24), progress: 70 },
    { id: 4, date: new Date(2024, 8, 25), progress: 63 },
    { id: 5, date: new Date(2024, 8, 26), progress: 79 },
    { id: 6, date: new Date(2024, 8, 27), progress: 20 },
    { id: 7, date: new Date(2024, 9, 1), progress: 95 },
  ];
  const sortOptions = [
    { label: 'New To Old', value: 'New To Old' },
    { label: 'Old To New', value: 'Old To New' },
  ];

  return (
    <div className={styles.schedule_page_wrapper}>
      <div
        className={`flex items-center justify-between ${styles.schedule_header}`}
      >
        <h1 className={styles.schedule_detail}>Schedule</h1>
        <button className={styles.calendar_btn_mobile}>
          <CalendarIcon />
        </button>
      </div>

      <div className={`flex justify-between  `}>
        <div
          className={` ${selectedCustomer === -1 ? styles.show_mobile : styles.hide_mobile} ${styles.customer_wrapper_list}`}
        >
          <div className={styles.sr_top}>
            <div className={styles.pending}>
              <>
                <div className={styles.notification}>
                  <span>25</span>
                </div>
                <h3>Pending Schedule</h3>
              </>
            </div>

            <div className={styles.filter}>
              <div className={styles.newproj}>
                <SelectOption
                  value={sortOptions.find((item) => item.value === sortBy)}
                  onChange={(e) => e && setSortBy(e.value)}
                  options={sortOptions}
                  controlStyles={{ marginTop: 0, minWidth: 100 }}
                />
              </div>
              <div className={styles.filtericon} onClick={handleAddClick}>
                <img src={ICONS.AddIconSr} alt="" />
              </div>
            </div>
          </div>

          <div className={` scrollbar ${styles.cust_det_list}`}>
            {isPending ? (
              <div className="flex items-center justify-center">
                <MicroLoader />
              </div>
            ) : !Boolean(customer.length) || !customer ? (
              <div className="flex items-center justify-center">
                <DataNotFound />
              </div>
            ) : (
              customer.map((customer, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedCustomer(index);
                    if (collapse !== selectedCustomer) {
                      setCollapse(-1);
                    }
                  }}
                  className={`${selectedCustomer === index ? `${styles.customer_details_selected} ${styles.open}` : styles.customer_details}  ${(isSmallScreen ? collapse === index : selectedCustomer === index) ? styles.selected_active_customer : ''} `}
                >
                  <div className={styles.cust_det_top}>
                    <div className={styles.cust_name}>
                      <div className={styles.name}>
                        <div
                          style={{ backgroundColor: '#FFEAEA' }}
                          className={styles.name_icon}
                        >
                          <span>
                            {customer.home_owner
                              .split(' ')
                              .map((name) => name[0]) 
                              .join('') 
                              .toUpperCase()}{' '}
                          </span>
                        </div>
                        {customer.home_owner}
                      </div>
                      <button
                        className={styles.accordian_btn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCollapse((prev) => (prev === index ? -1 : index));
                          if (selectedCustomer !== index && !isSmallScreen) {
                            setSelectedCustomer(index);
                          }
                        }}
                      >
                        <TbChevronDown
                          size={22}
                          style={{
                            transform:
                              (isSmallScreen || selectedCustomer === index) &&
                              collapse === index
                                ? 'rotate(180deg)'
                                : undefined,
                            transition: 'all 500ms',
                          }}
                        />
                      </button>
                    </div>
                    <div className={styles.parent_icon_and_content}>
                      {/* icon and content */}
                      <div
                        className={`${styles.cust_name} ${styles.icon_and_content}`}
                      >
                        <div className={styles.head_det}>
                          <div
                            // style={{
                            //   backgroundColor: '#E8FFE7',
                            //   color: '#8BC48A',
                            // }}
                            className={styles.name_icon}
                          >
                            <CiMail size={15} />
                          </div>
                          <span>{customer.customer_email}</span>
                        </div>
                      </div>

                      <div
                        className={`${styles.cust_name} ${styles.icon_and_content}`}
                      >
                        <div className={styles.head_det}>
                          <div className={styles.name_icon}>
                            <BiPhone
                              size={15}
                              style={{ transform: 'translateX(10px)' }}
                            />
                          </div>
                          <span>{customer.customer_phone_number}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {(isSmallScreen || selectedCustomer === index) &&
                    collapse === index && (
                      <div className={styles.cust_det_bot}>
                        {/* kilo Watt */}
                        <div
                          className={`${styles.grid_items} ${styles.grid_items}`}
                        >
                          <div className={styles.name_icon}>
                            <img
                              width={13}
                              src={ICONS.scheduleDoor}
                              alt="img"
                            />
                          </div>
                          <div className={styles.head_det}>
                            <span> {customer.system_size} </span>
                          </div>
                        </div>

                        {/* rooftype */}
                        <div
                          className={`${styles.grid_items} ${styles.rooftype_align}`}
                        >
                          <div className={styles.name_icon}>
                            <img
                              style={{ filter: 'brightness(10)' }}
                              src={ICONS.RoofType}
                              width={15}
                              alt="img"
                            />
                          </div>
                          <div className={styles.head_det}>
                            <span> {customer.roof_type} </span>
                          </div>
                        </div>

                        {/* address */}

                        <div className={`${styles.grid_items}`}>
                          <div className={styles.name_icon}>
                            <IoLocationOutline />
                          </div>
                          <div className={styles.head_det}>
                            <span>{customer.address}</span>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              ))
            )}
          </div>
        </div>

        <div
          className={` ${selectedCustomer > -1 ? styles.show_mobile : styles.hide_mobile} bg-white ${styles.calendar_wrapper}`}
        >
          {!isSurveyScheduled ? (
            <>
              <div className="flex items-center justify-between mb3">
                <h5 style={{ fontWeight: 500, fontSize: 16 }} className=" ml2">
                  Select Date & Time
                </h5>

                <button
                  onClick={() => {
                    setSelectedDate(undefined);
                    setSelectedTime(undefined);
                    setAvailableSlots([]);
                    setSelectedCustomer(-1);
                  }}
                  className={`${styles.calendar_close_btn_mobile} ml2`}
                >
                  <IoClose size={24} />
                </button>
              </div>
              <div
                className={`flex items-start ${styles.date_time_wrapper} ${selectedDate ? 'justify-between' : 'justify-center'}`}
              >
                <DayPickerCalendar
                  dayCellClassName={styles.day_cell}
                  circleSize={isMobile ? 44 : 50}
                  selectedDate={selectedDate}
                  onClick={(e) => {
                    setSelectedDate(e.date);

                    setSelectedTime(undefined);
                    setAvailableSlots([
                      ...timeSlots.filter((slot) => slot.id === e.event.id),
                    ]);
                  }}
                  dayWithProgress={dayWithProgress}
                />
                {selectedDate ? (
                  <div
                    className="flex flex-column  justify-center"
                    style={{ width: '100%' }}
                  >
                    <h5
                      className={`mb2 ${styles.time_slot_label}`}
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        textAlign: 'center',
                      }}
                    >
                      {' '}
                      Select time slot
                    </h5>
                    <div className={styles.time_slot_pill_wrapper}>
                      {!!availableSlots.length ? (
                        availableSlots.map((slot) => {
                          return (
                            <button
                              onClick={() => setSelectedTime(slot)}
                              key={slot.uniqueId}
                              className={`${styles.time_slot_pill} ${selectedTime?.uniqueId === slot.uniqueId ? styles.active_time_slot : styles.inactive_time_slot} `}
                            >
                              {slot.time}
                            </button>
                          );
                        })
                      ) : (
                        <h5>No Slot Available</h5>
                      )}
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
              {selectedTime && selectedDate && (
                <div className={styles.schedule_confirmation_wrapper}>
                  <div className="flex mb2 items-center justify-center">
                    <h5 className={styles.selected_time}>
                      {format(selectedDate, 'EEEE, dd MMM')} {selectedTime.time}{' '}
                    </h5>
                    <IoIosInformationCircle
                      className="ml1"
                      color="#1F2937"
                      size={17}
                    />
                  </div>
                  <button
                    onClick={() => setIsSurveyScheduled(true)}
                    className={`mx-auto ${styles.calendar_schedule_btn}`}
                  >
                    Submit
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              className="flex items-center flex-column justify-center"
              style={{ height: 'calc(100vh - 200px)' }}
            >
              <h3 className={styles.survey_success_message}>
                Site survey scheduled 👍
              </h3>
              <h5 className={styles.selected_time}>
                {selectedDate && format(selectedDate, 'EEEE, dd MMM')}{' '}
                {selectedTime?.time}{' '}
              </h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersList;
