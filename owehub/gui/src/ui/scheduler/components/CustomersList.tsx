import React, { memo, useState } from 'react';
import styles from '../styles/index.module.css';
import Customer from './Customer';
import SortingDropDown from './SortingDropdown/SortingDropDown';
const CustomersList = () => {
  const [active, setActive] = useState<'priority' | 'travel' | 'regular'>(
    'priority'
  );
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            role="button"
            className={`${styles.schedule_tab} ${active === 'priority' ? styles.active : ''} items-center flex `}
            onClick={() => setActive('priority')}
          >
            <div
              className={`${styles.schedule_stats}  flex items-center justify-center`}
            >
              14
            </div>
            <span>Priority</span>
          </div>

          <div
            role="button"
            className={`${styles.schedule_tab} ${active === 'travel' ? styles.active : ''} flex items-center`}
            onClick={() => setActive('travel')}
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
            className={`${styles.schedule_tab} ${active === 'regular' ? styles.active : ''} flex items-center`}
            onClick={() => setActive('regular')}
          >
            <div
              className={`${styles.schedule_stats} flex items-center justify-center`}
            >
              24
            </div>
            <span>Regular</span>
          </div>
        </div>
        <SortingDropDown />
      </div>

      <div style={{ marginTop: 15 }}>
        {active === 'priority' ? (
          <>
            <Customer />
            <Customer />
            <Customer />
            <Customer />
            <Customer />
            <Customer />
            <Customer />
            <Customer />
            <Customer />
            <Customer />
          </>
        ) : (
          <>
            <Customer withSecondaryBtn mapStyles={{ height: 100 }} />
            <Customer withSecondaryBtn />
            <Customer withSecondaryBtn />
            <Customer withSecondaryBtn />
            <Customer withSecondaryBtn />
            <Customer withSecondaryBtn />
            <Customer withSecondaryBtn />
            <Customer withSecondaryBtn />
            <Customer withSecondaryBtn />
            <Customer withSecondaryBtn />
          </>
        )}
      </div>
    </>
  );
};

export default memo(CustomersList);
