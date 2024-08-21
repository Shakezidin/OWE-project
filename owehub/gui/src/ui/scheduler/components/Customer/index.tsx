import React, { memo, useState } from 'react';
import styles from './customer.module.css';
import { CiMail } from 'react-icons/ci';
import { BiPhone } from 'react-icons/bi';
import { TbChevronDown } from 'react-icons/tb';
import { LuClock } from 'react-icons/lu';
import GoogleMapReact from 'google-map-react';
import { IoLocationOutline } from 'react-icons/io5';
import roofIcon from '../../../../resources/assets/roof_top.svg';
import { CSSObjectWithLabel } from 'react-select';
import { ICONS } from '../../../../resources/icons/Icons';
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
  withSecondaryBtn?: boolean;
  mapStyles?: CSSObjectWithLabel;
}
const Index = ({ withSecondaryBtn = false, mapStyles = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };
  const key = process.env.REACT_APP_GOOGLE_KEY;
  console.log(key, 'key google');
  return (
    <div
      className={styles.customer_wrapper}
      style={{ maxHeight: isOpen ? 700 : 62 }}
    >
      <div className={`${styles.customer_grid}`}>
        <div className="flex items-center">
          <div
            className={` flex items-center justify-center ${styles.bg_name} ${styles.avatar_circle}`}
          >
            JM
          </div>

          <h3 className={` ml1 ${styles.customer_name}`}>James Martin</h3>
        </div>

        <div className="flex items-start">
          <div
            className={` flex items-center justify-center ${styles.bg_green} ${styles.avatar_circle}`}
          >
            <CiMail size={14} />
          </div>
          <div className="ml1">
            <h3 className={styles.customer_name}>Email</h3>
            <p className={styles.sm_text}>Jacob Martin322@gmail.com</p>
          </div>
        </div>

        <div className="flex items-start">
          <div
            className={` flex items-center justify-center ${styles.bg_phone} ${styles.avatar_circle}`}
          >
            <BiPhone size={14} />
          </div>

          <div className="ml1">
            <h3 className={styles.customer_name}>Phone Number</h3>
            <p className={styles.sm_text}>(831) 544 - 1235</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={styles.accordian_btn}
        >
          <TbChevronDown
            size={22}
            style={{
              transform: isOpen ? 'rotate(180deg)' : undefined,
              transition: 'all 500ms',
            }}
          />
        </button>
      </div>
      <div className="mt2">
        <div className={styles.other_info_grid}>
          <div className="flex items-start">
            <div
              className={` flex items-center justify-center ${styles.bg_phone} ${styles.avatar_circle}`}
            >
              <img src={ICONS.SystemSize} alt="" />
            </div>
            <div style={{ marginLeft: 6 }}>
              <h4
                style={{ fontSize: 14, fontWeight: 600, lineHeight: 'normal' }}
              >
                System Size
              </h4>
              <p className={styles.sm_text} style={{ fontSize: 12 }}>
                11
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div
              className={` flex items-center justify-center ${styles.bg_green} ${styles.avatar_circle}`}
            >
              <img src={roofIcon} alt="" />
            </div>
            <div className="ml1">
              <h3 className={styles.customer_name}>Roof Type</h3>
              <p className={styles.sm_text}>XYZ</p>
            </div>
          </div>
        </div>

        <div
          className={`flex  justify-between ${withSecondaryBtn ? 'items-end ' : 'mt1'}`}
        >
          <div
            style={{ flexBasis: 250 }}
            className=" flex justify-between flex-column"
          >
            {!withSecondaryBtn && (
              <div className="mt3">
                <h4
                  style={{
                    color: '#AFAFAF',
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 11,
                  }}
                >
                  Previous Appointment
                </h4>
                <h5 className={styles.appointment_status}>30 july 2024</h5>
                <span
                  className="block"
                  style={{ color: '#E54040', fontSize: 12 }}
                >
                  Cancelled
                </span>{' '}
              </div>
            )}
            <div className="flex items-center ">
              <button
                className={`${styles.primary_btn}  ${styles.schedule_btn}`}
              >
                Schedule
              </button>
              {withSecondaryBtn && (
                <button
                  style={{ marginLeft: 16 }}
                  className={`${styles.secondary_btn}  ${styles.schedule_btn}`}
                >
                  Escalate
                </button>
              )}
            </div>
          </div>

          <div>
            <div className={styles.map_wrapper} style={mapStyles}>
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: 'AIzaSyARz_js0ZPhw2zRvfcsj6SRc0NR19jWvmc',
                }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                yesIWantToUseGoogleMapApiInternals
              >
                <Marker lat={59.955413} lng={30.337844} text="My Marker" />
              </GoogleMapReact>
            </div>
            <div className="flex items-center mt1">
              <IoLocationOutline className="mr1" />
              <p className={styles.map_location}>
                103 backstreet, churchline, arizona,12544
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Index);
