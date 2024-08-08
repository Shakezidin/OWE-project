import React from 'react';
import styles from '../styles/index.module.css';
import { PiSortAscendingLight } from 'react-icons/pi';
import Customer from './Customer';
const CustomersList = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            role="button"
            className={`${styles.schedule_tab} ${styles.active} items-center flex `}
          >
            <div
              className={`${styles.schedule_stats} flex items-center justify-center`}
            >
              14
            </div>
            <span>Priority</span>
          </div>

          <div
            role="button"
            className={`${styles.schedule_tab} flex items-center`}
          >
            <div
              className={`${styles.schedule_stats} flex items-center justify-center`}
            >
              24
            </div>
            <span>Travel</span>
          </div>

          <div
            role="button"
            className={`${styles.schedule_tab} flex items-center`}
          >
            <div
              className={`${styles.schedule_stats} flex items-center justify-center`}
            >
              24
            </div>
            <span>Regular</span>
          </div>
        </div>

        <button
          className={`flex items-center justify-center  ${styles.sort_btn}`}
        >
          <PiSortAscendingLight size={26} />
        </button>
      </div>

      <div style={{ marginTop: 15 }}>
        <Customer />
      </div>
    </>
  );
};

export default CustomersList;
