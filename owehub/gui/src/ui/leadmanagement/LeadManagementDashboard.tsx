import React, { useState, useEffect, useRef, useCallback } from 'react';
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { LuImport } from 'react-icons/lu';
import { DateRange } from 'react-date-range';
import { useNavigate } from 'react-router-dom';
import HistoryRedirect from './HistoryRedirect';
import { debounce } from '../../utiles/debounce';
import useEscapeKey from '../../hooks/useEscape';
import { ICONS } from '../../resources/icons/Icons';
import useWindowWidth from '../../hooks/useWindowWidth';
import { MdDownloading } from 'react-icons/md';
import MicroLoader from '../components/loader/MicroLoader';
import Pagination from '../components/pagination/Pagination';
import DataNotFound from '../components/loader/DataNotFound';
import  { SingleValue, ActionMeta } from 'react-select';
import { Tooltip as Tooltip } from 'react-tooltip';
import LeadTable from './components/LeadDashboardTable/leadTable';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import './styles/mediaQuery.css';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import styles from './styles/dashboard.module.css';
import CustomPieChart from './components/CustomPieChart';
import CustomLineChart from './components/CustomLineChart';
import CustomSelect from './components/CustomSelect';
import { postCaller } from '../../infrastructure/web_api/services/apiUrl';
import LeadTableFilter from './components/LeadDashboardTable/Dropdowns/LeadTopFilter';
import { getLeads } from '../../redux/apiActions/leadManagement/LeadManagementAction';
import {
  handleCreateProposal,
  generateWebProposal,
  retrieveWebProposal,
} from './api/auroraApi';
import {
  endOfWeek,
  format,
  parseISO,
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
const today = new Date();
const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
const startOfThisMonth = startOfMonth(today);
const startOfThisYear = startOfYear(today);
const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
const startOfThreeMonthsAgo = new Date(
  today.getFullYear(),
  today.getMonth() - 2,
  1
);
const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
const startOfLastWeek = startOfWeek(subDays(startOfThisWeek, 1), {
  weekStartsOn: 1,
});
const endOfLastWeek = endOfWeek(subDays(startOfThisWeek, 1), {
  weekStartsOn: 1,
});

const periodFilterOptions: DateRangeWithLabel[] = [
  { label: 'This Week', start: startOfThisWeek, end: today },
  { label: 'Last Week', start: startOfLastWeek, end: endOfLastWeek },
  { label: 'This Month', start: startOfThisMonth, end: today },
  { label: 'Last Month', start: startOfLastMonth, end: endOfLastMonth },
  { label: 'This Quarter', start: startOfThreeMonthsAgo, end: today },
  { label: 'This Year', start: startOfThisYear, end: today },
];

const LeadManagementDashboard = () => {
  const width = useWindowWidth();
  const isTablet = width <= 1024;
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const toggleRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [archived, setArchived] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isToggledX, setIsToggledX] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const [selectedValue, setSelectedValue] = useState('ALL');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('New Leads');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = page * itemsPerPage;
  const totalPage = Math.ceil(totalCount / itemsPerPage);
  const [side, setSide] = useState<'left' | 'right'>('left');
  const [selectedRanges, setSelectedRanges] = useState([
    { startDate: startOfThisWeek, endDate: today, key: 'selection' },
  ]);
  const [selectedDates, setSelectedDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: startOfThisWeek, endDate: today });
  const [selectedPeriod, setSelectedPeriod] =
    useState<DateRangeWithLabel | null>(
      periodFilterOptions.find((option) => option.label === 'This Week') || null
    );

  const handleRangeChange = (ranges: any) => {
    setSelectedRanges([ranges.selection]);
  };
  const onReset = () => {
    const currentDate = new Date();
    setSelectedDates({ startDate: startOfThisWeek, endDate: today });
    setSelectedPeriod(
      periodFilterOptions.find((option) => option.label === 'This Week') || null
    );
    setSelectedRanges([
      {
        startDate: currentDate,
        endDate: currentDate,
        key: 'selection',
      },
    ]);
    setIsCalendarOpen(false);
  };
  const onApply = () => {
    const startDate = selectedRanges[0].startDate;
    const endDate = selectedRanges[0].endDate;
    setSelectedDates({ startDate, endDate });
    setSelectedPeriod(null);
    setIsCalendarOpen(false);
  };
  const paginate = (pageNumber: number) => {
    setPage(pageNumber);
  };
  const goToNextPage = () => {
    setPage(page + 1);
  };
  const goToPrevPage = () => {
    setPage(page - 1);
  };
  const handlePerPageChange = (selectedPerPage: number) => {
    setItemPerPage(selectedPerPage);
    setPage(1);
  };
  const toggleCalendar = () => {
    setIsCalendarOpen((prevState) => !prevState);
  };
  const handleCalenderClose = () => {
    setIsCalendarOpen(false);
  };
  useEscapeKey(handleCalenderClose);

  const handlePeriodChange = (
    newValue: SingleValue<DateRangeWithLabel>,
    actionMeta: ActionMeta<DateRangeWithLabel>
  ) => {
    if (newValue) {
      setSelectedDates({
        startDate: newValue.start,
        endDate: newValue.end,
      });
      setSelectedPeriod(newValue);
    } else {
      setSelectedDates({ startDate: null, endDate: null });
    }
  };
  const handleClickOutside = (event: Event) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node) &&
      toggleRef.current &&
      !toggleRef.current.contains(event.target as Node)
    ) {
      setIsCalendarOpen(false);
    }
  };
  const navigate = useNavigate();
  const handleAddLead = () => {
    navigate('/leadmng-dashboard/leadmgt-addnew');
  };
  const statusMap = {
    NEW: 'New Leads',
    PROGRESS: 'In Progress',
    DECLINED: 'Declined',
    ACTION_NEEDED: 'Action Needed',
  };
  const handlePieClick = (_: React.MouseEvent<SVGElement>, index: number) => {
    setActiveIndex(index);
  };
  const handleFilterClick = (filter: string) => {
    setCurrentFilter(filter);
    setBackup(filter);
    setPage(1);
    setSide('left');
    setActiveIndex(
      pieData.findIndex(
        (item) => statusMap[item.name as keyof typeof statusMap] === filter
      )
    );
  };
  const createProposal = async (leadId: number) => {
    const createHandler = handleCreateProposal(leadId, setRefresh, dispatch);
    await createHandler();
  };
  const generateProposalWrapper = async (leadId: number) => {
    const generateHandler = generateWebProposal(leadId, dispatch);
    await generateHandler();
  };
  const retrieveProposalWrapper = async (leadId: number) => {
    const retrieveHandler = retrieveWebProposal(leadId, dispatch);
    await retrieveHandler();
  };
  useEffect(() => {
    if (pieData.length > 0) {
      const pieName = pieData[activeIndex].name;
      const newFilter = statusMap[pieName as keyof typeof statusMap];
      setCurrentFilter(newFilter);
      setPage(1);
    }
  }, [activeIndex]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // ************************ API Integration By Saurabh ********************************\\
  const [isAuthenticated, setAuthenticated] = useState(false);
  const { authData, saveAuthData } = useAuth();
  const [loading, setIsLoading] = useState(false);
  const [pieData, setPieData] = useState<StatusData[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [archive, setArchive] = useState(false);
  const [ref, setRef] = useState(0);
  const [exporting, setIsExporting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true); // Controls tooltip visibility
  const [backup, setBackup] = useState('New Leads');
  const [lineData, setLineData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');

  interface DefaultData {
    [key: string]: StatusData;
  }
  interface StatusData {
    name: string;
    value: number;
    color: string;
  }
  const defaultData: DefaultData = {
    NEW: { name: 'NEW', value: 0, color: '#21BC27' },
    PROGRESS: { name: 'PROGRESS', value: 0, color: '#377CF6' },
    DECLINED: { name: 'DECLINED', value: 0, color: '#D91515' },
    ACTION: { name: 'ACTION_NEEDED', value: 0, color: '#EC9311' },
  };
  const dispatch = useAppDispatch();
  const { isLoading, leadsData, statusData1, totalcount } = useAppSelector(
    (state) => state.leadManagmentSlice
  );
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
            'get_periodic_won_lost_leads',
            {
              start_date: selectedDates.startDate
                ? `${format(selectedDates.startDate, 'dd-MM-yyy')}`
                : '',
              end_date: selectedDates.endDate
                ? `${format(selectedDates.endDate, 'dd-MM-yyy')}`
                : '',
            },
            true
          );

          if (response.status === 200) {
            const apiData = response.data.periodic_list;
            const formattedData = apiData.map((item: any) => ({
              name: item.period_label,
              won: item.won_count,
              lost: item.lost_count,
            }));
            setLineData(formattedData);
          } else if (response.status > 201) {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated, selectedDates, refresh]);
  useEffect(() => {
    const calculateTotalValue = () => {
      const sum = pieData.reduce((acc, item) => acc + item.value, 0);
      setTotalValue(sum);
    };
    calculateTotalValue();
  }, [pieData]);
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const apiData = statusData1;
      const formattedData = apiData.reduce(
        (acc: DefaultData, item: any) => {
          const statusName = item.status_name;
          const defaultDataKey = Object.keys(defaultData).find(
            (key) => key === statusName || defaultData[key].name === statusName
          );
          if (defaultDataKey) {
            acc[defaultDataKey] = {
              ...defaultData[defaultDataKey],
              value: item.count,
            };
          }
          return acc;
        },
        { ...defaultData }
      );
      const mergedData = Object.values(formattedData) as StatusData[];
      setPieData(mergedData);
    }
  }, [statusData1]);
  useEffect(() => {
    if (isAuthenticated) {
      let statusId;
      switch (currentFilter) {
        case 'Action Needed':
          statusId = 'ACTION_NEEDED';
          break;
        case 'New Leads':
          statusId = 'NEW';
          break;
        case 'In Progress':
          statusId = 'PROGRESS';
          break;
        case 'Declined':
          statusId = 'DECLINED';
          break;
        case 'Projects':
          statusId = 5;
          break;
        default:
          statusId = '';
      }

      const data = {
        start_date: selectedDates.startDate
          ? `${format(selectedDates.startDate, 'dd-MM-yyy')}`
          : '',
        end_date: selectedDates.endDate
          ? `${format(selectedDates.endDate, 'dd-MM-yyy')}`
          : '',
        status: statusId,
        is_archived: archive,
        progress_filter:
          currentFilter === 'In Progress'
            ? selectedValue
              ? selectedValue
              : 'ALL'
            : '',
        search: searchTerm,
        page_size: itemsPerPage,
        page_number: archive ? 1 : page,
      };
      dispatch(getLeads(data));
    }
  }, [
    searchTerm,
    selectedDates,
    isModalOpen,
    archive,
    isAuthenticated,
    itemsPerPage,
    page,
    currentFilter,
    selectedValue,
    refresh,
    ref,
  ]);
  useEffect(() => {
    if (currentFilter !== 'In Progress') {
      setSelectedValue('ALL');
    }
  }, [currentFilter]);
  useEffect(() => {
    if (leadsData.length > 0) {
      setTotalCount(totalcount);
    }
  }, [leadsData]);
  useEffect(() => {
    setPage(1);
  }, [selectedDates, selectedValue]);
  useEffect(() => {
    if (searchTerm === '') {
      setCurrentFilter(backup);
      setPage(1);
    }
  }, [searchTerm]);
  const handleSearchChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    }, 800),
    []
  );
  const handleArchiveSelected = async () => {
    setArchived(true);
    try {
      const response = await postCaller(
        'toggle_archive',
        {
          ids: selectedLeads,
          is_archived: true,
        },
        true
      );

      if (response.status === 200) {
        toast.success('Leads Archived Successfully');
        setSelectedLeads([]);
        setRefresh((prev) => prev + 1);
        setArchived(false);
      } else {
        toast.warn(response.message);
        setArchived(false);
      }
    } catch (error) {
      console.error('Error deleting leads:', error);
      setArchived(false);
    }
    setArchived(false);
  };

  const OpenWindowClick = () => {
    setIsToggledX((prev) => !prev);
  };
  const exportCsv = async () => {
    setShowTooltip(false);
    setIsExporting(true);
    const headers = [
      'Lead ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone Number',
      'Street Address',
      'Appointment Status',
      'Appointment Status Date',
      'Deal Status',
      'Deal Date',
      'Finance Company',
      'Finance Type',
      'QC Audit',
      'Proposal ID',
      'Proposal Status',
      'Proposal Link',
      'Proposal Created Date',
      'Sales Rep',
      'Lead Source',
      'Setter',
    ];

    let statusId;
    switch (currentFilter) {
      case 'Action Needed':
        statusId = 'ACTION_NEEDED';
        break;
      case 'New Leads':
        statusId = 'NEW';
        break;
      case 'In Progress':
        statusId = 'PROGRESS';
        break;
      case 'Declined':
        statusId = 'DECLINED';
        break;
      case 'Projects':
        statusId = 5;
        break;
      default:
        statusId = 'NEW';
    }

    const data = {
      start_date: selectedDates.startDate
        ? `${format(selectedDates.startDate, 'dd-MM-yyy')}`
        : '',
      end_date: selectedDates.endDate
        ? `${format(selectedDates.endDate, 'dd-MM-yyy')}`
        : '',
      status: statusId,
      is_archived: archive,
      progress_filter: selectedValue ? selectedValue : 'ALL',
      page_size: 0,
      page_number: 0,
    };

    try {
      const response = await postCaller('get_leads_home_page', data, true);

      if (response.status > 201) {
        toast.error(response.data.message);
        setIsExporting(false);
        return;
      }

      const csvData = response.data?.leads_data?.map?.((item: any) => [
        `OWE${item.leads_id}`,
        item.first_name,
        item.last_name,
        item.email_id,
        `'${item.phone_number}'`,
        item.street_address,
        item.appointment_status_label,
        item.appointment_status_date
          ? `${format(parseISO(item.appointment_status_date), 'dd-MM-yyyy')}`
          : '',
        item.won_lost_label,
        item.won_lost_date
          ? `${format(parseISO(item.won_lost_date), 'dd-MM-yyyy')}`
          : '',
        item.finance_company,
        item.finance_type,
        item.qc_audit,
        item.proposal_id,
        item.proposal_status,
        item.proposal_link,
        item.proposal_updated_at
          ? `${format(parseISO(item.proposal_updated_at), 'dd-MM-yyyy')}`
          : '',
        item.sales_rep_name,
        item.lead_source,
        item.setter_name ? item.setter_name : '',
      ]);

      const csvRows = [headers, ...csvData];
      const csvString = Papa.unparse(csvRows);
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      toast.error('No Data Found');
    } finally {
      setIsExporting(false);
    }
    setShowTooltip(true);
  };
  const handleCrossIcon = () => {
    setCurrentFilter(backup);
    setSearchTerm('');
    setSearch('');
  };
  const isMobileDevice = () => {
    return (
      typeof window !== 'undefined' &&
      (window.innerWidth <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ))
    );
  };
  //*************************************************************************************************//
  return (
    <div className={styles.dashboard}>
      <div className={styles.chartGrid}>
        <div className={styles.horizontal}>
          <div className={styles.FirstColHead}>
            {/* HERE FOR TOGGLE VIEW WHEN HIDE OTHER BOTTONS */}
            {isToggledX && <div className={styles.customLeftRRR}>Overview</div>}
            <div className={`${styles.customRight} ${styles.customFont}`}>
              Total leads : {totalValue ? totalValue : '0'}
            </div>
          </div>
          <div className={styles.SecondColHead}>
            {isToggledX == false && (
              <div className={styles.MobileViewHide}>
                Total leads : {totalValue ? totalValue : '0'}
              </div>
            )}
            {/* CARD DESIGNING STRTED */}
            <div>
              {isToggledX && (
                <div className={styles.customLeftRRR}>Total Won Lost</div>
              )}
            </div>
            <div className={`${styles.customRight} ${styles.customFont}`}>
              <div className={styles.date_calendar}>
                <div className={styles.lead__datepicker_wrapper}>
                  {isCalendarOpen && (
                    <div
                      ref={calendarRef}
                      className={styles.lead__datepicker_content}
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
                {selectedDates.startDate && selectedDates.endDate && (
                  <div className={styles.hist_date}>
                    {isToggledX && (
                      <span className={styles.date_display}>
                        {selectedDates.startDate.toLocaleDateString('en-US', {
                          day: 'numeric',
                        }) +
                          ' ' +
                          selectedDates.startDate.toLocaleDateString('en-US', {
                            month: 'short',
                          }) +
                          ' ' +
                          selectedDates.startDate.getFullYear()}
                        {' - '}
                        {selectedDates.endDate.toLocaleDateString('en-US', {
                          day: 'numeric',
                        }) +
                          ' ' +
                          selectedDates.endDate.toLocaleDateString('en-US', {
                            month: 'short',
                          }) +
                          ' ' +
                          selectedDates.endDate.getFullYear()}
                      </span>
                    )}
                  </div>
                )}
                {isToggledX && (
                  <CustomSelect<DateRangeWithLabel>
                    value={selectedPeriod}
                    onChange={(newValue) =>
                      handlePeriodChange(
                        newValue,
                        {} as ActionMeta<DateRangeWithLabel>
                      )
                    }
                    options={periodFilterOptions}
                    isVisible={isToggledX}
                    placeholder="Select Period"
                    getOptionLabel={(option) => option.label || ''}
                    getOptionValue={(option) => option.label || ''}
                  />
                )}
                {isToggledX && (
                  <div
                    ref={toggleRef}
                    className={styles.calender}
                    onClick={toggleCalendar}
                  >
                    <img src={ICONS.includes_icon} alt="" />
                  </div>
                )}
                <div
                  onClick={OpenWindowClick}
                  className={styles.ButtonAbovearrov}
                  data-tooltip-id="downip"
                >
                  {isToggledX ? (
                    <div
                      className={styles.upKeys_DownKeys}
                      style={{ fontSize: '20px' }}
                    >
                      <img
                        className={styles.ArrowD}
                        src={ICONS.DashboardNewIcon}
                      />
                    </div>
                  ) : (
                    <div
                      className={styles.upKeys_DownKeysX}
                      style={{ fontSize: '20px' }}
                    >
                      <img
                        className={styles.ArrowDX}
                        src={ICONS.DashboardNewIcon}
                      />
                    </div>
                  )}
                </div>

                <Tooltip
                  style={{
                    zIndex: 20,
                    background: '#f7f7f7',
                    color: '#000',
                    fontSize: 12,
                    paddingBlock: 4,

                    fontWeight: '400',
                  }}
                  offset={8}
                  delayShow={800}
                  id="downip"
                  place="top"
                  content={isToggledX ? 'Minimize' : 'Maximize'}
                  className={styles.mobile_tooltip}
                />
              </div>
            </div>
          </div>
        </div>
        {/* //HORIZONTAL ENDED */}
        {isToggledX && (
          <div className={styles.vertical1}>
            <div className={styles.FirstColHeadMobile}>
              <div
                className={`${styles.customLeftMobile} ${styles.customFont}`}
              >
                Overview
              </div>
              <div className={styles.customFont}>
                Total leads : {totalValue ? totalValue : '0'}
              </div>
            </div>
            <div style={{ width: '120%' }}>
              {loading ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MicroLoader />
                </div>
              ) : totalValue > 0 ? (
                <>
                  <CustomPieChart
                    activeIndex={activeIndex}
                    pieData={pieData}
                    handlePieClick={handlePieClick}
                  />
                  <div className={styles.legend}>
                    {pieData.map((item) => (
                      <div key={item.name} className={styles.legendItem}>
                        <div
                          className={styles.legendColor}
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className={styles.legendText}>
                          {item.name} LEADS
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <DataNotFound />
              )}
            </div>
          </div>
        )}
        {/* VERTICAL 1 ENDED */}
        {isToggledX && (
          <div className={styles.vertical2}>
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MicroLoader />
              </div>
            ) : lineData.length > 0 ? (
              <>
                <CustomLineChart lineData={lineData} />
              </>
            ) : (
              <DataNotFound />
            )}
          </div>
        )}
        {/* HERE NOT ENTER BELOW CODES */}
      </div>
      <div className={styles.card}>
        {archive == false && (
          <div className={`${styles.cardHeader} ${styles.tabs_setting}`}>
            {selectedLeads.length === 0 ? (
              <>
                <div className={styles.buttonGroup}>
                  {pieData.map((data) => {
                    let displayStatus = '';
                    switch (data.name) {
                      case 'NEW':
                        displayStatus = 'New Leads';
                        break;
                      case 'PROGRESS':
                        displayStatus = 'In Progress';
                        break;
                      case 'DECLINED':
                        displayStatus = 'Declined';
                        break;
                      case 'ACTION_NEEDED':
                        displayStatus = 'Action Needed';
                        break;
                      default:
                        displayStatus = data.name;
                    }

                    return (
                      <button
                        key={data.name}
                        className={`${styles.button} ${currentFilter === displayStatus ? styles.buttonActive : ''}
                           ${displayStatus === 'Action Needed' ? styles.action_needed_btn : ''}`}
                        onClick={() => handleFilterClick(displayStatus)}
                        style={{
                          pointerEvents: searchTerm ? 'none' : 'auto',
                          opacity: searchTerm ? 0.6 : 1,
                          cursor: searchTerm ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <p
                          className={`${styles.status} ${currentFilter !== displayStatus ? styles.statusInactive : ''}`}
                        >
                          {data.value}
                        </p>
                        <span className={styles.displayStatus}>
                          {displayStatus}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className={styles.searchBar}>
                  <input
                    type="text"
                    value={search}
                    placeholder="Enter customer name or id"
                    className={styles.searchInput}
                    onChange={(e) => {
                      if (e.target.value.length <= 50) {
                        e.target.value = e.target.value.replace(
                          /[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF_\- $,\.]| {2,}/g,
                          ''
                        );
                        handleSearchChange(e);
                        setSearch(e.target.value);
                        setPage(1);
                        setCurrentFilter(e.target.value === '' ? backup : '');
                      }
                    }}
                  />
                  {searchTerm !== '' && (
                    <div
                      className={styles.CrossRemoveSearch}
                      onClick={handleCrossIcon}
                    >
                      <img src={ICONS.crossIconUser} alt="cross" />
                    </div>
                  )}
                </div>
                {/* RABINDRA */}
                {/* HERE THE PART OF CODE WHERE REDIRECT TO ACHIEVES STARTED */}
                <HistoryRedirect />
                {currentFilter === 'In Progress' && (
                  <LeadTableFilter
                    selectedValue={selectedValue}
                    setSelectedValue={setSelectedValue}
                  />
                )}
                <div className={styles.filterCallToAction}>
                  <div
                    className={styles.filtericon}
                    onClick={handleAddLead}
                    data-tooltip-id="NEW"
                  >
                    <img src={ICONS.AddIconSr} alt="" width="80" height="80" />
                  </div>
                  <Tooltip
                    style={{
                      zIndex: 103,
                      background: '#f7f7f7',
                      color: '#000',
                      fontSize: 12,
                      paddingBlock: 4,
                      fontWeight: '400',
                    }}
                    offset={8}
                    id="NEW"
                    place="top"
                    content="Add New Lead"
                    delayShow={800}
                    className={styles.mobile_tooltip}
                  />
                  <div
                    className={styles.export_btn}
                    onClick={exportCsv}
                    data-tooltip-id="export"
                    style={{
                      pointerEvents: exporting ? 'none' : 'auto',
                      opacity: exporting ? 0.6 : 1,
                      cursor: exporting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {exporting ? (
                      <MdDownloading
                        className="downloading-animation"
                        size={26}
                        color="white"
                      />
                    ) : (
                      <LuImport size={20} color="white" />
                    )}
                  </div>
                  {showTooltip && (
                    <Tooltip
                      style={{
                        zIndex: 103,
                        background: '#f7f7f7',
                        color: '#000',
                        fontSize: 12,
                        paddingBlock: 4,
                        fontWeight: '400',
                      }}
                      offset={8}
                      delayShow={800}
                      id="export"
                      place="top"
                      content="Export"
                      className={styles.mobile_tooltip}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className={styles.selectionHeader}>
                <div className={styles.selectionInfo}>
                  <span
                    className={styles.closeIcon}
                    onClick={() => setSelectedLeads([])}
                  >
                    <img src={ICONS.cross} alt="" height="26" width="26" />
                  </span>
                  <span>{selectedLeads.length} Selected</span>
                </div>
                <button
                  style={{
                    pointerEvents: archived ? 'none' : 'auto',
                    opacity: archived ? 0.6 : 1,
                    cursor: archived ? 'not-allowed' : 'pointer',
                  }}
                  className={styles.removeButton}
                  onClick={handleArchiveSelected}
                  disabled={archived}
                >
                  {archived ? 'Archiving...' : 'Archive'}
                </button>
              </div>
            )}
          </div>
        )}
        {/* ///HERE I NEED TO CHANGE RABINDRA */}
        {archive == false && (
          <div className={styles.cardHeaderForMobile}>
            <div className={styles.FirstRowSearch}>
              {selectedLeads.length === 0 ? (
                <>
                  <div className={styles.searchBarMobile}>
                    <input
                      value={search}
                      type="text"
                      placeholder="Search customer name or id"
                      className={styles.searchInput}
                      onChange={(e) => {
                        if (e.target.value.length <= 50) {
                          e.target.value = e.target.value.replace(
                            /[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF_\- $,\.]| {2,}/g,
                            ''
                          );
                          handleSearchChange(e);
                          setSearch(e.target.value);
                          setCurrentFilter(e.target.value === '' ? backup : '');
                        }
                      }}
                    />
                    {searchTerm !== '' && (
                      <div
                        className={styles.CrossRemoveSearch}
                        onClick={handleCrossIcon}
                      >
                        <img src={ICONS.crossIconUser} alt="cross" />
                      </div>
                    )}
                  </div>
                  <HistoryRedirect />
                  {currentFilter === 'In Progress' && (
                    <LeadTableFilter
                      selectedValue={selectedValue}
                      setSelectedValue={setSelectedValue}
                    />
                  )}
                  <div className={styles.filterCallToActionMobile}>
                    <div
                      className={styles.filtericon}
                      onClick={handleAddLead}
                      data-tooltip-id="NEW"
                    >
                      <img
                        src={ICONS.AddIconSr}
                        alt=""
                        width="80"
                        height="80"
                      />
                    </div>
                    {!isMobileDevice() && !isTablet && (
                      <Tooltip
                        style={{
                          zIndex: 103,
                          background: '#f7f7f7',
                          color: '#000',
                          fontSize: 12,
                          paddingBlock: 4,
                          fontWeight: '400',
                        }}
                        offset={8}
                        id="NEW"
                        place="top"
                        content="Add New Lead"
                        delayShow={800}
                        className={styles.mobile_tooltip}
                      />
                    )}

                    <div
                      className={styles.export_btn}
                      onClick={exportCsv}
                      data-tooltip-id="export"
                      style={{
                        pointerEvents: exporting ? 'none' : 'auto',
                        opacity: exporting ? 0.6 : 1,
                        cursor: exporting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {exporting ? (
                        <MdDownloading
                          className="downloading-animation"
                          size={26}
                          color="white"
                        />
                      ) : (
                        <LuImport size={20} color="white" />
                      )}
                    </div>
                    {showTooltip && (
                      <Tooltip
                        style={{
                          zIndex: 20,
                          background: '#f7f7f7',
                          color: '#000',
                          fontSize: 12,
                          paddingBlock: 4,
                          fontWeight: '400',
                        }}
                        offset={8}
                        delayShow={800}
                        id="export"
                        place="top"
                        content="Export"
                        className={styles.mobile_tooltip}
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className={styles.selectionHeader}>
                  <div className={styles.selectionInfo}>
                    <span
                      className={styles.closeIcon}
                      onClick={() => setSelectedLeads([])}
                    >
                      <img src={ICONS.cross} alt="" height="26" width="26" />
                    </span>
                    <span>{selectedLeads.length} Selected</span>
                  </div>
                  <button
                    style={{
                      pointerEvents: archived ? 'none' : 'auto',
                      opacity: archived ? 0.6 : 1,
                      cursor: archived ? 'not-allowed' : 'pointer',
                    }}
                    className={styles.removeButton}
                    onClick={handleArchiveSelected}
                    disabled={archived}
                  >
                    {archived ? 'Archiving...' : 'Archive'}
                  </button>
                </div>
              )}
            </div>
            <div className={styles.buttonGroupMobile}>
              {pieData.map((data) => {
                let displayStatus = '';
                switch (data.name) {
                  case 'NEW':
                    displayStatus = 'New Leads';
                    break;
                  case 'PROGRESS':
                    displayStatus = 'In Progress';
                    break;
                  case 'DECLINED':
                    displayStatus = 'Declined';
                    break;
                  case 'ACTION_NEEDED':
                    displayStatus = 'Action Needed';
                    break;
                  default:
                    displayStatus = data.name;
                }
                return (
                  <button
                    key={data.name}
                    className={`${styles.button} ${currentFilter === displayStatus ? styles.buttonActive : ''}
                           ${displayStatus === 'Action Needed' ? styles.action_needed_btn : ''}`}
                    onClick={() => handleFilterClick(displayStatus)}
                    style={{
                      pointerEvents: searchTerm ? 'none' : 'auto',
                      opacity: searchTerm ? 0.6 : 1,
                      cursor: searchTerm ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <p
                      className={`${styles.status} ${currentFilter !== displayStatus ? styles.statusInactive : ''}`}
                    >
                      {data.value}
                    </p>
                    <span className={styles.displayStatus}>
                      {displayStatus}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.cardContent}>
          <LeadTable
            selectedLeads={selectedLeads}
            setSelectedLeads={setSelectedLeads}
            refresh={refresh}
            side={side}
            setSide={setSide}
            setRefresh={setRefresh}
            onCreateProposal={createProposal}
            retrieveWebProposal={retrieveProposalWrapper}
            generateWebProposal={generateProposalWrapper}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />

          {leadsData.length > 0 && !isLoading && (
            <div className="page-heading-container">
              <p className="page-heading">
                {startIndex} - {endIndex > totalcount! ? totalcount : endIndex}{' '}
                of {totalcount} item
              </p>
              <div className={styles.PaginationFont}>
                <Pagination
                  currentPage={page}
                  totalPages={totalPage}
                  paginate={paginate}
                  currentPageData={[]}
                  goToNextPage={goToNextPage}
                  goToPrevPage={goToPrevPage}
                  perPage={itemsPerPage}
                  onPerPageChange={handlePerPageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadManagementDashboard;
