import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import SelectOption from '../components/selectOption/SelectOption';
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
import { postCaller } from '../../infrastructure/web_api/services/apiUrl';
import MicroLoader from '../components/loader/MicroLoader';
import CompanySelect from './components/Dropdowns/CompanySelect';
import YearSelect from './components/Dropdowns/YearSelect';
import WeekSelect from './components/Dropdowns/WeekSelect';
import TableCustom from './components/Tables/CustomTable';
import LineGraph from './components/LineGraph';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Option as WeekOption } from './components/Dropdowns/WeekSelect';
import { fetchSpeedSummaryReport } from '../../redux/apiActions/reportingAction/reportingAction';
import { TableData, SpeedData, TransformedGraphData } from './types/speedTypes';
import {
  transformGraphData,
  transformTableData,
} from './utils/dataTransformer';

import './speedOverall.css';

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
      <div className="tooltip_stats">
        <p>{label}</p>
        <p>{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const SpeedOverall: React.FC = () => {
  const [newFormData, setNewFormData] = useState({});
  const [dealerOption, setDealerOption] = useState<Option[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<Option[]>([]);
  const [graphData, setGraphData] = useState<TransformedGraphData[]>([]);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [selectedOffices, setSelectedOffices] = useState<string[]>(['Tucson']);

  const metrics = ['Sale To Battery', 'Sale To Install', 'Sale To MPU'];
  const [metricData, setMetricData] = useState<{
    [key: string]: {
      graphData: any[];
      tableData: TableData[];
    };
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TableData[]>([]);
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

  const [batteryIncluded, setBatterIncluded] = useState<Option>({
    label: 'Yes',
    value: 'Yes',
  });

  const [selectedOption, setSelectedOption] = useState<Option>({
    label: 'Daily',
    value: 'day',
  });
  const [selectedStateOption, setSelectedStateOption] = useState<Option>({
    label: 'All State',
    value: 'All',
  });

  const leaderDealer = (newFormData: any): { value: string; label: string }[] =>
    newFormData?.dealer_name?.map((value: string) => ({
      value,
      label: value,
    }));

  // const tableData = {
  //   tableNames: ['available_states', 'dealer_name'],
  // };

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

  const dispatch = useAppDispatch();
  const {
    data: speedSummaryData,
    loading: speedSummaryLoading,
    error: speedSummaryError,
  } = useAppSelector((state) => state.reportingSlice.speedSummaryData);

  const [selectedWeek, setSelectedWeek] = useState<WeekOption>({
    label: 'Week 1',
    value: '1',
  });

  const [selectedYear, setSelectedYear] = useState<Option>({
    label: '2024',
    value: '2024',
  });

  const getNewFormData = async () => {
    setIsLoading(true);
    try {
      await dispatch(
        fetchSpeedSummaryReport({
          year: selectedYear.value,
          week: selectedWeek.value,
          batteryincluded: batteryIncluded.value,
          office: selectedOffices,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNewFormData();
  }, [
    dispatch,
    batteryIncluded,
    selectedWeek.value,
    selectedYear.value,
    selectedOffices,
  ]);

  useEffect(() => {
    if (speedSummaryData?.data) {
      console.log('speedSummaryData', speedSummaryData.data);
      const data = speedSummaryData.data as SpeedData;

      if (Object.keys(data).length > 0) {
        const newMetricData: typeof metricData = {};

        metrics.forEach((metric) => {
          newMetricData[metric] = {
            graphData: data.datapoints,
            tableData: transformTableData(data, metric),
          };
        });

        setMetricData(newMetricData);
      }
    }

    if (speedSummaryError) {
      toast.error(speedSummaryError);
    }
  }, [speedSummaryData, speedSummaryError]);

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
    // Clear previous graph data to reset the state for fresh data
    setGraphs([
      {
        title: 'Sales To Install',
        stopColor: '#0096D3',
        borderColor: '#0096D3',
        data: [],
      },
      {
        title: 'Sales To MPU',
        stopColor: '#A6CE50',
        borderColor: '#A6CE50',
        data: [],
      },
      {
        title: 'Sales To Battery',
        stopColor: '#377CF6',
        borderColor: '#377CF6',
        data: [],
      },
    ]);

    const partnerNames = selectedDealer.map((dealer) => dealer.value);

    if (selectedReportOption?.value && selectedOption.value) {
      (async () => {
        try {
          setIsLoading(true);

          const formatDate = (dateString: string): string => {
            if (!dateString) return '';
            const [day, month, year] = dateString.split('-');
            return `${day}-${month}-${year}`; // Return in DD-MM-YYYY format
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
          console.log(start_date, end_date, 'start_Date');

          const response = await postCaller('get_milestone_data', {
            dealer_names: partnerNames,
            start_date,
            end_date,
            date_by: selectedOption.value,
            state:
              selectedStateOption.value === 'All'
                ? ''
                : selectedStateOption.value === ''
                  ? ''
                  : selectedStateOption.value,
          });

          if (response.status > 201) {
            toast.error(response.message);
            setData([]); // Clear data if error
            setGraphs([]); // Clear graphs if error
            return;
          }

          // setData(response.data);
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update `isMobile` when the window is resized
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stylesGraph = {
    width: isMobile ? 'auto' : '100%',
    height: '236px',
    justifyContent: 'unset',
    alignItems: 'unset'
  };

  console.log(mappedPeriodOptions, 'optionssss');
  console.log(selectedReportOption, 'dateeeee');
  console.log(selectedOption, 'day month');

  const handleWeekChange = (value: WeekOption | null) => {
    if (value) {
      setSelectedWeek(value);
    }
  };

  const handleYearChange = (value: Option | null) => {
    if (value) {
      setSelectedYear(value);
    }
  };

  console.log(graphs, 'Graph Data'); // Log the graph data to check its structure

  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        <h4 className="reports-title">Overall</h4>
        <div className="report-header-dropdown flex-wrap">
          <div>
            <SelectOption
              options={[
                {
                  label: 'Yes',
                  value: 'Yes',
                },
                {
                  label: 'No',
                  value: 'No',
                },
              ]}
              onChange={(value: any) => setBatterIncluded(value)}
              value={batteryIncluded}
              controlStyles={{ marginTop: 0, minHeight: 30, minWidth: 150 }}
              menuListStyles={{ fontWeight: 400 }}
              singleValueStyles={{ fontWeight: 400 }}
            />
          </div>
          <div>
            <CompanySelect
              onOfficeChange={(values) => setSelectedOffices(values)}
            />{' '}
          </div>
          <div>
            <YearSelect value={selectedYear} onChange={handleYearChange} />
          </div>
          <div>
            <WeekSelect value={selectedWeek} onChange={handleWeekChange} />
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
          margin: '10px 0',
        }}
      >
        Speed - Overall
      </div>

      <div className="report-graphs">
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
        ) : (
          <div className='speed-overall-parent'>
            {/* // graphs.map((graph, index) => ( */}
            <div className="table">
              {metrics?.map((table, index) => (
                <div
                  key={index}
                  className="report-table"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 30,
                    height:300
                  }}
                >
                  <div className='test'>
                    <TableCustom
                      middleName={table}
                      data={metricData[table]?.tableData}
                      setData={setData}
                    />
                  </div>

                </div>
              ))}
            </div>

            <div className="main-graph" style={stylesGraph}>
              {/* <h3 style={{ textAlign: 'center' }}>{graph}</h3> */}
              <LineGraph
                batteryData={speedSummaryData?.data['Sale To Battery']}
                installData={speedSummaryData?.data['Sale To Install']}
                mpuData={speedSummaryData?.data['Sale To MPU']}
              />
              <p className="chart-info-report">Week</p>
            </div>
          </div>
          //   ))
        )}
      </div>
    </div>
  );
};

export default SpeedOverall;
