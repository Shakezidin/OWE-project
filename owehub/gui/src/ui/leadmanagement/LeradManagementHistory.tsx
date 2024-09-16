import React, { useEffect, useRef, useState } from 'react';
import styles from './styles/lmhistory.module.css';
import { ICONS } from '../../resources/icons/Icons';
import SortingDropDown from './components/SortingDropDown';
import { useNavigate } from 'react-router-dom';
import LeadCalender from './components/Calender';
import Pagination from '../components/pagination/Pagination';
import useMatchMedia from '../../hooks/useMatchMedia';
import Select from 'react-select';

interface LeadCalendarProps {
  onDateSelect: (date: Date | null) => void;
}


const LeradManagementHistory = () => {
  const navigate = useNavigate();
  const [see, setSee] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const startIndex = (page - 1) * 10 + 1;
  const endIndex = page * 10;
  const totalPage = Math.ceil(totalCount / 10);
  const [isChecked, setIsChecked] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleCrossClick = () => {
    setIsChecked(false);
    setCheckedCount(0);
  };

  const handlesee = () => {
    setSee(!see);
  };
  const handleDateSelect = (date: any) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
  };

  const options1 = [
    { value: 'today', label: 'Table 1 Data' },
    { value: 'this_week', label: 'Table 2 Data' },
    { value: 'all', label: 'Table 3 Data' },
  ];


  const handleCross = () => {
    navigate('/leadmng-dashboard');
  };

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const toggleCalendar = () => {
    setIsCalendarOpen((prevState) => !prevState);
  };

  const handleCheckboxChange = (event: any) => {
    if (event.target.checked) {
      setCheckedCount((prevCount) => prevCount + 1);
    } else {
      setCheckedCount((prevCount) => prevCount - 1);
    }
    setIsChecked(event.target.checked);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
      setIsCalendarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isMobile = useMatchMedia('(max-width: 767px)');



  return (
    <div className={`flex justify-between mt2 ${styles.h_screen}`}>
      <div className={styles.customer_wrapper_list}>
        <div className={styles.lm_history_header}>
          {(checkedCount == 0 &&
            <h1>History</h1>
          )}
          {(checkedCount != 0 &&
            <div className={styles.hist_checkbox_count}>
              <img src={ICONS.cross} alt='' height={28} width={28} style={{ cursor: 'pointer' }} onClick={handleCrossClick} />
              <h1>{checkedCount} Selected</h1>
            </div>
          )}
          {(!isChecked &&
            <div className={styles.filters}>
              {isCalendarOpen && (
                <div ref={calendarRef}>
                  <LeadCalender onDateSelect={handleDateSelect} setIsCalendarOpen={setIsCalendarOpen} />
                </div>
              )}

              <div className={styles.hist_date}>{selectedDate && <p>{selectedDate.toLocaleString('default', { month: 'short', year: 'numeric' })}</p>}</div>
              {/* <Select
                options={options1}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    marginTop: 'px',
                    borderRadius: '16px',
                    outline: 'none',
                    color: 'white',
                    width: 'fit-content',
                    height: '28px',
                    fontSize: '12px',
                    border: '1px solid #d0d5dd',
                    fontWeight: '500',
                    cursor: 'pointer',
                    alignContent: 'center',
                    backgroundColor: '#377CF6',
                    boxShadow: 'none',
                  }),
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    color: '#292929',
                  }),
                  indicatorSeparator: () => ({
                    display: 'none',
                  }),
                  dropdownIndicator: (baseStyles, state) => ({
                    ...baseStyles,
                    color: '#ffffff',
                    '&:hover': {
                      color: '#ffffff',
                    },
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    fontSize: '13px',
                    color: state.isSelected ? '#ffffff' : '#ffffff',
                    backgroundColor: state.isSelected ? '#377CF6' : '#377CF6',
                    '&:hover': {
                      backgroundColor: state.isSelected ? '#0493CE' : '#DDEBFF',
                    },
                    cursor: 'pointer',
                  }),
                  singleValue: (baseStyles, state) => ({
                    ...baseStyles,
                    color: '#292929',
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    width: '150px',
                  }),
                }}
              /> */}
              <div className={styles.calender} onClick={toggleCalendar}>
                <img src={ICONS.includes_icon} alt="" />
              </div>
              <div className={styles.sort_drop}>
                <SortingDropDown />
              </div>

              <div className={styles.calender}>
                <img src={ICONS.LeadMngExport} style={{ marginTop: "-2px" }} alt="" height={22} width={22} />
              </div>

              <div className={styles.hist_ret} onClick={handleCross}>
                <img
                  src={ICONS.cross}
                  alt=""
                  height="26" width="26"
                />
              </div>
            </div>
          )}
          {(isChecked &&
            <div className={styles.lead_his_remove}>Remove</div>
          )}
        </div>

        <div className={styles.history_list}>
          <div style={see ? { width: "100%", backgroundColor: '#EEF5FF', borderTopLeftRadius: "8px", borderTopRightRadius: "8px" } : {}} className={styles.history_lists}>
            <div className={styles.history_list_inner}>
              <div className={styles.hist_checkname}>
                <label>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    style={{
                      width: '16.42px',
                      height: '16px',
                      gap: '0px',
                      borderRadius: '16px',
                      border: '1px solid #797979',
                    }}
                  />
                </label>
                <div className={styles.user_name}>
                  <h2>Sanju samson</h2>
                  <p>Appointment Sent</p>
                </div>
              </div>

              {(!isMobile &&
                <>
                  <div className={styles.phone_number}>+1 82-26-2356445</div>
                  <div className={styles.email}>
                    <p>sanjusamson19@gmail.com</p>
                    <img height={15} width={15} src={ICONS.complete} alt="img" />
                  </div>
                  <div className={styles.address}>
                    12778 Domingo Ct, Parker, Arizona .CO 12312
                  </div>
                </>
              )}


              <div className={styles.see_more} onClick={handlesee}>
                <p>{see ? 'See Less' : 'See More'}</p>
                <img src={ICONS.SeeMore} alt="img" style={{ transform: see ? 'rotate(180deg)' : 'none' }} />
              </div>
            </div>
            {!isMobile && see && (
              <>
                <div style={{ padding: "0px 12px" }}>
                  <div style={{ backgroundColor: "#fff" }} className={styles.history_list_activity}>
                    <div className={styles.history_list_head}>Activity</div>

                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.line1}></div>
                        <div className={styles.circle}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>Appointment Schedule</div>
                        <div className={styles.act_date}>27 Aug, 2024</div>
                      </div>
                    </div>
                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.circle}></div>
                        <div className={styles.line}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>Appointment Schedule</div>
                        <div className={styles.act_date}>27 Aug, 2024</div>
                      </div>
                    </div>

                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.circle}></div>
                        <div className={styles.line}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>Appointment Accepted</div>
                        <div className={styles.act_date}>29 Aug, 2024</div>
                      </div>
                    </div>

                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.circle}></div>
                        <div className={styles.line}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>Appointment Date</div>
                        <div className={styles.act_date}>30 Aug, 2024</div>
                      </div>
                    </div>

                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.circle}></div>
                        <div className={styles.line}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>Deal Won</div>
                        <div className={styles.act_date}>1 Sep, 2024</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {isMobile && see && (
              <>
                <div className={styles.personal_info_mob}>
                  <div className={styles.phone_number}>+1 82-26-2356445</div>
                  <div className={styles.email}>
                    <p>sanjusamson19@gmail.com</p>
                    <img height={15} width={15} src={ICONS.complete} alt="img" />
                  </div>
                  <div className={styles.address}>
                    12778 Domingo Ct, Parker, Arizona .CO 12312
                  </div>
                </div>

                <div style={{ padding: "0px 12px" }}>
                  <div style={{ backgroundColor: "#fff" }} className={styles.history_list_activity_mob}>
                    <div className={styles.history_list_head}>Activity</div>

                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.line_mob}></div>
                        <div className={styles.circle_mob}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>Appointment Schedule</div>
                        <div className={styles.act_date}>27 Aug, 2024</div>
                      </div>
                    </div>
                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.circle_mob}></div>
                        <div className={styles.line_mob}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>Appointment Schedule</div>
                        <div className={styles.act_date}>27 Aug, 2024</div>
                      </div>
                    </div>

                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.circle_mob}></div>
                        <div className={styles.line_mob}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>Appointment Accepted</div>
                        <div className={styles.act_date}>29 Aug, 2024</div>
                      </div>
                    </div>

                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.circle_mob}></div>
                        <div className={styles.line_mob}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>Appointment Date</div>
                        <div className={styles.act_date}>30 Aug, 2024</div>
                      </div>
                    </div>

                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.circle_mob}></div>
                        <div className={styles.line_mob}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>Deal Won</div>
                        <div className={styles.act_date}>1 Sep, 2024</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {(!!totalCount &&
          <div className="page-heading-container px0">
            <p className="page-heading">
              {startIndex} - {endIndex} of {totalCount} item
            </p>

            <Pagination
              currentPage={page}
              totalPages={totalPage} // You need to calculate total pages
              paginate={(num) => setPage(num)}
              currentPageData={[]}
              goToNextPage={() => 0}
              goToPrevPage={() => 0}
              perPage={10}
            />
          </div>
        )}

      </div>

    </div>
  );
};

export default LeradManagementHistory;
