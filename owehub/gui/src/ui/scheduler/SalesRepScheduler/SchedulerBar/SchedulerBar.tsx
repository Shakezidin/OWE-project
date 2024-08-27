import React, { useState } from 'react'
import styles from '../styles/schedule.module.css';
import Pagination from '../../../components/pagination/Pagination';


interface Shift {
  day: string;
  date: string;
}

const SchedulerBar = () => {
  const [selectedButton, setSelectedButton] = useState('');

  const handleButtonClick = (buttonName: any) => {
    setSelectedButton(buttonName);
  };
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const dummyData: Shift[] = [
    { day: 'Mon', date: '28' },
    { day: 'Tue', date: '29' },
    { day: 'Wed', date: '30' },
    { day: 'Thr', date: '31' },
    { day: 'Fri', date: '1' },
    { day: 'Sat', date: '2' },
    { day: 'Sun', date: '3' },
  ];

  const handleShiftClick = (shift: Shift) => {
    setSelectedShift(shift);
  };

  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const timeOptions: string[] = ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM',];

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <div>
      <div className={styles.top_sec}>
        <div>
          <h1 className={styles.schedule_detail}>Schedule</h1>
          <div className="flex items-center">
            <h5 style={{ fontSize: 12 }} className={styles.primary_heading}>
              Availablity {`>`}{' '}
            </h5>
            <span className="ml1" style={{ fontSize: 12 }}>
              {' '}
              Schedule{' '}
            </span>
          </div>
        </div>

        <div className={styles.avail}>
          <button
            className={`${styles.time_range} ${selectedButton === 'All time slots' ? styles.selected : ''}`}
            onClick={() => handleButtonClick('All time slots')}
          >
            All time slots
          </button>
          <button
            className={`${styles.time_range} ${selectedButton === '6 AM - 9 AM' ? styles.selected : ''}`}
            onClick={() => handleButtonClick('6 AM - 9 AM')}
          >
            6 AM - 9 AM
          </button>
          <button
            className={`${styles.time_range} ${selectedButton === '9 AM - 12 PM' ? styles.selected : ''}`}
            onClick={() => handleButtonClick('9 AM - 12 PM')}
          >
            9 AM - 12 PM
          </button>
          <button
            className={`${styles.time_range} ${selectedButton === '12 PM - 3 PM' ? styles.selected : ''}`}
            onClick={() => handleButtonClick('12 PM - 3 PM')}
          >
            12 PM - 3 PM
          </button>
          <button
            className={`${styles.time_range} ${selectedButton === '3 PM - 6 PM' ? styles.selected : ''}`}
            onClick={() => handleButtonClick('3 PM - 6 PM')}
          >
            3 PM - 6 PM
          </button>
          <div className={styles.percent_status}>
            <span>45%</span>
            <p>Available</p>
          </div>
        </div>
      </div>

      <div className={`flex justify-between mt2 ${styles.h_screen}`}>
        <div className={styles.customer_wrapper_list}>
          <div>
            <div>
              <div className={styles.dayselect}>
                {dummyData.map((shift, index) => (
                  <div
                    key={index}
                    className={`${styles.shift} ${selectedShift && selectedShift.day === shift.day ? styles.selected : ''
                      }`}
                    onClick={() => handleShiftClick(shift)}
                  >
                    <div className={styles.selectedday}>{shift.day}</div>
                    <div className={styles.selecteddate}>{shift.date}</div>
                  </div>
                ))}
              </div>
              <div className={styles.tstop}>
                <h2>Surveyor</h2>
                <div className={styles.timeselect}>
                  {timeOptions.map((time, index) => (
                    <div
                      key={index}
                      className={`${styles.time} ${time === '6 AM' || time === '6 PM' ? styles.specialColor : ''
                        }`}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            </div>


            <div className={styles.progressbar}>

              <div className={styles.surveyor_name}>Person 1</div>

              <div className={styles.progress_wrapper}>
                <div className={styles.progress_bar}>
                  <div
                    style={{
                      gridColumn: `${9 + 1}/${6 + 1}`,
                      gridTemplateColumns: `repeat(${1 * 2},1fr)`,
                    }}
                    className={` relative ${styles.bg_available_slot}`}
                  >
                    <div
                      className={`relative ${styles.half_hour_span_wrapper} }`}
                    >
                      <div
                        data-time-available={true}
                        className={
                          styles.half_hour_span
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.progressbar}>

              <div className={styles.surveyor_name}>Person 2</div>

              <div className={styles.progress_wrapper}>
                <div className={styles.progress_bar}>
                  <div
                    style={{
                      gridColumn: `${7 + 1}/${3 + 1}`,
                      gridTemplateColumns: `repeat(${1 * 2},1fr)`,
                    }}
                    className={` relative ${styles.bg_available_slot}`}
                  >
                    <div
                      className={`relative ${styles.half_hour_span_wrapper} }`}
                    >
                      <div
                        data-time-available={true}
                        className={
                          styles.half_hour_span
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.progressbar}>

              <div className={styles.surveyor_name}>Person 3</div>

              <div className={styles.progress_wrapper}>
                <div className={styles.progress_bar}>
                  <div
                    style={{
                      gridColumn: `${16 + 1}/${12 + 1}`,
                      gridTemplateColumns: `repeat(${5 * 2},1fr)`,
                    }}
                    className={` relative ${styles.bg_available_slot}`}
                  >
                    <div
                      className={`relative ${styles.half_hour_span_wrapper} }`}
                    >
                      <div
                        data-time-available={true}
                        className={
                          styles.half_hour_span
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>



            <div className={styles.progressbar}>

              <div className={styles.surveyor_name}>Person 4</div>

              <div className={styles.progress_wrapper}>
                <div className={styles.progress_bar}>
                  <div
                    style={{
                      gridColumn: `${11 + 1}/${8 + 1}`,
                      gridTemplateColumns: `repeat(${1 * 2},1fr)`,
                    }}
                    className={` relative ${styles.bg_available_slot}`}
                  >
                    <div
                      className={`relative ${styles.half_hour_span_wrapper} }`}
                    >
                      <div
                        data-time-available={true}
                        className={
                          styles.half_hour_span
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
           

            <div className={styles.progressbar}>

              <div className={styles.surveyor_name}>Person 5</div>

              <div className={styles.progress_wrapper}>
                <div className={styles.progress_bar}>
                  <div
                    style={{
                      gridColumn: `${7 + 1}/${5 + 1}`,
                      gridTemplateColumns: `repeat(${5 * 2},1fr)`,
                    }}
                    className={` relative ${styles.bg_available_slot}`}
                  >
                    <div
                      className={`relative ${styles.half_hour_span_wrapper} }`}
                    >
                      <div
                        data-time-available={true}
                        className={
                          styles.half_hour_span
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="page-heading-container">
              <p className="page-heading">1 - 10 of 50 item</p>

              <Pagination
                currentPage={1}
                totalPages={12} // You need to calculate total pages
                paginate={(num) => num}
                currentPageData={[]}
                goToNextPage={() => 0}
                goToPrevPage={() => 0}
                perPage={10}
              />
            </div>
          </div>
        </div>

      </div>
    </div>

  )
}

export default SchedulerBar
