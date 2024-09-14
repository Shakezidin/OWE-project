import React, { useEffect, useRef, useState } from 'react';
import styles from './styles/lmhistory.module.css';
import { ICONS } from '../../resources/icons/Icons';
import SortingDropDown from './components/SortingDropDown';
import { useNavigate } from 'react-router-dom';
import LeadCalender from './components/Calnder';
import Pagination from '../components/pagination/Pagination';

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

              <div className={styles.calender} onClick={toggleCalendar}>
                <img src={ICONS.includes_icon} alt="" />
              </div>
              <div className={styles.sort_drop}>
                <SortingDropDown />
              </div>

              <div className="iconsSection2-confex">
                <button type="button">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.6253 1.58325H11.8753C11.6653 1.58325 11.464 1.66666 11.3155 1.81513C11.167 1.96359 11.0836 2.16496 11.0836 2.37492C11.0836 2.58488 11.167 2.78625 11.3155 2.93471C11.464 3.08318 11.6653 3.16659 11.8753 3.16659H14.7142L8.14891 9.73188C8.0733 9.8049 8.01299 9.89226 7.9715 9.98885C7.93001 10.0854 7.90817 10.1893 7.90726 10.2944C7.90634 10.3996 7.92637 10.5038 7.96618 10.6011C8.00599 10.6984 8.06477 10.7868 8.1391 10.8611C8.21343 10.9354 8.30182 10.9942 8.39912 11.034C8.49641 11.0738 8.60066 11.0939 8.70577 11.0929C8.81089 11.092 8.91477 11.0702 9.01136 11.0287C9.10794 10.9872 9.1953 10.9269 9.26833 10.8513L15.8336 4.286V7.12492C15.8336 7.33488 15.917 7.53624 16.0655 7.68471C16.214 7.83318 16.4153 7.91658 16.6253 7.91658C16.8353 7.91658 17.0366 7.83318 17.1851 7.68471C17.3335 7.53624 17.417 7.33488 17.417 7.12492V2.37492C17.417 2.16496 17.3335 1.96359 17.1851 1.81513C17.0366 1.66666 16.8353 1.58325 16.6253 1.58325Z" />
                    <path d="M15.0413 8.38225C14.8314 8.38225 14.63 8.46566 14.4815 8.61412C14.3331 8.76259 14.2497 8.96395 14.2497 9.17391V14.8446C14.2495 15.1068 14.1452 15.3582 13.9598 15.5436C13.7744 15.729 13.5231 15.8332 13.2609 15.8334H4.15513C3.89295 15.8332 3.64157 15.729 3.45618 15.5436C3.27079 15.3582 3.16655 15.1068 3.16634 14.8446V5.73887C3.16655 5.47669 3.27079 5.22531 3.45618 5.03992C3.64157 4.85453 3.89295 4.75029 4.15513 4.75008H9.08088C9.29085 4.75008 9.49221 4.66667 9.64068 4.51821C9.78914 4.36974 9.87255 4.16838 9.87255 3.95841C9.87255 3.74845 9.78914 3.54709 9.64068 3.39862C9.49221 3.25016 9.29085 3.16675 9.08088 3.16675H4.15513C3.47322 3.16759 2.81948 3.43885 2.33729 3.92103C1.85511 4.40322 1.58385 5.05696 1.58301 5.73887V14.843C1.58343 15.5252 1.8545 16.1794 2.33673 16.6619C2.81896 17.1444 3.47295 17.4159 4.15513 17.4167H13.2593C13.9415 17.4163 14.5956 17.1453 15.0782 16.663C15.5607 16.1808 15.8322 15.5268 15.833 14.8446V9.17391C15.833 8.96395 15.7496 8.76259 15.6011 8.61412C15.4527 8.46566 15.2513 8.38225 15.0413 8.38225Z" />
                  </svg>
                  Export
                </button>
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
              <div className={styles.phone_number}>+1 82-26-2356445</div>
              <div className={styles.email}>
                <p>sanjusamson19@gmail.com</p>
                <img height={15} width={15} src={ICONS.complete} alt="img" />
              </div>
              <div className={styles.address}>
                12778 Domingo Ct, Parker, Arizona .CO 12312
              </div>
              <div className={styles.see_more} onClick={handlesee}>
                <p>{see ? 'See Less' : 'See More'}</p>
                <img src={ICONS.SeeMore} alt="img" style={{ transform: see ? 'rotate(180deg)' : 'none' }} />
              </div>
            </div>
            {see && (
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
          </div>

          <div className={styles.history_lists}>
            <div className={styles.history_list_inner}>
              <label>
                <input
                  type="checkbox"
                  style={{
                    width: '16.42px',
                    height: '16px',
                    gap: '0px',
                    borderRadius: '6px 0px 0px 0px',
                    border: '1px solid #797979',
                  }}
                />
              </label>
              <div className={styles.user_name}>
                <h2>Sanju samson</h2>
                <p style={{ color: '#FF832A' }}>Not Scheduled</p>
              </div>
              <div className={styles.phone_number}>+1 82-26-2356445</div>
              <div className={styles.email}>
                <p>sanjusamson19@gmail.com</p>
                <img height={15} width={15} src={ICONS.complete} alt="img" />
              </div>
              <div className={styles.address}>
                12778 Domingo Ct, Parker, Arizona .CO 12312
              </div>
              <div className={styles.see_more} onClick={handlesee}>
                <p>{see ? 'See Less' : 'See More'}</p>
                <img src={ICONS.SeeMore} alt="img" />
              </div>
            </div>
            {false && (
              <div className={styles.history_list_activity}>
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
                    <div className={styles.act_head}>Appointment Schedule</div>
                    <div className={styles.act_date}>27 Aug, 2024</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.history_lists}>
            <div className={styles.history_list_inner}>
              <label>
                <input
                  type="checkbox"
                  style={{
                    width: '16.42px',
                    height: '16px',
                    gap: '0px',
                    borderRadius: '6px 0px 0px 0px',
                    border: '1px solid #797979',
                  }}
                />
              </label>
              <div className={styles.user_name}>
                <h2>Sanju samson</h2>
                <p style={{ color: '#52B650' }}>Appointment Accepted</p>
              </div>
              <div className={styles.phone_number}>+1 82-26-2356445</div>
              <div className={styles.email}>
                <p>sanjusamson19@gmail.com</p>
                <img height={15} width={15} src={ICONS.complete} alt="img" />
              </div>
              <div className={styles.address}>
                12778 Domingo Ct, Parker, Arizona .CO 12312
              </div>
              <div className={styles.see_more} onClick={handlesee}>
                <p>{see ? 'See Less' : 'See More'}</p>
                <img src={ICONS.SeeMore} alt="img" />
              </div>
            </div>
            {false && (
              <div className={styles.history_list_activity}>
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
                    <div className={styles.act_head}>Appointment Schedule</div>
                    <div className={styles.act_date}>27 Aug, 2024</div>
                  </div>
                </div>
              </div>
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
