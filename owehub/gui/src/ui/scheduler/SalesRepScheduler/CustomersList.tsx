import React, { useState, useEffect } from 'react';
import styles from './styles/customerlist.module.css';
import SortingDropDown from '../components/SortingDropdown/SortingDropDown';
import { ICONS } from '../../../resources/icons/Icons';
import { CiMail } from 'react-icons/ci';
import { BiPhone } from 'react-icons/bi';
import { TbChevronDown } from 'react-icons/tb';
import GoogleMapReact from 'google-map-react';
import { CSSObjectWithLabel } from 'react-select';
import { IoLocationOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import MicroLoader from '../../components/loader/MicroLoader';
import DataNotFound from '../../components/loader/DataNotFound';
import SchedulerCalendar from '../components/SchedulerCalendar/SchedulerCalendar';

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
];
const CustomersList = ({ mapStyles = {} }) => {
  const navigate = useNavigate();
  const [openStates, setOpenStates] = useState<{ [key: number]: boolean }>({});
  const [customer, setCustomers] = useState<ICustomer[]>(customers);
  const [isPending, setIsPending] = useState(true);
  const [page, setPage] = useState(1);

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

  const toggleOpen = (index: number) => {
    setOpenStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };

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

  return (
    <>
      <div>
        <h1 className={styles.schedule_detail}>Schedule</h1>
        <div className="flex items-center">
          <h5 style={{ fontSize: 12 }} className={styles.primary_heading}>
            Customer Queue {`>`}{' '}
          </h5>
          <span className="ml1" style={{ fontSize: 12 }}>
            {' '}
            Schedule{' '}
          </span>
        </div>
      </div>
      <div className={`flex justify-between mt2 ${styles.h_screen}`}>
        <div className={styles.customer_wrapper_list}>
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
                <SortingDropDown />
              </div>
              <div className={styles.filtericon} onClick={handleAddClick}>
                <img src={ICONS.AddIconSr} alt="" />
              </div>
            </div>
          </div>

          <div className={styles.cust_det_list}>
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
                  className={`${styles.customer_details} ${openStates[index] ? styles.open : ''}`}
                >
                  <div className={styles.cust_det_top}>
                    <div className={styles.cust_name}>
                      <div className={styles.name}>
                        <div
                          style={{ backgroundColor: '#FFEAEA' }}
                          className={styles.name_icon}
                        >
                          <span>
                            {customer.home_owner.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        {customer.home_owner}
                      </div>
                      <button
                        className={styles.accordian_btn}
                        onClick={() => toggleOpen(index)}
                      >
                        <TbChevronDown
                          size={22}
                          style={{
                            transform: openStates[index]
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
                            <CiMail size={14} />
                          </div>
                          <span>{customer.customer_email}</span>
                        </div>
                      </div>

                      <div
                        className={`${styles.cust_name} ${styles.icon_and_content}`}
                      >
                        <div className={styles.head_det}>
                          <div
                            // style={{
                            //   backgroundColor: '#EEEBFF',
                            //   color: '#8E81E0',
                            // }}
                            className={styles.name_icon}
                          >
                            <BiPhone size={14} />
                          </div>
                          <span>{customer.customer_phone_number}</span>
                        </div>
                      </div>
                      {/* icon and content */}
                    </div>
                  </div>
                  {openStates[index] && (
                    <div className={styles.cust_det_bot}>
                      {/* kilo Watt */}
                      <div
                        className={`${styles.grid_items} ${styles.grid_items}`}
                      >
                        <div
                          // style={{
                          //   backgroundColor: '#EEEBFF',
                          //   color: '#8E81E0',
                          // }}
                          className={styles.name_icon}
                        >
                          <img src={ICONS.SystemSize} alt="img" />
                        </div>
                        <div className={styles.head_det}>
                          <span> {customer.system_size} </span>
                        </div>
                      </div>

                      {/* rooftype */}
                      <div
                        className={`${styles.grid_items} ${styles.rooftype_align}`}
                      >
                        <div
                          // style={{
                          //   backgroundColor: '#E8FFE7',
                          //   color: '#8E81E0',
                          // }}
                          className={styles.name_icon}
                        >
                          <img src={ICONS.RoofType} alt="img" />
                        </div>
                        <div className={styles.head_det}>
                          <span> {customer.roof_type} </span>
                        </div>
                      </div>

                      {/* address */}

                      <div className={`${styles.grid_items}`}>
                        <div
                          // style={{
                          //   backgroundColor: '#EEEBFF',
                          //   color: '#8E81E0',
                          // }}
                          className={styles.name_icon}
                        >
                          <IoLocationOutline />
                        </div>
                        <div className={styles.head_det}>
                          <h2>{customer.address}</h2>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <SchedulerCalendar />
      </div>
    </>
  );
};

export default CustomersList;
