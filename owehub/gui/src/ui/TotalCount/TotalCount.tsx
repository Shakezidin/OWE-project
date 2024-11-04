import React, { useEffect, useState } from 'react';
import './totalcount.css';
import TotalCard from './totalCard';
import Select from 'react-select';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';
import {
  endOfMonth,
  subDays,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  format,
} from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { toast } from 'react-toastify';
import ReportsSelectOption from '../components/selectOption/ReportsSelectOption';
import { availableStates } from '../../core/models/data_models/SelectDataModel';
import { postCaller } from '../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../infrastructure/web_api/api_client/EndPoints';
import DropdownCheckBox from '../components/DropdownCheckBox';
import { MdDownloading } from 'react-icons/md';
import { LuImport } from 'react-icons/lu';
import MicroLoader from '../components/loader/MicroLoader';
import DataNotFound from '../components/loader/DataNotFound';

// Define types for data and graph properties
interface DataPoint {
  name: string;
  pv: number;
}

interface GraphProps {
  title: string;
  stopColor: string;
  borderColor: string;
  data: DataPoint[];
}
interface Option {
  value: string;
  label: string;
}

interface DateRangeWithLabel {
  label?: string;
  start: Date;
  end: Date;
}

// Custom tooltip component
const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="customTooltip">
        <p>{label}</p>
        <p>{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const TotalCount: React.FC = () => {
  //   const graphs: GraphProps[] = [
  //     {
  //       title: 'Sales',
  //       stopColor: '#0096D3',
  //       borderColor: '#0096D3',
  //       data: [
  //         { name: 'Mon', pv: 2400 },
  //         { name: 'Tue', pv: 1398 },
  //         { name: 'Wed', pv: 9800 },
  //         { name: 'Thu', pv: 3908 },
  //         { name: 'Fri', pv: 4800 },
  //         { name: 'Sat', pv: 3800 },
  //       ],
  //     },
  //     {
  //       title: 'NTP',
  //       stopColor: '#A6CE50',
  //       borderColor: '#A6CE50',
  //       data: [
  //         { name: 'Mon', pv: 2000 },
  //         { name: 'Tue', pv: 3000 },
  //         { name: 'Wed', pv: 4000 },
  //         { name: 'Thu', pv: 2500 },
  //         { name: 'Fri', pv: 2800 },
  //         { name: 'Sat', pv: 4500 },
  //       ],
  //     },
  //     {
  //       title: 'Installs',
  //       stopColor: '#377CF6',
  //       borderColor: '#377CF6',
  //       data: [
  //         { name: 'Mon', pv: 500 },
  //         { name: 'Tue', pv: 800 },
  //         { name: 'Wed', pv: 1200 },
  //         { name: 'Thu', pv: 1500 },
  //         { name: 'Fri', pv: 1700 },
  //         { name: 'Sat', pv: 2100 },
  //       ],
  //     },
  //   ];
  const [newFormData, setNewFormData] = useState({});
  const [dealerOption, setDealerOption] = useState<Option[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<Option[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState('');
  const [isExportingData, setIsExporting] = useState(false);
  const [graphs, setGraphs] = useState<GraphProps[]>([
    { title: 'Sales', stopColor: '#0096D3', borderColor: '#0096D3', data: [] },
    { title: 'NTP', stopColor: '#A6CE50', borderColor: '#A6CE50', data: [] },
    {
      title: 'Installs',
      stopColor: '#377CF6',
      borderColor: '#377CF6',
      data: [],
    },
  ]);

  const [selectedOption, setSelectedOption] = useState<Option>({
    label: 'Daily',
    value: 'day',
  });
  const [selectedStateOption, setSelectedStateOption] = useState<Option>({
    label: 'All',
    value: '',
  });

  const leaderDealer = (newFormData: any): { value: string; label: string }[] =>
    newFormData?.dealer_name?.map((value: string) => ({
      value,
      label: value,
    }));

  const tableData = {
    tableNames: ['available_states', 'dealer_name'],
  };

  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    if (res.status > 200) {
      return;
    }
    setNewFormData((prev) => ({ ...prev, ...res.data }));
    if (res.data?.dealer_name) {
      setSelectedDealer(leaderDealer(res.data));
      setDealerOption(leaderDealer(res.data));
    }
  };

  useEffect(() => {
    getNewFormData();
  }, []);

  
  const handleReportOptionChange = (newValue: Option | null) => {
    if (newValue) {
      setSelectedReportOption(newValue);
      console.log('Selected Report Option:', newValue);
    } else {
      console.log('Report option was cleared or set to null');
    }
  };

  const handleWeeklyOption = (newValue: Option | null) => {
    if (newValue) {
      setSelectedOption(newValue);
      console.log('Selected Report Option:', newValue);
    } else {
      console.log('Report option was cleared or set to null');
    }
  };

  const handleStateOptionChange = (newValue: Option | null) => {
    if (newValue) {
      setSelectedStateOption(newValue);
      console.log('Selected State Option:', newValue);
    } else {
      console.log('State option was cleared or set to null');
    }
  };

  const handleChange = (newValue: any) => {
    console.log('jnknhb');
  };

  // Helper function to map data for daily, weekly, monthly, or yearly formats
  const mapDataToGraph = (data: Record<string, number>) => {
    return Object.entries(data).map(([date, value]) => {
      let displayName;
      if (selectedOption.value === 'week') {
        displayName = `${date.split('-')[1]}`;
      } else if (selectedOption.value === 'month') {
        const [year, month] = date.split('-');
        displayName = format(
          new Date(Number(year), Number(month) - 1),
          'MMM yyyy'
        );
      } else if (selectedOption.value === 'year') {
        displayName = date; // Display the year as is
      } else {
        displayName = format(new Date(date), 'MMM dd');
      }

      return { name: displayName, pv: value };
    });
  };

  // Date utility functions
  const today = toZonedTime(
    new Date(),
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const periodFilterOptions: DateRangeWithLabel[] = [
    {
      label: 'This Week',
      start: startOfWeek(today, { weekStartsOn: 1 }),
      end: today,
    },
    {
      label: 'Last Week',
      start: startOfWeek(subDays(today, 7), { weekStartsOn: 1 }),
      end: endOfWeek(subDays(today, 7), { weekStartsOn: 1 }),
    },
    { label: 'This Month', start: startOfMonth(today), end: today },
    {
      label: 'Last Month',
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: endOfMonth(new Date(today.getFullYear(), today.getMonth() - 1)),
    },
  ];

  const mappedPeriodOptions: Option[] = periodFilterOptions.map((period) => ({
    label: period.label ?? 'Unknown', // Fallback to "Unknown" if label is undefined
    value: `${period.start.toISOString()} - ${period.end.toISOString()}`,
  }));

  // Set the initial value for selectedReportOption to "This Week"
  const initialReportOption = periodFilterOptions.find(
    (option) => option.label === 'This Week'
  );

  const [selectedReportOption, setSelectedReportOption] = useState<Option>({
    label: initialReportOption?.label ?? 'This Week',
    value: `${initialReportOption?.start.toISOString()} - ${initialReportOption?.end.toISOString()}`,
  });

  useEffect(() => {
    const partnerNames = selectedDealer.map((dealer) => dealer.value);

    if (selectedDealer.length && selectedReportOption?.value) {
      (async () => {
        try {
          setIsLoading(true);

          const formatDate = (dateString: string): string => {
            if (!dateString) return '';
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
          };

          // Split and validate dates
          const dateRange = selectedReportOption.value.split(' - ');
          if (dateRange.length !== 2) {
            console.error(
              'Invalid date range format:',
              selectedReportOption.value
            );
            return;
          }
          const [start_date, end_date] = dateRange.map(formatDate);

          const response = await postCaller('get_milestone_data', {
            dealer_names: partnerNames,
            start_date,
            end_date,
            date_by: selectedOption.value,
            state: selectedStateOption.value,
          });

          if (response.status > 201) {
            toast.error(response.message);
            setData(''); // Clear data if error
            setGraphs([]); // Clear graphs if error
            return;
          }

          setData(response.data);
          const { ntp_data, sale_data, install_data } = response.data;

          setGraphs([
            {
              title: 'Sales',
              stopColor: '#0096D3',
              borderColor: '#0096D3',
              data: mapDataToGraph(sale_data),
            },
            {
              title: 'NTP',
              stopColor: '#A6CE50',
              borderColor: '#A6CE50',
              data: mapDataToGraph(ntp_data),
            },
            {
              title: 'Installs',
              stopColor: '#377CF6',
              borderColor: '#377CF6',
              data: mapDataToGraph(install_data),
            },
          ]);
        } catch (error) {
          console.error('Error fetching milestone data:', error);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [
    selectedOption,
    selectedStateOption,
    selectedReportOption,
    selectedDealer,
  ]);

  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        <h4 className="reports-title">Reports</h4>
        <div className="report-header-dropdown">
          <div style={{ marginTop: '-24px' }}>
            <ReportsSelectOption
              options={[
                { label: 'Daily', value: 'day' },
                { label: 'Weekly', value: 'week' },
                { label: 'Monthly', value: 'month' },
                { label: 'Yearly', value: 'year' },
              ]}
              onChange={handleWeeklyOption}
              value={selectedOption}
              menuStyles={{
                width: 400,
              }}
              menuListStyles={{
                fontWeight: 400,
                width: 150,
              }}
              singleValueStyles={{
                fontWeight: 400,
              }}
              width="150px"
            />
          </div>
          <div style={{ marginTop: '-24px' }}>
            <ReportsSelectOption
              options={mappedPeriodOptions}
              onChange={handleReportOptionChange}
              value={selectedReportOption}
              menuStyles={{
                width: 400,
              }}
              menuListStyles={{
                fontWeight: 400,
                width: 150,
              }}
              singleValueStyles={{
                fontWeight: 400,
              }}
              width="150px"
            />
          </div>

          <div style={{ marginTop: '-24px' }}>
            <ReportsSelectOption
              options={[
                { label: 'All State', value: '' }, // Default "All State" option
                ...(availableStates(newFormData) || []), // Other states
              ]}
              onChange={handleStateOptionChange}
              value={selectedStateOption}
              menuStyles={{
                width: 400,
              }}
              menuListStyles={{
                fontWeight: 400,
                width: 150,
              }}
              singleValueStyles={{
                fontWeight: 400,
              }}
              width="150px"
            />
          </div>

          <div>
            <DropdownCheckBox
              label={selectedDealer.length === 1 ? 'partner' : 'partners'}
              placeholder={'Search partners'}
              selectedOptions={selectedDealer}
              options={dealerOption}
              onChange={(val) => {
                setSelectedDealer(val);
              }}
            />
          </div>

          <div className="perf-export-btn relative pipline-export-btn">
            <button
              data-tooltip-id="export"
              className={`performance-exportbtn flex items-center justify-center totalcount-export ${isExportingData ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {isExportingData ? (
                <MdDownloading className="downloading-animation" size={20} />
              ) : (
                <LuImport size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
      <div>
        <TotalCard data={data} isLoading={isLoading}/>
      </div>
      <div className="report-graphs">
        {graphs.map((graph, index) => (
          <div key={index} className="report-graph">
            <h5 className="graph-title">{graph.title}</h5>

            {isLoading ? (
             <div className='flex items-center' style={{justifyContent:'center'}}> <MicroLoader /> </div>
            ) : graph.data.length === 0 ? (
              <div><DataNotFound/></div>
            ) : (
              <div style={{ width: '100%', height: '236px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={graph.data}>
                    <defs>
                      <linearGradient
                        id={`colorPv-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="12%"
                          stopColor={graph.stopColor}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="88%"
                          stopColor={graph.stopColor}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fontWeight: 500, fill: '#818181' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fontWeight: 500, fill: '#818181' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="pv"
                      stroke={graph.stopColor}
                      strokeWidth={3}
                      fill={`url(#colorPv-${index})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalCount;
