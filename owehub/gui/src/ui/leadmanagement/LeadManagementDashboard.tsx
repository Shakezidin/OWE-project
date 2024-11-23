import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  Sector,
} from 'recharts';
import { Tooltip as ReactTooltip, Tooltip } from 'react-tooltip';
import axios from 'axios';
import Select, { SingleValue, ActionMeta } from 'react-select';
import styles from './styles/dashboard.module.css';
import './styles/mediaQuery.css';
import { ICONS } from '../../resources/icons/Icons';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/pagination/Pagination';
import useWindowWidth from '../../hooks/useWindowWidth';
import Papa from 'papaparse';

// shams start
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {
  addMinutes,
  endOfWeek,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from 'date-fns';
import HistoryRedirect from './HistoryRedirect';
import useAuth from '../../hooks/useAuth';
import { postCaller } from '../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import MicroLoader from '../components/loader/MicroLoader';
import DataNotFound from '../components/loader/DataNotFound';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  createProposal, getLeads, getProjectByLeadId, auroraCreateProject, auroraCreateDesign, auroraCreateProposal,
  auroraWebProposal, auroraGenerateWebProposal, auroraListModules
} from '../../redux/apiActions/leadManagement/LeadManagementAction';
import LeadTable from './components/LeadDashboardTable/leadTable';
import { MdDownloading, MdHeight } from 'react-icons/md';
import { LuImport } from 'react-icons/lu';
import LeadTableFilter from './components/LeadDashboardTable/Dropdowns/LeadTopFilter';
import { debounce } from '../../utiles/debounce';
import useEscapeKey from '../../hooks/useEscape';
import renderActiveShape from './components/RenderActiveShape/renderActiveShape';
import CustomSelect from './components/CustomSelect/CustomSelect';

export type DateRangeWithLabel = {
  label?: string;
  start: Date;
  end: Date;
};

type SSEPayload =
  | {
    is_done: false;
    data: {
      current_step: number;
      total_steps: number;
    };
  }
  | {
    is_done: true;
    data: {
      current_step: number;
      total_steps: number;
      url: string;
    };
    error: null;
  }
  | {
    is_done: true;
    error: string;
    data: null;
  };

function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

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

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: '5px 10px',
          zIndex: '99',
          borderRadius: '4px',
        }}
      >
        <p
          style={{
            margin: '2px 0',
            color: '#21BC27',
            fontWeight: 'bold',
            fontSize: 11,
          }}
        >{`${payload[0].value} Closed Won`}</p>
        <p
          style={{
            margin: '2px 0',
            color: '#D91515',
            fontWeight: 'bold',
            fontSize: 11,
          }}
        >{`${payload[1].value} Closed Lost`}</p>
      </div>
    );
  }
  return null;
};

const LeadManagementDashboard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentFilter, setCurrentFilter] = useState('New Leads');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [isNewButtonActive, setIsNewButtonActive] = useState(false);
  const [selectedValue, setSelectedValue] = useState('ALL');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = page * itemsPerPage;
  const totalPage = Math.ceil(totalCount / itemsPerPage);
  const [refresh, setRefresh] = useState(1);
  const [archived, setArchived] = useState(false);
  const [isToggledX, setIsToggledX] = useState(true);
  const [side, setSide] = useState<"left" | "right">('left');
  const [isModalOpen, setIsModalOpen] = useState(false);


  const width = useWindowWidth();
  const isTablet = width <= 1024;
  const [selectedPeriod, setSelectedPeriod] =
    useState<DateRangeWithLabel | null>(
      periodFilterOptions.find((option) => option.label === 'This Week') || null
    );
  const [selectedRanges, setSelectedRanges] = useState([
    { startDate: startOfThisWeek, endDate: today, key: 'selection' },
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
  }
  useEscapeKey(handleCalenderClose);

  //CALLING FOR RANGE PICK IN USING SELECT CODE
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
  //CALLING FOR HISTORY

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

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);
  const navigate = useNavigate();

  const handleAddLead = () => {
    navigate('/leadmng-dashboard/leadmgt-addnew');
  };

  const statusMap = {
    'NEW': 'New Leads',
    'PROGRESS': 'In Progress',
    'DECLINED': 'Declined',
    'ACTION_NEEDED': 'Action Needed',
  };

  useEffect(() => {
    if (pieData.length > 0) {
      const pieName = pieData[activeIndex].name;
      const newFilter = statusMap[pieName as keyof typeof statusMap];
      setCurrentFilter(newFilter);
      setPage(1);
    }
  }, [activeIndex]);

  const handlePieClick = (_: React.MouseEvent<SVGElement>, index: number) => {
    setActiveIndex(index);
  };

  const handleFilterClick = (filter: string) => {
    setCurrentFilter(filter);
    setBackup(filter);
    setPage(1);
    setSide("left")
    setActiveIndex(
      pieData.findIndex(
        (item) => statusMap[item.name as keyof typeof statusMap] === filter
      )
    );
  };


  // ************************ API Integration By Saurabh ********************************\\
  const [isAuthenticated, setAuthenticated] = useState(false);
  const { authData, saveAuthData } = useAuth();
  const [loading, setIsLoading] = useState(false);
  useEffect(() => {
    const isPasswordChangeRequired =
      authData?.isPasswordChangeRequired?.toString();
    setAuthenticated(isPasswordChangeRequired === 'false');
  }, [authData]);

  const [lineData, setLineData] = useState([]);

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
  }, [isAuthenticated, selectedDates]);

  const defaultData: DefaultData = {
    NEW: { name: 'NEW', value: 0, color: '#21BC27' },
    PROGRESS: { name: 'PROGRESS', value: 0, color: '#377CF6' },
    DECLINED: { name: 'DECLINED', value: 0, color: '#D91515' },
    ACTION: { name: 'ACTION_NEEDED', value: 0, color: '#EC9311' },
  };
  interface DefaultData {
    [key: string]: StatusData;
  }
  interface StatusData {
    name: string;
    value: number;
    color: string;
  }
  const [pieData, setPieData] = useState<StatusData[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [archive, setArchive] = useState(false);
  const [ref, setRef] = useState(0);

  useEffect(() => {
    const calculateTotalValue = () => {
      const sum = pieData.reduce((acc, item) => acc + item.value, 0);
      setTotalValue(sum);
    };

    calculateTotalValue();
  }, [pieData]);

  const dispatch = useAppDispatch();
  const { isLoading, leadsData, statusData1, totalcount } = useAppSelector(
    (state) => state.leadManagmentSlice
  );

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
  }, [statusData1])

  const [searchTerm, setSearchTerm] = useState('')
  const [search, setSearch] = useState('');

  const handleSearchChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);

    }, 800),
    []
  );

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
        "status": statusId,
        is_archived: archive,
        progress_filter: currentFilter === 'In Progress' ? (selectedValue ? selectedValue : "ALL") : "",
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
  }, [currentFilter])
  useEffect(() => {
    if (leadsData.length > 0) {
      setTotalCount(totalcount);
    }
  }, [leadsData]);
  useEffect(() => {
    setPage(1);
  }, [selectedDates, selectedValue]);

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

  const handleNewButtonClick = () => {
    setCurrentFilter('Projects'); // Example filter name
    setIsNewButtonActive(true);
  };

  const OpenWindowClick = () => {
    setIsToggledX((prev) => !prev);
  };

  const [exporting, setIsExporting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true); // Controls tooltip visibility


  const exportCsv = async () => {
    setShowTooltip(false);
    setIsExporting(true);
    const headers = [
      'Lead ID',
      // 'Status ID',
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
      "status": statusId,
      is_archived: archive,
      progress_filter: selectedValue ? selectedValue : "ALL",
      page_size: 0,
      page_number: 0,
    };

    try {
      const response = await postCaller(
        'get_leads_home_page',
        data,
        true
      );

      if (response.status > 201) {
        toast.error(response.data.message);
        setIsExporting(false);
        return;
      }



      const csvData = response.data?.leads_data?.map?.((item: any) => [
        `OWE${item.leads_id}`,
        // item.status_id,
        item.first_name,
        item.last_name,
        item.email_id,
        `'${item.phone_number}'`,
        item.street_address,
        item.appointment_status_label,
        item.appointment_status_date ? `${format(parseISO(item.appointment_status_date), 'dd-MM-yyyy')}` : '',
        item.won_lost_label,
        item.won_lost_date ? `${format(parseISO(item.won_lost_date), 'dd-MM-yyyy')}` : '',
        item.finance_company,
        item.finance_type,
        item.qc_audit,
        item.proposal_id,
        item.proposal_status,
        item.proposal_link,
        item.proposal_updated_at ? `${format(parseISO(item.proposal_updated_at), 'dd-MM-yyyy')}` : '',
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

  //----------------Aurora API integration START-----------------------//
  const handleCreateProposal = async (leadId: number) => {


    try {
      // Step 1: Fetch preferred solar modules using dispatch
      const modulesResult = await dispatch(auroraListModules({}));

      if (auroraListModules.fulfilled.match(modulesResult)) {
        const modulesData = modulesResult.payload.data;

        if (modulesData.length > 0) {
          const moduleIds = modulesData.map((module: any) => module.id); // Extract the ids from the module list

          // Step 2: Create Project with dynamic preferred solar modules
          const createProjectResult = await dispatch(auroraCreateProject({
            "leads_id": leadId,
            "customer_salutation": "Mr./Mrs.",
            "project_type": "residential",
            "status": "In Progress",
            "preferred_solar_modules": moduleIds,
            "tags": ["third_party_1"]
          }));

          if (auroraCreateProject.fulfilled.match(createProjectResult)) {
            // toast.success('Project created successfully!');

            // Step 3: Create Design
            const createDesignResult = await dispatch(auroraCreateDesign({ leads_id: leadId }));

            if (auroraCreateDesign.fulfilled.match(createDesignResult)) {
              // toast.success('Design created successfully!');

              // Step 4: Create Proposal
              const createProposalResult = await dispatch(auroraCreateProposal({ leads_id: leadId }));

              if (auroraCreateProposal.fulfilled.match(createProposalResult)) {
                const proposalData = createProposalResult.payload.data;

                if (proposalData.proposal_link) {
                  // Step 5: Generate Web Proposal
                  await downloadProposalWithSSE(leadId);

                  toast.success('Proposal created successfully!');
                  setRefresh((prev) => prev + 1);

                  // Open the proposal link in a new tab
                  window.open(proposalData.proposal_link, '_blank');
                } else {
                  toast.error('Proposal link not available.');
                }
              } else {
                toast.error(createProposalResult.payload as string || 'Failed to create proposal');
              }
            } else {
              toast.error(createDesignResult.payload as string || 'Failed to create design');
            }
          } else {
            toast.error(createProjectResult.payload as string || 'Failed to create project');
          }
        } else {
          toast.error('No solar modules available.');
        }
      } else {
        toast.error('Failed to fetch solar modules');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error in handleCreateProposal:', error);
    }
  };

  const generateWebProposal = async (leadId: number) => {
    try {
      //Generate Web Proposal
      const generateProposalResult = await dispatch(auroraGenerateWebProposal({ leads_id: leadId }));

      if (auroraGenerateWebProposal.fulfilled.match(generateProposalResult)) {
        const generatedProposalData = generateProposalResult.payload.data;
        if (generatedProposalData.url) {
          toast.success('Web proposal generated successfully!');
          return generatedProposalData;
        } else {
          toast.error('Failed to generate web proposal.');
          return null;
        }
      } else {
        // toast.error(generateProposalResult.payload as string || 'Failed to generate web proposal');
        return null;
      }
    } catch (error) {
      toast.error('An unexpected error occurred while generating the web proposal');
      console.error('Error in generateWebProposal:', error);
      return null;
    }
  };

  const retrieveWebProposal = async (leadId: number) => {
    try {
      //Retrieve Web Proposal
      const webProposalResult = await dispatch(auroraWebProposal(leadId));

      if (auroraWebProposal.fulfilled.match(webProposalResult)) {
        const webProposalData = webProposalResult.payload.data;

        if (webProposalData.url) {
          toast.success('Web proposal retrieved successfully!');
          window.open(webProposalData.url, '_blank');
        } else if (webProposalData.url_expired) {
          toast.error('Web proposal URL has expired. Please regenerate.');
        } else {
          toast.error('No web proposal available.');
        }
      } else {
        // toast.error(webProposalResult.payload as string || 'Failed to retrieve web proposal');
      }
    } catch (error) {
      toast.error('An unexpected error occurred while retrieving the web proposal');
      console.error('Error in retrieveWebProposal:', error);
    }
  };

  const downloadProposalWithSSE = (leadId: number) => {


    const eventSource = new EventSource(
      `https://staging.owe-hub.com/api/owe-leads-service/v1/aurora_generate_pdf?leads_id=${leadId}`
    );

    eventSource.onmessage = (event) => {
      const payload: SSEPayload = JSON.parse(event.data);

      if (!payload.is_done) {
        const progressPercentage = (payload.data.current_step / payload.data.total_steps) * 100;
        console.log(`PDF generation in progress: Step ${payload.data.current_step} of ${payload.data.total_steps}`);
      } else if (payload.is_done) {

        eventSource.close(); // Close the connection once the PDF is ready or an error occurs
      }
    };

    eventSource.onerror = (error) => {
      console.error('Error with SSE connection', error);
    };
  };
  //----------------Aurora API integration END-------------------------//

  const [backup, setBackup] = useState('New Leads');

  useEffect(() => {
    if (searchTerm === '') {
      setCurrentFilter(backup);
      setPage(1);
    }
  }, [searchTerm]);

  const handleCrossIcon = () => {
    setCurrentFilter(backup);
    setSearchTerm('');
    setSearch('');
  }

  const isMobileDevice = () => {
    return (
      typeof window !== 'undefined' &&
      (window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    );
  };
  //*************************************************************************************************//
  return (
    <div className={styles.dashboard}>
      <div className={styles.chartGrid}>
        <div className={styles.horizontal}>

          <div className={styles.FirstColHead}>
            {/* HERE FOR TOGGLE VIEW WHEN HIDE OTHER BOTTONS */}

            {isToggledX && (
              <div className={styles.customLeftRRR}>
                Overview
              </div>
            )}
            <div className={`${styles.customRight} ${styles.customFont}`}>
              Total leads : {totalValue ? totalValue : '0'}
            </div>
          </div>
          <div className={styles.SecondColHead}>
            {
              isToggledX == false && <div className={styles.MobileViewHide}>
                Total leads : {totalValue ? totalValue : '0'}
              </div>
            }
            {/* CARD DESIGNING STRTED */}
            <div>
              {isToggledX && <div className={styles.customLeftRRR}
              >Total Won Lost</div>}
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
                    {isToggledX && <span className={styles.date_display}>
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
                    }
                  </div>
                )}
                {isToggledX && <CustomSelect
                  value={selectedPeriod}
                  onChange={handlePeriodChange}
                  options={periodFilterOptions}
                  isToggledX={isToggledX}
                />}
                {isToggledX && <div
                  ref={toggleRef}
                  className={styles.calender}
                  onClick={toggleCalendar}
                >
                  <img src={ICONS.includes_icon} alt="" />
                </div>}


                <div onClick={OpenWindowClick} className={styles.ButtonAbovearrov} data-tooltip-id="downip">
                  {isToggledX ? (
                    <div className={styles.upKeys_DownKeys} style={{ fontSize: '20px' }}><img className={styles.ArrowD} src={ICONS.DashboardNewIcon} /></div>
                  ) : (<div className={styles.upKeys_DownKeysX} style={{ fontSize: '20px' }}>
                    <img className={styles.ArrowDX} src={ICONS.DashboardNewIcon} />
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

                    fontWeight: "400"
                  }}
                  offset={8}
                  delayShow={800}
                  id="downip"
                  place="top"
                  content={isToggledX ? "Minimize" : "Maximize"}
                  className={styles.mobile_tooltip}
                />

              </div>

            </div>
          </div>
        </div>
        {/* //HORIZONTAL ENDED */}
        {isToggledX && <div className={styles.vertical1}>
          <div className={styles.FirstColHeadMobile}>

            <div className={`${styles.customLeftMobile} ${styles.customFont}`}>
              Overview
            </div>

            <div className={styles.customFont}>
              Total leads : {totalValue ? totalValue : '0'}
            </div>
          </div>

          <div style={{ width: "120%" }}>
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
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart className={styles.pieChart}>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onClick={handlePieClick}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.legend}>
                  {pieData.map((item) => (
                    <div key={item.name} className={styles.legendItem}>
                      <div
                        className={styles.legendColor}
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className={styles.legendText}>{item.name} LEADS</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <DataNotFound />
            )}
          </div>
        </div>}
        {/* VERTICAL 1 ENDED */}
        {isToggledX && <div className={styles.vertical2}>
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
              <ResponsiveContainer
                className={styles.chart_main_grid}
                width="100%"
                height={300}
              >
                <LineChart data={lineData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend
                    className={styles.lineChart_legend}
                    formatter={(value) =>
                      value === 'won' ? 'Total won' : 'Total Lost'
                    }
                    wrapperStyle={{
                      fontSize: '12px',
                      fontWeight: 550,
                      marginBottom: -15,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="won"
                    stroke="#21BC27"
                    strokeWidth={2}
                    name="won"
                  />
                  <Line
                    type="monotone"
                    dataKey="lost"
                    stroke="#D91515"
                    strokeWidth={2}
                    name="lost"
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          ) : (
            <DataNotFound />
          )}
        </div>

        }
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
                        <span className={styles.displayStatus}>{displayStatus}</span>
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
                    <div className={styles.CrossRemoveSearch}
                      onClick={handleCrossIcon}
                    >
                      <img
                        src={ICONS.crossIconUser}
                        alt="cross"

                      />
                    </div>
                  )}
                </div>
                {/* RABINDRA */}
                {/* HERE THE PART OF CODE WHERE REDIRECT TO ACHIEVES STARTED */}
                <HistoryRedirect />
                {currentFilter === 'In Progress' && (
                  <LeadTableFilter selectedValue={selectedValue} setSelectedValue={setSelectedValue} />

                )}
                <div className={styles.filterCallToAction}>
                  <div className={styles.filtericon} onClick={handleAddLead} data-tooltip-id="NEW">
                    <img src={ICONS.AddIconSr} alt="" width="80" height="80" />
                  </div>
                  <Tooltip
                    style={{
                      zIndex: 103,
                      background: '#f7f7f7',
                      color: '#000',
                      fontSize: 12,
                      paddingBlock: 4,
                      fontWeight: "400"
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
                  {showTooltip &&
                    <Tooltip
                      style={{
                        zIndex: 103,
                        background: '#f7f7f7',
                        color: '#000',
                        fontSize: 12,
                        paddingBlock: 4,
                        fontWeight: "400"
                      }}
                      offset={8}
                      delayShow={800}
                      id="export"
                      place="top"
                      content="Export"
                      className={styles.mobile_tooltip}
                    />
                  }
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
                      <div className={styles.CrossRemoveSearch} onClick={handleCrossIcon} >
                        <img src={ICONS.crossIconUser} alt="cross" />
                      </div>
                    )}
                  </div>
                  <HistoryRedirect />
                  {currentFilter === 'In Progress' && (
                    <LeadTableFilter selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
                  )}



                  <div className={styles.filterCallToActionMobile}>
                    <div className={styles.filtericon} onClick={handleAddLead} data-tooltip-id="NEW">
                      <img src={ICONS.AddIconSr} alt="" width="80" height="80" />
                    </div>
                    {!isMobileDevice() && !isTablet &&
                      <Tooltip
                        style={{
                          zIndex: 103,
                          background: '#f7f7f7',
                          color: '#000',
                          fontSize: 12,
                          paddingBlock: 4,
                          fontWeight: "400"
                        }}
                        offset={8}
                        id="NEW"
                        place="top"
                        content="Add New Lead"
                        delayShow={800}
                        className={styles.mobile_tooltip}
                      />
                    }

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
                    {showTooltip &&
                      <Tooltip
                        style={{
                          zIndex: 20,
                          background: '#f7f7f7',
                          color: '#000',
                          fontSize: 12,
                          paddingBlock: 4,
                          fontWeight: "400"
                        }}
                        offset={8}
                        delayShow={800}
                        id="export"
                        place="top"
                        content="Export"
                        className={styles.mobile_tooltip}
                      />
                    }
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
              )}</div>
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
                    <span className={styles.displayStatus}>{displayStatus}</span>
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
            onCreateProposal={handleCreateProposal}
            retrieveWebProposal={retrieveWebProposal}
            generateWebProposal={generateWebProposal}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />

          {leadsData.length > 0 && !isLoading && (
            <div className="page-heading-container">
              <p className="page-heading">
                {startIndex} -  {endIndex > totalcount! ? totalcount : endIndex} of {totalcount} item
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
