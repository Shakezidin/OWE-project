import React, { useState, useEffect, useRef } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Sector,
} from 'recharts';
import Select, { SingleValue, ActionMeta } from 'react-select';
import styles from './styles/dashboard.module.css';
import './styles/mediaQuery.css';
import { ICONS } from '../../resources/icons/Icons';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/pagination/Pagination';
import ArchiveModal from './Modals/LeaderManamentSucessModel';
import ConfirmModel from './Modals/ConfirmModel';
import useWindowWidth from '../../hooks/useWindowWidth';
import ThreeDotsImage from './Modals/Modalimages/ThreeDots.svg';

// shams start
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { toZonedTime } from 'date-fns-tz';
import {
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from 'date-fns';
import HistoryRedirect from '../Library/HistoryRedirect';
import useAuth from '../../hooks/useAuth';
import { postCaller } from '../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import MicroLoader from '../components/loader/MicroLoader';
import DataNotFound from '../components/loader/DataNotFound';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getLeads } from '../../redux/apiActions/leadManagement/LeadManagementAction';
import ArchivedPages from './ArchievedPages';
// import { Select } from 'react-day-picker';
// import styles from './styles/lmhistory.module.css';

export type DateRangeWithLabel = {
  label?: string;
  start: Date;
  end: Date;
};
interface StatusData {
  name: string;
  value: number;
  color: string;
}

function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getCurrentDateInUserTimezone() {
  const now = new Date();
  const userTimezone = getUserTimezone();
  return toZonedTime(now, userTimezone);
}

const today = getCurrentDateInUserTimezone();
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
// shams end

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: string;
};





const leads = [
  {
    id: '1',
    name: 'Adam Samson',
    phone: '+00 876472822',
    email: 'adamsamson8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Pending',
  },
  {
    id: '2',
    name: 'Kilewan dicho',
    phone: '+00 876472822',
    email: 'Kilewanditcho8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Pending',
  },
  {
    id: '3',
    name: 'Adam Samson',
    phone: '+00 876472822',
    email: 'Paul mark8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Pending',
  },
  {
    id: '4',
    name: 'Kilewan dicho',
    phone: '+00 876472822',
    email: 'Paul mark8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Pending',
  },
  {
    id: '5',
    name: 'Adam Samson',
    phone: '+00 876472822',
    email: 'adamsamson8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Sent',
  },
  {
    id: '6',
    name: 'Adam Samson',
    phone: '+00 876472822',
    email: 'adamsamson8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Sent',
  },
  {
    id: '7',
    name: 'Kilewan dicho',
    phone: '+00 876472822',
    email: 'Kilewanditcho8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Sent',
  },
  {
    id: '8',
    name: 'Adam Samson',
    phone: '+00 876472822',
    email: 'Paul mark8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Sent',
  },
  {
    id: '9',
    name: 'Rabindra Kumar Sharma',
    phone: '+00 876472822',
    email: 'rabindr718@gmail.com',
    address: 'Patel Nagar, Dehradun, UK',
    status: 'Accepted',
  },
  {
    id: '10',
    name: 'Adam',
    phone: '+00 876472822',
    email: 'adam8772@gmail.com',
    address: '12778 Domingo Ct',
    status: 'Declined',
  },
  {
    id: '11',
    name: 'Adam',
    phone: '+00 876472822',
    email: 'adam8772@gmail.com',
    address: '12778 Domingo Ct',
    status: 'Action Needed',
  },
  {
    id: '12',
    name: 'Kilewan dicho',
    phone: '+00 876472822',
    email: 'Paul mark8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Accepted',
  },
  {
    id: '13',
    name: 'XYZ Name',
    phone: '+00 876472822',
    email: 'xyz8772@gmail.com',
    address: '12778 Domingo Ct',
    status: 'Action Needed',
  },
  {
    id: '14',
    name: 'Virendra Sehwag',
    phone: '+00 876472822',
    email: 'sehwag8772@gmail.com',
    address: '12333 Domingo Ct',
    status: 'Action Needed',
  },
  {
    id: '15',
    name: 'Bhuvneshwar Kumar',
    phone: '+00 876472822',
    email: 'bhuvi8772@gmail.com',
    address: '12333 Domingo Ct',
    status: 'No Response',
  },
  {
    id: '16',
    name: 'Jasprit Bumrah',
    phone: '+00 876472822',
    email: 'jasprit8772@gmail.com',
    address: '12333 Domingo Ct',
    status: 'Update Status',
  },
  {
    id: '17',
    name: 'Risabh Pant',
    phone: '+00 876472822',
    email: 'rp8772@gmail.com',
    address: 'haridwar, Delhi',
    status: 'No Response',
  },
  {
    id: '18',
    name: 'Virat Kohli',
    phone: '+00 876472822',
    email: 'king8772@gmail.com',
    address: '12333 Domingo Ct',
    status: 'Deal Won',
  },
];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  // Center text in pie chart

  const splitText = (text: string, width: number) => {
    const words = text.split(' ');
    const lines = [];
    let line = '';

    words.forEach((word: string) => {
      const testLine = line + word + ' ';
      if (testLine.length > width) {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    });
    lines.push(line.trim());
    return lines;
  };

  const lines = splitText(payload.name, 15);

  return (
    <g>
      <text
        x={cx}
        y={cy - (lines.length - 1) * 6}
        textAnchor="middle"
        fill={fill}
      >
        {lines.map((line, index) => (
          <tspan
            key={index}
            x={cx}
            dy={index ? 15 : 0}
            style={{
              fontSize: '12.07px',
              wordBreak: 'break-word',
              fontWeight: 550,
            }}
          >
            {line}
          </tspan>
        ))}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        style={{ fontSize: '12.07px' }}
      >
        {`${value}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        style={{ fontSize: '12.07px' }}
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return '#FF832A';
    case 'Sent':
      return '#81A6E7';
    case 'Accepted':
      return '#52B650';
    case 'Declined':
      return '#CD4040';
    case 'Action Needed':
      return '#63ACA3';
    default:
      return '#000000';
  }
};

// const ActionNeeded={
//   'Action Needed': 'Action Needed',
//   'Action Needed': 'Action Needed',
//   'Action Needed': 'Action Needed',
//   'Action Needed': 'Action Needed',
// }
const statusMap = {
  'Pending leads': 'Pending',
  'Appointment accepted': 'Accepted',
  'Appointment sent': 'Sent',
  'Appointment declined': 'Declined',
  'Action Needed': 'Action Needed',
};

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
          // border: '1px solid #f0f0f0',
          borderRadius: '4px',
          // boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <p
          style={{
            margin: '2px 0',
            color: '#57B93A',
            fontWeight: 'bold',
            fontSize: 11,
          }}
        >{`${payload[0].value} Closed Won`}</p>
        <p
          style={{
            margin: '2px 0',
            color: '#CD4040',
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
  const [currentFilter, setCurrentFilter] = useState('Pending');
  const [filteredLeads, setFilteredLeads] = useState(leads);
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [leadToArchive, setLeadToArchive] = useState<Lead | null>(null);

  const width = useWindowWidth();
  const isTablet = width <= 1024;
  // shams start
  const [selectedPeriod, setSelectedPeriod] = useState<DateRangeWithLabel | null>(
    periodFilterOptions.find((option) => option.label === 'This Week') || null
  );
  const [selectedRanges, setSelectedRanges] = useState([
    { startDate: new Date(), endDate: new Date(), key: 'selection' },
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

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dateRangeRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const [toggledId, setToggledId] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = page * itemsPerPage;
  const totalPage = Math.ceil(totalCount / 10);

  const paginate = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const goToNextPage = () => {
    setPage(page + 1);
  };

  const goToPrevPage = () => {
    setPage(page - 1);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen((prevState) => !prevState);
  };

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
  // shams end
  // const itemsPerPage = 10;
  const navigate = useNavigate();

  const handleAddLead = () => {
    navigate('/leadmgt-addnew');
  };

  useEffect(() => {
    if (pieData.length > 0) {
      const pieName = pieData[activeIndex].name;
      const newFilter = statusMap[pieName as keyof typeof statusMap];
      setCurrentFilter(newFilter);
      setFilteredLeads(leads.filter((lead) => lead.status === newFilter));
    }
  }, [activeIndex]);

  const handlePieClick = (_: React.MouseEvent<SVGElement>, index: number) => {
    setActiveIndex(index);
  };

  const handleFilterClick = (filter: string) => {
    setCurrentFilter(filter);
    setFilteredLeads(leads.filter((lead) => lead.status === filter));
    setActiveIndex(
      pieData.findIndex(
        (item) => statusMap[item.name as keyof typeof statusMap] === filter
      )
    );
  };



  const handleLeadSelection = (lead: Lead) => {
    setSelectedLeads((prev) =>
      prev.includes(lead) ? prev.filter((l) => l !== lead) : [...prev, lead]
    );
  };

  const handleArchiveSelected = () => {
    // Implement the logic to remove selected leads
    setFilteredLeads((prev) =>
      prev.filter((lead) => !selectedLeads.includes(lead))
    );
    setSelectedLeads([]);
  };

  const handleReschedule = (lead: any) => {
    console.log(`Lead ${lead.name} is being rescheduled`);
    handleFilterClick('Pending'); // Switch to the "Pending" tab
  };

  const handleArchive = (lead: Lead) => {
    setLeadToArchive(lead); // Store the lead to be archived
    setShowArchiveModal(true); // Show the modal
  };

  const handleDetailModal = (lead: Lead) => {
    setShowConfirmModal(true); // Show detail modal
  };

  const handleChevronClick = (itemId: number) => {
    console.log(itemId);
    setToggledId((prevToggledId) =>
      prevToggledId.includes(itemId)
        ? []
        : [itemId]
    );
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          const response = await postCaller('get_periodic_won_lost_leads', {
            start_date: selectedDates.startDate
              ? format(selectedDates.startDate, 'dd-MM-yyyy')
              : '',
            end_date: selectedDates.endDate
              ? format(selectedDates.endDate, 'dd-MM-yyyy')
              : '',
            },true);

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
    PENDING: { name: 'Pending leads', value: 0, color: '#FF832A' },
    SENT: { name: 'Appointment sent', value: 0, color: '#81A6E7' },
    ACCEPTED: { name: 'Appointment accepted', value: 0, color: '#52B650' },
    DECLINED: { name: 'Appointment declined', value: 0, color: '#CD4040' },
    'ACTION NEEDED': { name: 'Action Needed', value: 0, color: '#63ACA3' },
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

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await postCaller('get_leads_count_by_status', {
            start_date: selectedDates.startDate
              ? format(selectedDates.startDate, 'dd-MM-yyyy')
              : '',
            end_date: selectedDates.endDate
              ? format(selectedDates.endDate, 'dd-MM-yyyy')
              : '',
          },true);

          if (response.status === 200) {
            const apiData = response.data.leads;
            const formattedData = apiData.reduce((acc: DefaultData, item: any) => {
              acc[item.status_name] = {
                name: defaultData[item.status_name].name,
                value: item.count,
                color: defaultData[item.status_name].color,
              };
              return acc;
            }, {} as DefaultData);
            const mergedData = Object.values({ ...defaultData, ...formattedData }) as StatusData[];
            setPieData(mergedData);
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

  useEffect(() => {
    const calculateTotalValue = () => {
      const sum = pieData.reduce((acc, item) => acc + item.value, 0);
      setTotalValue(sum);
    };

    calculateTotalValue();
  }, [pieData]);


  const dispatch = useAppDispatch();
  const { isLoading, leadsData, totalcount } = useAppSelector(
    (state) => state.leadManagmentSlice
  );

  useEffect(() => {
    if (isAuthenticated) {
      let statusId;
      switch (currentFilter) {
        case 'Action Needed':
          statusId = 4;
          break;
        case 'Pending':
          statusId = 0;
          break;
        case 'Sent':
          statusId = 1;
          break;
        case 'Accepted':
          statusId = 2;
          break;
        case 'Declined':
          statusId = 3;
          break;
        default:
          statusId = 0;
      }


      const data = {
        start_date: selectedDates.startDate
          ? format(selectedDates.startDate, 'dd-MM-yyyy')
          : '',
        end_date: selectedDates.endDate
          ? format(selectedDates.endDate, 'dd-MM-yyyy')
          : '',
        status_id: statusId,
        is_archived: archive,
        page_size: 10,
        page_number: page,
      };

      dispatch(getLeads(data));
    }
  }, [selectedDates, archive, isAuthenticated, itemsPerPage, page, currentFilter]);

  useEffect(() => {
    if (leadsData.length > 0) {
      setTotalCount(totalcount);
    }
  }, [leadsData])
  //************************************************************************************************ */
  return (
    <div className={styles.dashboard}>
      <div style={{ marginLeft: 6, marginTop: 6 }}>
        <div className="breadcrumb-container" style={{ marginLeft: 0 }}>
          <div className="bread-link">
            <div className="" style={{ cursor: 'pointer' }}>
              <h3>Lead Management</h3>
            </div>
            <div className="">
              <p style={{ color: 'rgb(4, 165, 232)', fontSize: 14 }}></p>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmModel isOpen1={isModalOpen} onClose1={handleCloseModal} />
      )}

      {showArchiveModal && (
        <ArchiveModal
        // isOpen={filterOPen} handleClose={filterClose}
        />
      )}

      <div className={styles.chartGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeaderFirst}>
            Overview
            <div>Total leads: {totalValue ? totalValue : '0'}</div>
          </div>
          <div className={styles.cardContent}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MicroLoader />
              </div>
            ) : (
              lineData.length > 0 ? (
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
                        <span className={styles.legendText}>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <DataNotFound />
              )
            )}
          </div>
        </div>

        <div className={`${styles.card} ${styles.lineCard}`}>
          {/* shams start */}
          <div className={styles.cardHeaderSecond}>
            <span>Total Won Lost</span>
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
                  <span className={styles.date_display}>
                    {
                      selectedDates.startDate.toLocaleDateString('en-US', {
                        day: 'numeric',
                      }) +
                      ' ' +
                      selectedDates.startDate.toLocaleDateString('en-US', {
                        month: 'short',
                      }) +
                      ', ' +
                      selectedDates.startDate.getFullYear()
                    }
                    {' - '}
                    {
                      selectedDates.endDate.toLocaleDateString('en-US', {
                        day: 'numeric',
                      }) +
                      ' ' +
                      selectedDates.endDate.toLocaleDateString('en-US', {
                        month: 'short',
                      }) +
                      ', ' +
                      selectedDates.endDate.getFullYear()
                    }
                  </span>
                </div>
              )}

              {/* RABINDR718.....DATE_PICKER STARTED */}
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
                    '&:focus-within': {
                      borderColor: '#377CF6',
                      boxShadow: '0 0 0 1px #377CF6',
                      caretColor: '#3E3E3E',
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
                    fontWeight: "400",
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
                ref={toggleRef}
                className={styles.calender}
                onClick={toggleCalendar}
              >
                <img src={ICONS.includes_icon} alt="" />
              </div>
            </div>
          </div>
          {/* RABINDR718.....DATE_PICKER ENDED */}
          <div
            className={`${styles.cardContent} ${styles.lineChart_div} lineChart-wrapper`}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MicroLoader />
              </div>
            ) : (
              lineData.length > 0 ? (
                <>
                  <ResponsiveContainer
                    className={styles.chart_main_grid}
                    width="100%"
                    height={300}
                  >
                    <LineChart data={lineData}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
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
                        stroke="#57B93A"
                        strokeWidth={2}
                        name="won"
                      />
                      <Line
                        type="monotone"
                        dataKey="lost"
                        stroke="#CD4040"
                        strokeWidth={2}
                        name="lost"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <DataNotFound />
              )
            )}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        {
          archive == true &&
          <ArchivedPages setArchive={setArchive} />
        }
        {archive == false &&
          <div className={`${styles.cardHeader} ${styles.tabs_setting}`}>
            {selectedLeads.length === 0 ? (
              <>
                <div className={styles.buttonGroup}>
                  {pieData.map((data) => {
                    let displayStatus = '';
                    switch (data.name) {
                      case 'Pending leads':
                        displayStatus = 'Pending';
                        break;
                      case 'Appointment sent':
                        displayStatus = 'Sent';
                        break;
                      case 'Appointment accepted':
                        displayStatus = 'Accepted';
                        break;
                      case 'Appointment declined':
                        displayStatus = 'Declined';
                        break;
                      case 'Action Needed':
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
                      >
                        <p
                          className={`${styles.status} ${currentFilter !== displayStatus ? styles.statusInactive : ''}`}
                        >
                          {data.value}
                        </p>
                        {displayStatus}
                      </button>
                    );
                  })}
                </div>

                {/* RABINDRA */}
                {/* HERE THE PART OF CODE WHERE REDIRECT TO ACHIEVES STARTED */}
                <HistoryRedirect setArchive={setArchive} />

                <div className={styles.filterCallToAction}>
                  <div className={styles.filtericon} onClick={handleAddLead}>
                    <img src={ICONS.AddIconSr} alt="" width="80" height="80" />
                  </div>
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
                  className={styles.removeButton}
                  onClick={handleArchiveSelected}
                >
                  Archived
                </button>
              </div>
            )}
          </div>
        }

        <div className={styles.cardContent}>
          {archive == false &&
            <table className={styles.table}>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={leadsData.length}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <MicroLoader />
                      </div>
                    </td>
                  </tr>
                ) : leadsData.length > 0 ? (
                  leadsData.map((lead: any, index: number) => (
                    <React.Fragment key={index}>
                      <tr className={styles.history_lists}>
                        <td
                          className={`${lead.status === 'Declined' || lead.status === 'Action Needed' ? styles.history_list_inner_declined : styles.history_list_inner}`}
                          onClick={() =>
                            lead.status === 'Declined' ||
                              lead.status === 'Action Needed'
                              ? ''
                              : handleOpenModal()
                          }
                        >
                          <label>
                            <input
                              type="checkbox"
                              checked={selectedLeads.includes(lead)}
                              onChange={() => handleLeadSelection(lead)}
                            />
                          </label>
                          <div
                            className={styles.user_name}
                            onClick={() =>
                              currentFilter == 'Pending' && handleDetailModal(lead)
                            }
                          >
                            <h2>{lead.first_name} {lead.last_name}</h2>
                            <p style={{ color: getStatusColor(currentFilter) }}>
                              {currentFilter}
                            </p>
                          </div>
                          <div className={styles.phone_number}>{lead.phone_number}</div>
                          <div className={styles.email}>
                            <span>
                              {lead.email_id}
                              <img
                                className="ml1"
                                height={15}
                                width={15}
                                src={ICONS.complete}
                                alt="verified"
                              />
                            </span>
                          </div>
                          <div className={styles.address}>{lead.city ? lead.city : "N/A"}</div>

                          {currentFilter === 'Declined' && (
                            <div className={styles.actionButtons}>
                              <button
                                onClick={() => handleReschedule(lead)}
                                className={styles.rescheduleButton}
                              >
                                Reschedule
                              </button>
                              {isTablet ? (
                                <button
                                  onClick={() => handleArchive(lead)}
                                  className={styles.archiveButton}
                                >
                                  <img src={ICONS.declinedArchive} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleArchive(lead)}
                                  className={styles.archiveButton}
                                >
                                  Archive
                                </button>
                              )}
                            </div>
                          )}

                          {currentFilter === 'Action Needed' && (
                            <div className={styles.actionButtons}>
                              <button
                                onClick={() => handleReschedule(lead)}
                                className={styles.rescheduleButton}
                              >
                                Reschedule
                              </button>
                            </div>
                          )}

                          <div
                            className={styles.chevron_down}
                            onClick={() => handleChevronClick(lead["leads_id "])}

                          >
                            <img
                              src={
                                toggledId.includes(lead["leads_id "])
                                  ? ICONS.chevronUp
                                  : ICONS.chevronDown
                              }
                              alt={
                                toggledId.includes(lead["leads_id "])
                                  ? 'chevronUp-icon'
                                  : 'chevronDown-icon'
                              }
                            />
                          </div>
                        </td>
                      </tr>

                      {toggledId.includes(lead["leads_id "]) && (
                        <tr>
                          <td colSpan={5} className={styles.detailsRow}>
                            <div className={''}>{lead.phone_number}</div>
                            <div className={''}>
                              <span>
                                {lead.email_id}
                                <img
                                  className="ml1"
                                  height={15}
                                  width={15}
                                  src={ICONS.complete}
                                  alt="verified"
                                />
                              </span>
                            </div>
                            <div className={''}>{lead.city ? lead.city : "N/A"}</div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr style={{ border: 0 }}>
                    <td colSpan={10}>
                      <DataNotFound />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          }


          {leadsData.length > 0 && (
            <div className={styles.leadpagination}>

              <div className={styles.leftitem}>
                <p className={styles.pageHeading}>
                  {startIndex} - {endIndex} of {totalcount} item
                </p>
              </div>

              <div className={styles.rightitem}>
                <Pagination
                  currentPage={page}
                  totalPages={totalPage}
                  paginate={paginate}
                  currentPageData={[]}
                  goToNextPage={goToNextPage}
                  goToPrevPage={goToPrevPage}
                  perPage={itemsPerPage}
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
