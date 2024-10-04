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
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from 'date-fns';
import Select, { SingleValue } from 'react-select';
import useAuth from '../../hooks/useAuth';
import { postCaller } from '../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import axios from 'axios';
import DataNotFound from '../components/loader/DataNotFound';
import MicroLoader from '../components/loader/MicroLoader';

interface HistoryTableProp {
  first_name: string;
  last_name: string;
  phone_number: string;
  email_id: string;
  street_address: string;
  zipcode: string;
  deal_date: string;
  deal_status: string;
  leads_id: number;
  appointment_scheduled_date: string;
  appointment_accepted_date: string;
  appointment_declined_date: string;
  appointment_date: string | null;
  deal_won_date: string | null;
  deal_lost_date: string | null;
  proposal_sent_date: string | null;
  timeline: any;
}

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
  const [itemsPerPage, setItemPerPage] = useState(10);
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = page * itemsPerPage;
  const totalPage = Math.ceil(totalCount / itemsPerPage);
  const [checkedCount, setCheckedCount] = useState<number>(0);
  const dateRangeRef = useRef<HTMLDivElement>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [expandedItemIds, setExpandedItemIds] = useState<number[]>([]);
  const [isAuthenticated, setAuthenticated] = useState(false);

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

  // const [selectedPeriod, setSelectedPeriod] = useState<DateRangeWithLabel | null>(null);

  const [selectedPeriod, setSelectedPeriod] =
    useState<DateRangeWithLabel | null>(
      periodFilterOptions.find((option) => option.label === 'This Week') || null
    );

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
    startDate: startOfThisWeek,
    endDate: today,
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

  const handleCrossClick = () => {
    setSelectedItemIds([]);
    setCheckedCount(0);
  };

  const handlesee = (itemId: number) => {
    setExpandedItemIds((prevExpandedItemIds) =>
      prevExpandedItemIds.includes(itemId)
        ? prevExpandedItemIds.filter((id) => id !== itemId)
        : [...prevExpandedItemIds, itemId]
    );
  };

  const handleCross = () => {
    navigate('/leadmng-dashboard');
  };

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const toggleCalendar = () => {
    setIsCalendarOpen((prevState) => !prevState);
  };

  const handleCheckboxChange = (itemId: number) => {
    setSelectedItemIds((prevSelectedItemIds = []) => {
      if (prevSelectedItemIds.includes(itemId)) {
        setCheckedCount((prevCount) => prevCount - 1);
        return prevSelectedItemIds.filter((id) => id !== itemId);
      } else {
        setCheckedCount((prevCount) => prevCount + 1);
        return [...prevSelectedItemIds, itemId];
      }
    });
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

  const [selectedValue, setSelectedValue] = useState<number>(-1);

  const handleSortingChange = (value: number) => {
    if (!value) {
      setSelectedValue(-1);
    } else {
      setSelectedValue(value);
    }
  };

  const { authData, saveAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [historyTable, setHistoryTable] = useState<HistoryTableProp[]>([]);
  const [refresh, setRefresh] = useState(1);
  const [remove, setRemove] = useState(false);
  useEffect(() => {
    const isPasswordChangeRequired =
      authData?.isPasswordChangeRequired?.toString();

    setAuthenticated(isPasswordChangeRequired === 'false');
  }, [authData]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await postCaller(
            'leads_history',
            {
              leads_status: selectedValue,
              start_date: selectedDates.startDate
                ? format(selectedDates.startDate, 'dd-MM-yyyy')
                : '',
              end_date: selectedDates.endDate
                ? format(selectedDates.endDate, 'dd-MM-yyyy')
                : '',
              page_size: itemsPerPage,
              page_number: page,
            },
            true
          );

          if (response.status > 201) {
            toast.error(response.data.message);
            setIsLoading(false);
            return;
          }
          if (response.data?.leads_history_list) {
            setHistoryTable(
              response.data?.leads_history_list as HistoryTableProp[]
            );
            setTotalCount(response.dbRecCount);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated, selectedDates, itemsPerPage, page, selectedValue, refresh]);

  const handlePeriodChange = (
    selectedOption: SingleValue<DateRangeWithLabel>
  ) => {
    if (selectedOption) {
      setSelectedDates({
        startDate: selectedOption.start,
        endDate: selectedOption.end,
      });
      setSelectedPeriod(selectedOption);
    } else {
      setSelectedDates({ startDate: null, endDate: null });
      setSelectedPeriod(null);
    }
  };

  const deleteLeads = async () => {
    setRemove(true);
    try {
      const response = await postCaller(
        'delete_lead',
        {
          ids: selectedItemIds,
        },
        true
      );

      if (response.status === 200) {
        setRefresh((prev) => (prev + 1));
        toast.success('Lead History deleted successfully');
        setRemove(false);
        handleCrossClick();
      } else {
        toast.warn(response.message);
      }
    } catch (error) {
      console.error('Error deleting leads:', error);
    }
    setRemove(false);
  };

  const handlePerPageChange = (selectedPerPage: number) => {
    setItemPerPage(selectedPerPage);
    setPage(1); // Reset to the first page when changing items per page
  };

  const isMobile = useMatchMedia('(max-width: 767px)');
  const isTablet = useMatchMedia('(max-width: 1024px)');

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
          {checkedCount == 0 && (
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
                  <div className={styles.lead__datepicker_wrapper}>
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
                  </div>
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

                  <Select
                    value={selectedPeriod}
                    onChange={handlePeriodChange}
                    options={periodFilterOptions}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        marginTop: 'px',
                        borderRadius: '8px',
                        outline: 'none',
                        color: '#3E3E3E',
                        width: '140px',
                        height: '36px',
                        fontSize: '12px',
                        border: '1px solid #d0d5dd',
                        fontWeight: '500',
                        cursor: 'pointer',
                        alignContent: 'center',
                        backgroundColor: '#fffff',
                        boxShadow: 'none',
                        '@media only screen and (max-width: 767px)': {
                          width: '80px',
                          // width: 'fit-content',
                        },
                        '&:focus-within': {
                          borderColor: '#377CF6',
                          boxShadow: '0 0 0 1px #377CF6',
                          caretColor: '#3E3E3E',
                        },
                        '&:hover': {
                          borderColor: '#377CF6',
                          boxShadow: '0 0 0 1px #377CF6',
                        },
                      }),
                      placeholder: (baseStyles) => ({
                        ...baseStyles,
                        color: '#3E3E3E',
                      }),
                      indicatorSeparator: () => ({
                        display: 'none',
                      }),
                      dropdownIndicator: (baseStyles, state) => ({
                        ...baseStyles,
                        color: '#3E3E3E',
                        '&:hover': {
                          color: '#3E3E3E',
                        },
                      }),
                      option: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '13px',
                        color: state.isSelected ? '#3E3E3E' : '#3E3E3E',
                        backgroundColor: state.isSelected ? '#fffff' : '#fffff',
                        '&:hover': {
                          backgroundColor: state.isSelected
                            ? '#ddebff'
                            : '#ddebff',
                        },
                        cursor: 'pointer',
                      }),
                      singleValue: (baseStyles, state) => ({
                        ...baseStyles,
                        color: '#3E3E3E',
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        width: '140px',
                        marginTop: '0px',
                      }),
                    }}
                  />

                  <div
                    className={styles.calender}
                    onClick={toggleCalendar}
                    ref={calendarRef}
                  >
                    <img src={ICONS.includes_icon} alt="" />
                  </div>
                  <div className={styles.sort_drop}>
                    <SortingDropDown onChange={handleSortingChange} />
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
          {checkedCount != 0 && (
            <div style={{
              pointerEvents: remove ? 'none' : 'auto',
              opacity: remove ? 0.6 : 1,
              cursor: remove ? 'not-allowed' : 'pointer',
            }} onClick={deleteLeads} className={styles.lead_his_remove}>{remove ? "Removing..." : "Remove"}</div>
          )}
        </div>

        <div className={styles.history_list}>
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MicroLoader />
            </div>
          ) : historyTable.length > 0 ? (
            historyTable.map((item) => (
              <div
                style={
                  expandedItemIds.includes(item.leads_id)
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
                        checked={selectedItemIds.includes(item.leads_id)}
                        onChange={() => handleCheckboxChange(item.leads_id)}
                        style={{
                          width: '16.42px',
                          height: '16px',
                          gap: '0px',
                          borderRadius: '8pxpx',
                          border: '1px solid #797979',
                        }}
                      />
                    </label>
                    <div className={styles.user_name}>
                      <h2>
                        {item.first_name} {item.last_name}
                      </h2>
                      <p
                        style={{
                          color:
                            item.deal_status === 'Deal Won'
                              ? '#52B650'
                              : item.deal_status === 'Deal Loss'
                                ? '#F55B5B'
                                : '#81a6e7',
                        }}
                      >
                        {item.deal_status ? item.deal_status : 'N/A'}:{' '}
                        {item.deal_date ? item.deal_date : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {!isMobile && (
                    <>
                      {!isTablet && (
                        <div className={styles.phone_number}>
                          {item.phone_number ? item.phone_number : 'N/A'}
                        </div>
                      )}
                      <div className={styles.email}>
                        <p>{item.email_id ? item.email_id : 'N/A'}</p>
                        <img
                          height={15}
                          width={15}
                          src={ICONS.complete}
                          alt="img"
                        />
                      </div>
                      <div className={styles.address}>
                        {item?.street_address
                          ? item.street_address.length > 20
                            ? `${item.street_address.slice(0, 20)}...`
                            : item.street_address
                          : 'N/A'}
                      </div>
                    </>
                  )}

                  <div
                    className={styles.see_more}
                    onClick={() => handlesee(item.leads_id)}
                  >
                    <p>
                      {expandedItemIds.includes(item.leads_id)
                        ? 'See Less'
                        : 'See More'}
                    </p>
                    <img
                      src={ICONS.SeeMore}
                      alt="img"
                      style={{
                        transform: expandedItemIds.includes(item.leads_id)
                          ? 'rotate(180deg)'
                          : 'none',
                      }}
                    />
                  </div>
                </div>
                {!isMobile && expandedItemIds.includes(item.leads_id) && (
                  <>
                    {isTablet && (
                      <div className={styles.phone_number_tab}>
                        {item.phone_number}
                      </div>
                    )}
                    <div style={{ padding: '0px 12px' }}>
                      <div
                        style={{ backgroundColor: '#fff' }}
                        className={styles.history_list_activity}
                      >
                        <div className={styles.history_list_head}>Activity</div>

                        <div className={styles.history_list_activities}>
                          {item.timeline.map((activity: any, index: number) => (
                            <div
                              key={index}
                              className={styles.history_list_activity_det}
                            >
                              <div className={styles.circle_with_line}>
                                <div className={styles.line1}></div>
                                <div className={styles.circle}></div>
                              </div>
                              <div className={styles.activity_info}>
                                <div className={styles.act_head}>
                                  {activity.label}
                                </div>
                                <div className={styles.act_date}>
                                  {new Date(activity.date).toLocaleDateString(
                                    'en-US',
                                    {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {isMobile && expandedItemIds.includes(item.leads_id) && (
                  <>
                    <div className={styles.personal_info_mob}>
                      <div className={styles.phone_number}>
                        {item.phone_number ? item.phone_number : 'N/A'}
                      </div>
                      <div className={styles.email}>
                        <p>{item.email_id ? item.email_id : 'N/A'}</p>
                        <img
                          height={15}
                          width={15}
                          src={ICONS.complete}
                          alt="img"
                        />
                      </div>
                      <div className={styles.address}>

                        {item?.street_address
                          ? item.street_address.length > 20
                            ? `${item.street_address.slice(0, 20)}...`
                            : item.street_address
                          : 'N/A'}
                      </div>
                    </div>

                    <div style={{ padding: '0px 12px' }}>
                      <div
                        style={{ backgroundColor: '#fff' }}
                        className={styles.history_list_activity_mob}
                      >
                        <div className={styles.history_list_head}>Activity</div>
                        {item.timeline.map((activity: any, index: number) => (
                          <div
                            key={index}
                            className={styles.history_list_activity_det}
                          >
                            <div className={styles.circle_with_line}>
                              <div className={styles.line_mob}></div>
                              <div className={styles.circle_mob}></div>
                            </div>
                            <div className={styles.activity_info}>
                              <div className={styles.act_head}>
                                {activity.label}
                              </div>
                              <div className={styles.act_date}>
                                {new Date(activity.date).toLocaleDateString(
                                  'en-US',
                                  {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <DataNotFound />
          )}
        </div>

        {!!totalCount && (
          <div className="page-heading-container">
            <p className="page-heading">
              {startIndex} - {endIndex} of {totalCount} item
            </p>

            <Pagination
              currentPage={page}
              totalPages={totalPage}
              paginate={(num) => setPage(num)}
              currentPageData={[]}
              goToNextPage={() => 0}
              goToPrevPage={() => 0}
              perPage={itemsPerPage}
              onPerPageChange={handlePerPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LeradManagementHistory;
