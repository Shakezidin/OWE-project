import React, { useEffect, useRef, useState } from 'react';
import styles from './styles/lmhistory.module.css';
import { ICONS } from '../../resources/icons/Icons';
import SortingDropDown from './components/SortingDropDown';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/pagination/Pagination';
import useMatchMedia from '../../hooks/useMatchMedia';
import { DateRange } from 'react-date-range';
import { toZonedTime } from 'date-fns-tz';
import {
  endOfWeek,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from 'date-fns';

export type DateRangeWithLabel = {
  label?: string;
  start: Date;
  end: Date;
};

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
  const dateRangeRef = useRef<HTMLDivElement>(null);

  function getUserTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  // Function to get current date in the user's timezone
  function getCurrentDateInUserTimezone() {
    const now = new Date();
    const userTimezone = getUserTimezone();
    return toZonedTime(now, userTimezone);
  }
  const today = getCurrentDateInUserTimezone();
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // assuming week starts on Monday, change to 0 if it starts on Sunday
  const startOfThisMonth = startOfMonth(today);
  const startOfThisYear = startOfYear(today);
  const startOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );
  const startOfThreeMonthsAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 2,
    1
  );
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  // Calculate the start and end of last week
  const startOfLastWeek = startOfWeek(subDays(startOfThisWeek, 1), {
    weekStartsOn: 1,
  });
  const endOfLastWeek = endOfWeek(subDays(startOfThisWeek, 1), {
    weekStartsOn: 1,
  });

  const periodFilterOptions: DateRangeWithLabel[] = [
    {
      label: 'This Week',
      start: startOfThisWeek,
      end: today,
    },
    {
      label: 'Last Week',
      start: startOfLastWeek,
      end: endOfLastWeek,
    },
    {
      label: 'This Month',
      start: startOfThisMonth,
      end: today,
    },
    {
      label: 'Last Month',
      start: startOfLastMonth,
      end: endOfLastMonth,
    },
    {
      label: 'This Quarter',
      start: startOfThreeMonthsAgo,
      end: today,
    },
    {
      label: 'This Year',
      start: startOfThisYear,
      end: today,
    },
  ];

  const [selectedPeriod, setSelectedPeriod] =
    useState<DateRangeWithLabel | null>(null);

  const [selectedRanges, setSelectedRanges] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const [selectedDates, setSelectedDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const handleRangeChange = (ranges: any) => {
    setSelectedRanges([ranges.selection]);
  };

  const onReset = () => {
    setSelectedDates({ startDate: new Date(), endDate: new Date() });
    setIsCalendarOpen(false);
  };

  const onApply = () => {
    const startDate = selectedRanges[0].startDate;
    const endDate = selectedRanges[0].endDate;
    setSelectedDates({ startDate, endDate });
    setIsCalendarOpen(false);
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLabel = e.target.value;
    const selectedOption = periodFilterOptions.find(
      (option) => option.label === selectedLabel
    );
    if (selectedOption) {
      setSelectedDates({
        startDate: selectedOption.start,
        endDate: selectedOption.end,
      });
      setSelectedPeriod(selectedOption || null);
    } else {
      setSelectedDates({ startDate: null, endDate: null });
    }
  };

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

  const calendarRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dateRangeRef.current &&
      !dateRangeRef.current.contains(event.target as Node) &&
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node)
    ) {
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

  console.log(selectedPeriod, 'hghjgjhgjg');

  return (
    <div className={`flex justify-between mt2 ${styles.h_screen}`}>
      <div className={styles.customer_wrapper_list}>
        <div className={styles.lm_history_header}>
          {checkedCount == 0 && <h1>History</h1>}
          {checkedCount != 0 && (
            <div className={styles.hist_checkbox_count}>
              <img
                src={ICONS.cross}
                alt=""
                height={28}
                width={28}
                style={{ cursor: 'pointer' }}
                onClick={handleCrossClick}
              />
              <h1>{checkedCount} Selected</h1>
            </div>
          )}
          {!isChecked && (
            <>
              <div className={styles.top_filters}>
                <div>
                  {isMobile &&
                  selectedDates.startDate &&
                  selectedDates.endDate ? (
                    <div className={styles.hist_date}>
                      <span>
                        {selectedDates.startDate.toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                        {' - '}
                        {selectedDates.endDate.toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className={styles.filters}>
                  {isCalendarOpen && (
                    <div
                      className={styles.lead__datepicker_content}
                      ref={dateRangeRef}
                    >
                      <DateRange
                        editableDateInputs={true}
                        onChange={handleRangeChange}
                        moveRangeOnFirstSelection={false}
                        ranges={selectedRanges}
                      />
                      <div className={styles.lead__datepicker_btns}>
                        <button className="reset-calender" onClick={onReset}>
                          Reset
                        </button>
                        <button className="apply-calender" onClick={onApply}>
                          Apply
                        </button>
                      </div>
                    </div>
                  )}

                  {!isMobile &&
                  selectedDates.startDate &&
                  selectedDates.endDate ? (
                    <div className={styles.hist_date}>
                      <span>
                        {selectedDates.startDate.toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                        {' - '}
                        {selectedDates.endDate.toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  ) : null}

                  <select
                    value={selectedPeriod?.label || ''}
                    onChange={handlePeriodChange}
                    className={`${styles.monthSelect} ${styles.customSelect}`}
                  >
                    {periodFilterOptions.map((option) => (
                      <option
                        key={option.label}
                        value={option.label}
                        selected={selectedPeriod?.label === option.label}
                        className={styles.selectOption}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div
                    className={styles.calender}
                    onClick={toggleCalendar}
                    ref={calendarRef}
                  >
                    <img src={ICONS.includes_icon} alt="" />
                  </div>
                  <div className={styles.sort_drop}>
                    <SortingDropDown />
                  </div>
                  <div className={styles.calender}>
                    <img
                      src={ICONS.LeadMngExport}
                      style={{ marginTop: '-2px' }}
                      alt=""
                      height={22}
                      width={22}
                    />
                  </div>

                  <div className={styles.hist_ret} onClick={handleCross}>
                    <img src={ICONS.cross} alt="" height="26" width="26" />
                  </div>
                </div>
              </div>
            </>
          )}
          {isChecked && <div className={styles.lead_his_remove}>Remove</div>}
        </div>

        <div className={styles.history_list}>
          <div
            style={
              see
                ? {
                    width: '100%',
                    backgroundColor: '#EEF5FF',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                  }
                : {}
            }
            className={styles.history_lists}
          >
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

              {!isMobile && (
                <>
                  <div className={styles.phone_number}>+1 82-26-2356445</div>
                  <div className={styles.email}>
                    <p>sanjusamson19@gmail.com</p>
                    <img
                      height={15}
                      width={15}
                      src={ICONS.complete}
                      alt="img"
                    />
                  </div>
                  <div className={styles.address}>
                    12778 Domingo Ct, Parker, Arizona .CO 12312
                  </div>
                </>
              )}

              <div className={styles.see_more} onClick={handlesee}>
                <p>{see ? 'See Less' : 'See More'}</p>
                <img
                  src={ICONS.SeeMore}
                  alt="img"
                  style={{ transform: see ? 'rotate(180deg)' : 'none' }}
                />
              </div>
            </div>
            {!isMobile && see && (
              <>
                <div style={{ padding: '0px 12px' }}>
                  <div
                    style={{ backgroundColor: '#fff' }}
                    className={styles.history_list_activity}
                  >
                    <div className={styles.history_list_head}>Activity</div>

                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.line1}></div>
                        <div className={styles.circle}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>
                          Appointment Schedule
                        </div>
                        <div className={styles.act_date}>27 Aug, 2024</div>
                      </div>
                    </div>
                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.circle}></div>
                        <div className={styles.line}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>
                          Appointment Schedule
                        </div>
                        <div className={styles.act_date}>27 Aug, 2024</div>
                      </div>
                    </div>

                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.circle}></div>
                        <div className={styles.line}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>
                          Appointment Accepted
                        </div>
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
                    <img
                      height={15}
                      width={15}
                      src={ICONS.complete}
                      alt="img"
                    />
                  </div>
                  <div className={styles.address}>
                    12778 Domingo Ct, Parker, Arizona .CO 12312
                  </div>
                </div>

                <div style={{ padding: '0px 12px' }}>
                  <div
                    style={{ backgroundColor: '#fff' }}
                    className={styles.history_list_activity_mob}
                  >
                    <div className={styles.history_list_head}>Activity</div>

                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.line_mob}></div>
                        <div className={styles.circle_mob}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>
                          Appointment Schedule
                        </div>
                        <div className={styles.act_date}>27 Aug, 2024</div>
                      </div>
                    </div>
                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.circle_mob}></div>
                        <div className={styles.line_mob}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>
                          Appointment Schedule
                        </div>
                        <div className={styles.act_date}>27 Aug, 2024</div>
                      </div>
                    </div>

                    <div className={styles.history_list_activity_det}>
                      <div className={styles.circle_with_line}>
                        <div className={styles.circle_mob}></div>
                        <div className={styles.line_mob}></div>
                      </div>
                      <div className={styles.activity_info}>
                        <div className={styles.act_head}>
                          Appointment Accepted
                        </div>
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
        {!!totalCount && (
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
