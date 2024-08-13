import React, { useState } from 'react';
import styles from './styles/index.module.css';
import SelectOption from '../../components/selectOption/SelectOption';
import { LuRefreshCcw } from 'react-icons/lu';
import { addDays, format } from 'date-fns';
import { RiFilterLine } from 'react-icons/ri';
import { generateTimeArray } from '../../../utiles';
const current = new Date();
interface IOptions {
  label: string;
  value: string;
}
const arr = [
  current,
  addDays(current, 1),
  addDays(current, 2),
  addDays(current, 3),
  addDays(current, 4),
  addDays(current, 5),
  addDays(current, 6),
];

const timeSlots = generateTimeArray('8:00 AM', '6:00 PM').map((item) => ({
  label: item,
  value: item,
}));

const Index = () => {
  const [activeDate, setActiveDate] = useState(arr[0]);
  const [endTimeOptions, setEndTimeOptions] = useState([...timeSlots]);
  const [startTime, setStartTime] = useState<IOptions>(timeSlots[0]);
  const [endTime, setEndTime] = useState<IOptions | undefined>(
    timeSlots[timeSlots.length - 1]
  );

  const handleTimeChange = (val: IOptions | null, type: 'start' | 'end') => {
    if (type === 'start' && val) {
      setEndTimeOptions([
        ...timeSlots.filter((item) => item.value !== val?.value),
      ]);
      setStartTime({ ...val });
      setEndTime(undefined);
    } else {
      setEndTime(val!);
    }
  };
  // const filteredTime = timeSlots.filter((item) => !item.value.includes(':30'));
 
  return (
    <>
      <div className="flex items-end justify-between">
        <div className="">
          <h4 className={styles.detail_heading}>Schedule</h4>
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

        <div className="flex " style={{ gap: 15 }}>
          <SelectOption
            dropdownIndicatorStyles={{ display: 'none' }}
            width="157px"
            options={timeSlots}
            value={startTime}
            onChange={(e) => handleTimeChange(e, 'start')}
            optionStyles={{
              '&:hover': {
                backgroundColor: '#fff ',
                color: '#377CF6',
              },
              background: '#fff',
              color: '#000',
            }}
            controlStyles={{ marginTop: 0 }}
            singleValueStyles={{ color: '#000000', fontWeight: 600 }}
          />

          <SelectOption
            dropdownIndicatorStyles={{ display: 'none' }}
            width="157px"
            options={endTimeOptions}
            value={endTime}
            onChange={(e) => handleTimeChange(e, 'end')}
            optionStyles={{
              '&:hover': {
                backgroundColor: '#fff ',
                color: '#377CF6',
              },
              background: '#fff',
              color: '#000',
            }}
            controlStyles={{ marginTop: 0 }}
            singleValueStyles={{ color: '#000000', fontWeight: 600 }}
          />

          <button className={styles.refresh_btn}>
            <LuRefreshCcw size={22} color="#377CF6" />
          </button>

          <div
            className={` flex relative items-center  ${styles.available_slot_wrapper}`}
          >
            <span className={styles.top_overlay}>35%</span>
            <span className={` pl1 ${styles.top_overlay}`}>Available</span>
            <div className={styles.bg_available_progress} />
          </div>
        </div>
      </div>

      <div className="mt3">
        <div className={styles.survery_users_container}>
          <div className={`${styles.suvery_grid_wrapper}`}>
            <div
              className={` flex items-end justify-center  ${styles.surver_filter}`}
            >
              <div className="flex items-center">
                <h5 style={{ color: '#377CF6' }}>Surveyor</h5>
                <button
                  className={` flex ml2 items-center justify-center ${styles.filter_btn}`}
                >
                  {' '}
                  <RiFilterLine color="#377CF6" size={16} />{' '}
                </button>
              </div>
            </div>

            <div className={styles.date_wrapper}>
              <div className={`px3 py1 ${styles.date_grid_container}`}>
                {arr.map((item, ind) => {
                  return (
                    <div className="date_container" key={ind}>
                      <div
                        style={{ width: 'fit-content' }}
                        className={`mx-auto  ${item === activeDate ? styles.active_date : ''}`}
                      >
                        <span style={{ fontSize: 18, fontWeight: 500 }}>
                          {' '}
                          {format(item, 'EEEE').slice(0, 3)}{' '}
                        </span>
                        <span
                          style={{ fontSize: 20, fontWeight: 600 }}
                          className="block text-center"
                        >
                          {' '}
                          {format(item, 'dd')}{' '}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px1 mt2">
                <div
                  className={`py1 px2 ${styles.time_slot_wrapper}`}
                  style={{ background: '#F2F4F6' }}
                >
                  {timeSlots.map((time, ind) => {
                    return <div key={ind}> {time.value} </div>;
                  })}
                </div>
              </div>
            </div>
          </div>
<div>

          <div className={styles.survey_progress_container}>

          </div>
</div>
        </div>
      </div>
    </>
  );
};

export default Index;
