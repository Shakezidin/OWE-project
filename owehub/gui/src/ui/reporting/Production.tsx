import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import SelectOption from '../components/selectOption/SelectOption';
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
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  subYears,
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
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';
import TableData from './TableData';
import LineGraph from './components/LineGraph';
import ChartBar from './components/BarChart';
import BarChartExample from './components/BarChart';
import TableCustom from './components/Tables/CustomTable';

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



const Production: React.FC = () => {
  const [newFormData, setNewFormData] = useState({});
  const [dealerOption, setDealerOption] = useState<Option[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<Option[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState('');
  const [isExportingData, setIsExporting] = useState(false);
  const [graphs, setGraphs] = useState<GraphProps[]>([
    { title: 'Scheduled', stopColor: '#0096D3', borderColor: '#0096D3', data: [] },
    { title: 'Fixed Scheduled', stopColor: '#A6CE50', borderColor: '#A6CE50', data: [] },
    {
      title: 'Completed',
      stopColor: '#377CF6',
      borderColor: '#377CF6',
      data: [],
    },
    {
      title: 'Fix Completed',
      stopColor: '#377CF6',
      borderColor: '#377CF6',
      data: [],
    },
  ]);

  const [selectedOption, setSelectedOption] = useState<Option>({
    label: 'Daily',
    value: 'day',
  });
  const [reportType, setReportType] = useState<Option>(
    {
      label: 'Install',
      value: 'install',
    }
  );
  const [selectedStateOption, setSelectedStateOption] = useState<Option>({
    label: 'All State',
    value: 'All',
  });

  const leaderDealer = (newFormData: any): { value: string; label: string }[] =>
    newFormData?.dealer_name?.map((value: string) => ({
      value,
      label: value,
    }));

  const tableData = {
    tableNames: ['available_states', 'dealer_name'],
  };

  const exportCsv = async () => {
    try {
      const selectedDate = selectedReportOption.value.split(' - ');
      const start_date = selectedDate[0];
      const end_date = selectedDate[1];
      const headers = [
        'Unique ID',
        'Customer Name',
        'Install Date',
        'NTP Date',
        'Sale Date',
      ];
      setIsExporting(true);

      const data = await postCaller('get_milestone_data_csv_download', {
        dealer_names: selectedDealer.map((dealer) => dealer.value),
        start_date,
        end_date,
        state:
          selectedStateOption.value === 'All'
            ? ''
            : selectedStateOption.value === ''
              ? ''
              : selectedStateOption.value,
      });
      if (data.status > 200) {
        toast.error(data.message);
        setIsExporting(false);
        return;
      }
      setIsExporting(false);
      const csvData = Object.entries(
        data?.data as Record<
          string,
          {
            install_date?: string;
            ntp_date?: string;
            sale_date?: string;
            customer_name: string;
          }
        >
      ).map(([key, value]) => {
        const installDate = value.install_date
          ? format(new Date(value.install_date), 'dd-MM-yyyy')
          : '';
        const ntpDate = value.ntp_date
          ? format(new Date(value.ntp_date), 'dd-MM-yyyy')
          : '';
        const saleDate = value.sale_date
          ? format(new Date(value.sale_date), 'dd-MM-yyyy')
          : '';
        return [key, value.customer_name, installDate, ntpDate, saleDate];
      });
      const csvRows = [headers, ...csvData];
      const csvString = Papa.unparse(csvRows);
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reports.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error((error as Error).message as string);
    }
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
      const newMappedOptions = periodFilterOptions
        .filter((period) => {
          const label = period.label ?? '';
          if (newValue.value === 'day') {
            return [
              'This Week',
              'Last Week',
              'This Month',
              'Last Month',
            ].includes(label);
          }
          if (newValue.value === 'week') {
            return [
              'Current Week',
              'Current Month',
              'Last Month',
              'This Quarter',
              'Last Quarter',
            ].includes(label);
          }
          if (newValue.value === 'month') {
            return [
              'This Month',
              'This Quarter',
              'Last Quarter',
              'This Year',
              'Last Year',
            ].includes(label);
          }
          if (newValue.value === 'year') {
            return [
              'This Year',
              'Last 3 Years',
              'Last 5 Years',
              'Last 10 Years',
            ].includes(label);
          }
          return false;
        })
        .map((period) => ({
          label: period.label ?? 'Unknown',
          value: `${format(period.start, 'dd-MM-yyyy')} - ${format(period.end, 'dd-MM-yyyy')}`,
        }));

      setSelectedReportOption(newMappedOptions[0] || newMappedOptions[0]);
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
    {
      label: 'This Month',
      start: startOfMonth(today),
      end: today,
    },
    {
      label: 'Last Month',
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: endOfMonth(new Date(today.getFullYear(), today.getMonth() - 1)),
    },

    {
      label: 'Current Week',
      start: startOfWeek(today, { weekStartsOn: 1 }),
      end: today,
    },
    {
      label: 'Current Month',
      start: startOfMonth(today),
      end: endOfMonth(today),
    },
    {
      label: 'This Quarter',
      start: startOfQuarter(today),
      end: endOfQuarter(today),
    },
    {
      label: 'Last Quarter',
      start: startOfQuarter(subDays(today, 90)),
      end: endOfQuarter(subDays(today, 90)),
    },

    {
      label: 'This Year',
      start: startOfYear(today),
      end: today,
    },
    {
      label: 'Last Year',
      start: startOfYear(new Date(today.getFullYear() - 1, 0, 1)),
      end: endOfYear(new Date(today.getFullYear() - 1, 11, 31)),
    },

    {
      label: 'Last 3 Years',
      start: startOfYear(subYears(today, 3)),
      end: endOfYear(today),
    },
    {
      label: 'Last 5 Years',
      start: startOfYear(subYears(today, 5)),
      end: endOfYear(today),
    },
    {
      label: 'Last 10 Years',
      start: startOfYear(subYears(today, 10)),
      end: endOfYear(today),
    },
  ];

  const mappedPeriodOptions: Option[] = periodFilterOptions
    .filter((period) => {
      const label = period.label ?? '';

      if (selectedOption.value === 'day') {
        return ['This Week', 'Last Week', 'This Month', 'Last Month'].includes(
          label
        );
      }
      if (selectedOption.value === 'week') {
        return [
          'Current Week',
          'Current Month',
          'Last Month',
          'This Quarter',
          'Last Quarter',
        ].includes(label);
      }
      if (selectedOption.value === 'month') {
        return [
          'This Month',
          'This Quarter',
          'Last Quarter',
          'This Year',
          'Last Year',
        ].includes(label);
      }
      if (selectedOption.value === 'year') {
        return [
          'This Year',
          'Last 3 Years',
          'Last 5 Years',
          'Last 10 Years',
        ].includes(label);
      }
      return false; // Exclude options that don’t match the selected period
    })
    .map((period) => ({
      label: period.label ?? 'Unknown', // Fallback to "Unknown" if label is undefined
      value: `${format(period.start, 'dd-MM-yyyy')} - ${format(period.end, 'dd-MM-yyyy')}`,
    }));

  // Set the initial value for selectedReportOption to "This Week"
  const initialReportOption = periodFilterOptions.find(
    (option) => option.label === 'Last Week'
  );

  const defaultPeriodOptions = periodFilterOptions.filter((period) =>
    ['This Week', 'Last Week', 'This Month', 'Last Month'].includes(
      period.label ?? ''
    )
  );

  const [selectedReportOption, setSelectedReportOption] = useState<Option>({
    label: defaultPeriodOptions[0]?.label || 'This Week', // 'Last Week' as default
    value: `${format(defaultPeriodOptions[0]?.start, 'dd-MM-yyyy')} - ${format(defaultPeriodOptions[0]?.end, 'dd-MM-yyyy')}`,
  });

  useEffect(() => {
    setGraphs([
      {
        title: 'Scheduled',
        stopColor: '#0096D3',
        borderColor: '#0096D3',
        data: [],
      },
      { title: 'Fixed Scheduled', stopColor: '#A6CE50', borderColor: '#A6CE50', data: [] },
      {
        title: 'Completed',
        stopColor: '#377CF6',
        borderColor: '#377CF6',
        data: [],
      },
      {
        title: 'Fix Completed',
        stopColor: '#377CF6',
        borderColor: '#377CF6',
        data: [],
      },
    ]);
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update `isMobile` when the window is resized
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stylesGraph = {
    width: isMobile ? 'auto' : '100%',
    height: '325px',
  };

  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        <h4 className="reports-title">Production</h4>
        <div className="report-header-dropdown flex-wrap">
          <div>
            <SelectOption
              options={[
                {
                  label: 'Install',
                  value: 'install',
                },
                {
                  label: 'Battery',
                  value: 'battery',
                },
                {
                  label: 'Service',
                  value: 'service',
                },
                {
                  label: 'MPU',
                  value: 'mpu',
                },
                {
                  label: 'Derate',
                  value: 'derate',
                },
                {
                  label: 'DER/LST/Sub-Panel',
                  value: 'der_lst_sub_panel',
                },
              ]}
              onChange={(value: any) => setReportType(value)}
              value={reportType}
              controlStyles={{ marginTop: 0, minHeight: 30, minWidth: 150 }}
              menuListStyles={{ fontWeight: 400 }}
              singleValueStyles={{ fontWeight: 400 }}
            />
          </div>

          <div>
            <SelectOption
              options={[
                {
                  label: 'Day 1',
                  value: 'install',
                },
                {
                  label: 'Day 2',
                  value: 'battery',
                },
                {
                  label: 'Day 3',
                  value: 'service',
                },
                {
                  label: 'Day 4',
                  value: 'mpu',
                },
                {
                  label: 'Day 5',
                  value: 'derate',
                },
                {
                  label: 'Day 6',
                  value: 'der_lst_sub_panel',
                },
              ]}
              onChange={handleWeeklyOption}
              controlStyles={{ marginTop: 0, minHeight: 30 }}
              value={selectedOption}
              menuListStyles={{
                fontWeight: 400,
              }}
              singleValueStyles={{
                fontWeight: 400,
              }}
            />
          </div>

        
        </div>
      </div>
      <div
        style={{
          background: '#ddd',
          height: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 5,
          width: '100%',
          margin: '10px 0'
        }}
      >
        {reportType.label}
      </div>

      <div className="report-graphs">
        {graphs.map((graph, index) => (

          <div
            key={index}
            className="report-graph"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 50,
            }}
          >

            {isLoading ? (
              <div
                className="flex items-center"
                style={{ justifyContent: 'center' }}
              >
                {' '}
                <MicroLoader />{' '}
              </div>
            ) : (
              <>
                <TableCustom
                  reportType={reportType}
                  middleName={graph.title}
                  data={[
                    { column1: 'Tucson', column2: '44' },
                    { column1: 'India', column2: '45' },
                    { column1: 'USA', column2: '1' },
                  ]}
                />
                <div className="main-graph" style={stylesGraph}>
                  <h3 style={{ textAlign: 'center' }}>{reportType.label} {graph.title}</h3>
                  <LineGraph />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="report-graphs">
        <div
          className="report-graph"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 50,
          }}
        >
          {isLoading ? (
            <div
              className="flex items-center"
              style={{ justifyContent: 'center' }}
            >
              {' '}
              <MicroLoader />{' '}
            </div>
          ) : (
            <>
              <TableCustom
                  reportType={reportType}
                  middleName="Pending"
                  data={[
                    { column1: 'Tucson', column2: '44' },
                    { column1: 'India', column2: '45' },
                    { column1: 'USA', column2: '1' },
                  ]}
                />
              <div className="main-graph" style={stylesGraph}>
                <h3 style={{ textAlign: 'center' }}>Pending {reportType.label}</h3>
                  <BarChartExample/>
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
};

export default Production;
