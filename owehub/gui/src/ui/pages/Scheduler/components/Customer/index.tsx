import React from 'react';
import styles from './customer.module.css';
import { CiMail } from 'react-icons/ci';
import { BiPhone } from 'react-icons/bi';
import { TbChevronDown } from 'react-icons/tb';
import { LuClock } from 'react-icons/lu';
import { EmailIcon } from '../../icons';
import { IoClose } from 'react-icons/io5';
const Index = () => {
  return (
    <div className={styles.customer_wrapper}>
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

        <button className={styles.accordian_btn}>
          <TbChevronDown size={22} />
        </button>
      </div>
      <div className="mt2">
        <div className="flex items-center">
          <div
            className={`${styles.avatar_circle} ${styles.bg_time} flex items-center justify-center`}
          >
            <LuClock />
          </div>
          <div style={{ marginLeft: 6 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, lineHeight: 'normal' }}>
              9:00AM - 12:00 PM, 29 July, Monday
            </h4>
            <p className={styles.sm_text} style={{ fontSize: 12 }}>
              Customer preferred time
            </p>
          </div>
        </div>
        <div className="mt2">
          <div className="flex items-center justify-between">
            <div>
              <h4 style={{ color: '#AFAFAF', fontSize: 14, fontWeight: 600 }}>
                Previous Appointment
              </h4>

              <h5
                className={styles.appointment_status}
                style={{ marginTop: 4 }}
              >
                30 july 2024 :{' '}
                <span style={{ color: '#E54040' }}>Cancelled</span>{' '}
              </h5>
            </div>
          </div>

          <div className="mt3">
            <h4>History</h4>
            <div className={styles.appointment_status_wrapper}>
              <div
                className={`flex items-start mb3 ${styles.appointment_status_container}`}
              >
                <div
                  style={{ width: 30, height: 30 }}
                  className={` flex items-center justify-center ${styles.bg_stone} ${styles.avatar_circle}`}
                >
                  <EmailIcon />
                </div>
                <div className="ml1">
                  <h3 className={styles.customer_name}>
                    Appointment Sent on : 24 July 2024
                  </h3>
                  <p className={styles.sm_text} style={{ fontSize: 12 }}>
                    Invitation sent to owner by email{' '}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-start mb3 ${styles.appointment_status_container}`}
              >
                <div
                  style={{ width: 30, height: 30, borderRadius: '50%' }}
                  className=" flex items-center justify-center"
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      backgroundColor: '#F3F3F3',
                    }}
                    className={` flex items-center justify-center ${styles.bg_stone} ${styles.avatar_circle}`}
                  >
                    <IoClose size={12} />
                  </div>
                </div>
                <div className="ml1">
                  <h3 className={styles.customer_name}>
                    Appointment Declined : 26 July 2024
                  </h3>
                  <p className={styles.sm_text} style={{ fontSize: 12 }}>
                    Scheduled Cancel By Owner
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button className={styles.schedule_btn}>Schedule</button>
        </div>
      </div>
    </div>
  );
};

export default Index;
