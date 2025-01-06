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
import BarChartExample from './components/BarChart';
import BackButtom from './components/BackButtom';

// Define types for data and graph properties
interface DataPoint {
  name: string;
  pv: number;
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
    alignItems: 'unset',
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


  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        <BackButtom heading="Overall" />
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
          background: '#e0e0e0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 4,
          width: '97%',
          padding: 8,
          margin: "1.2rem",
          fontWeight: 600,
          fontSize: '1rem',
          marginBottom: '1rem',
        }}
      >
        Speed - Overall
      </div>
      <div className="reports-yscroll" style={{height: "calc(100vh - 245px)"}}>
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
            <div className="speed-overall-parent">
              {/* // graphs.map((graph, index) => ( */}
              <div className="table">
                {metrics?.map((table, index) => (
                  <div
                    key={index}
                    className="report-table"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 30,
                      height: 300,
                    }}
                  >
                    <div className="test">
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
                {/* <p className="chart-info-report">Week</p> */}
              </div>
            </div>
            //   ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeedOverall;
    