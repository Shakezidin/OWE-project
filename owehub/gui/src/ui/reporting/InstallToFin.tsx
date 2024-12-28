import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  LabelList,
} from 'recharts';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getTimelineInstallToFinData } from '../../redux/apiActions/reportingAction/reportingAction';
import BackButtom from './components/BackButtom';
import styles from './styles/InstalltoFin.module.css';
import MicroLoader from '../components/loader/MicroLoader';
import { reportingCaller } from '../../infrastructure/web_api/services/apiUrl';
import DropdownCheckBox from '../components/DropdownCheckBox';
import YearSelect from './components/Dropdowns/YearSelect';
import DataNotFound from '../components/loader/DataNotFound';

interface LabelProps {
  x: number;
  y: number;
  width: number;
  value: number;
}

interface ChartData {
  week: number;
  low: number;
  medium: number;
  high: number;
  veryHigh: number;
  ultraHigh: number;
  extreme: number;
  'Average Days From Install to FIN': number;
}

interface Option {
  value: string;
  label: string;
}

const InstalltoFin = () => {
  // State Management
  const [selectedOffices, setSelectedOffices] = useState<Option[]>([]);
  const [selectedAhj, setSelectedAhj] = useState<Option[]>([]);
  const [selectedState, setSelectedState] = useState<Option[]>([]);
  const [selectedQuarter, setSelectedQuarter] = useState<Option[]>([]);

  const [highlightedLegend, setHighlightedLegend] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const [selectedYear, setSelectedYear] = useState<Option>({
    label: '2024',
    value: '2024',
  });

  const dispatch = useAppDispatch();
  const {
    data: installToFinData,
    loading: installToFinLoading,
    error: installToFinDataError,
  } = useAppSelector((state) => state.reportingSlice.installToFinData);



  const mapApiDataToChartData = (apiData: any): ChartData[] => {
    const dayRangeData = apiData?.data?.['Install to FIN Day Range'] || [];
    const averageDaysData = apiData?.data?.['Average Days From Install to FIN'] || [];
  
    // Create a map of all weeks and their data
    const weekMap = new Map();
  
    // Process day range data and average days data first
    dayRangeData.forEach((item: any) => {
      if (item.index && item.value) {
        const weekData = {
          week: item.index,
          low: 0,
          medium: 0,
          high: 0,
          veryHigh: 0,
          ultraHigh: 0,
          extreme: 0,
          'Average Days From Install to FIN': 0,
        };

            // Map day ranges to their corresponding properties
    const rangeToProperty = {
      '0-15 days': 'low',
      '16-30 days': 'medium',
      '31-45 days': 'high',
      '46-60 days': 'veryHigh',
      '61-90 days': 'ultraHigh',
      '>90 days': 'extreme',
    };
  
        // Add counts for each range
        Object.entries(item.value).forEach(([range, count]) => {
          const property = rangeToProperty[range as keyof typeof rangeToProperty];
          if (property) {
            weekData[property as keyof ChartData] = (count as number);
          }
        });
  
        weekMap.set(item.index, weekData);
      }
    });
  
    // Process average days data
    averageDaysData.forEach((item: any) => {
      if (item.index && item.value?.average !== undefined) {
        const existingWeekData = weekMap.get(item.index) || {
          week: item.index,
          low: 0,
          medium: 0,
          high: 0,
          veryHigh: 0,
          ultraHigh: 0,
          extreme: 0,
          'Average Days From Install to FIN': 0,
        };
        existingWeekData['Average Days From Install to FIN'] = item.value.average;
        weekMap.set(item.index, existingWeekData);
      }
    });
  
    // Filter out weeks with no data
    const filteredData = Array.from(weekMap.values()).filter(weekData => {
      const hasBarData = weekData.low > 0 || 
                        weekData.medium > 0 || 
                        weekData.high > 0 || 
                        weekData.veryHigh > 0 || 
                        weekData.ultraHigh > 0 || 
                        weekData.extreme > 0;
      const hasAverageData = weekData['Average Days From Install to FIN'] > 0;
      return hasBarData || hasAverageData;
    });
  
    // Sort by week
    return filteredData.sort((a, b) => a.week - b.week);
  };





  // API Call Function
  const getNewFormData = async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(
        getTimelineInstallToFinData({
          year: selectedYear.value,
          state: selectedState.map((item) => item.value),
          office: selectedOffices.map((item) => item.value),
          ahj: selectedAhj.map((item) => item.value),
          quarter: selectedQuarter.map((item) => Number(item.value)), // Pass the numeric quarters
        })
      ).unwrap();

      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error fetching install to fin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update chart data when API data changes
  useEffect(() => {
    if (installToFinData) {
      const mappedData = mapApiDataToChartData(installToFinData);
      setChartData(mappedData);
    }
  }, [installToFinData]);

  // Fetch data when filters change
  useEffect(() => {
    getNewFormData(); // Trigger API call on change
  }, [
    selectedYear.value,
    selectedState,
    selectedOffices,
    selectedAhj,
    selectedQuarter,
  ]);

  // Chart Helper Functions
  const handleLegendClick = (dataKey: string) => {
    setHighlightedLegend((prev) => (prev === dataKey ? null : dataKey));
  };

  const renderCustomizedLabel = ({ x, y, width, value }: LabelProps) => {
    return (
      <text
        x={x + width / 2}
        y={y - 10}
        fill="#666666"
        textAnchor="middle"
        dominantBaseline="middle"
        className={styles.barLabel}
      >
        {value}
      </text>
    );
  };

  const getLegendLabel = (dataKey: string) => {
    switch (dataKey) {
      case 'low':
        return '0-15 days';
      case 'medium':
        return '16-30 days';
      case 'high':
        return '31-45 days';
      case 'veryHigh':
        return '46-60 days';
      case 'ultraHigh':
        return '61-90 days';
      case 'extreme':
        return '91+ days';
      default:
        return dataKey;
    }
  };

  const getBarColor = (dataKey: string) => {
    switch (dataKey) {
      case 'low':
        return 'rgb(51, 140, 0)';
      case 'medium':
        return 'rgb(124, 179, 66)';
      case 'high':
        return 'rgb(255, 168, 0)';
      case 'veryHigh':
        return 'rgb(246, 109, 0)';
      case 'ultraHigh':
        return 'rgb(242, 68, 45)';
      case 'extreme':
        return 'rgb(238, 0, 0)';
      default:
        return 'rgb(0, 0, 0)';
    }
  };

  const [officeSelect, setOfficeSelect] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectloading, setSelectLoading] = useState(false);

  const [stateSet, setStateSet] = useState([]);
  const [ahj, setAhj] = useState([]);
  const QuarterSet = [
    {
      label: `Quarter 1`,
      value: `1`,
    },
    {
      label: `Quarter 2`,
      value: `2`,
    },
    {
      label: `Quarter 3`,
      value: `3`,
    },
    {
      label: `Quarter 4`,
      value: `4`,
    },
  ];

  const [isFetch, setIsFetch] = useState(false);
  const handleYearChange = (value: Option | null) => {
    if (value) {
      setSelectedYear(value);
    }
  };

  useEffect(() => {
    setSelectedQuarter(QuarterSet);
    setSelectLoading(true);
    const fetchData = async () => {
      try {
        const response = await reportingCaller('get_offices_list', {});

        if (response.status === 200) {
          const officeData = response.data.offices.map((office: any) => ({
            label: office,
            value: office,
          }));
          setOfficeSelect(officeData);
          setSelectedOffices(officeData);
          const stateData = response.data.states.map((state: any) => ({
            label: state,
            value: state,
          }));
          setSelectedState(stateData);
          setStateSet(stateData);
          const ahjData = response.data.ahj.map((ahj: any) => ({
            label: ahj,
            value: ahj,
          }));
          setSelectedAhj(ahjData);
          setAhj(ahjData);
          setIsFetch(true);
        } else {
          console.error('Error fetching data:', response.data.message);
          setSelectLoading(false);
        }
      } catch (error) {
        console.error('Error making API request:', error);
        setSelectLoading(false);
      }
      setSelectLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        <BackButtom heading="Install to FIN" />
        <div className="report-header-dropdown flex-wrap">
          {/* <div><DaySelect /></div> */}
          <div>
            <DropdownCheckBox
              label={'Offices'}
              placeholder={'Search Offices'}
              selectedOptions={selectedOffices}
              options={officeSelect}
              onChange={(val) => {
                setSelectedOffices(val);
              }}
              disabled={selectloading || loading}
            />
          </div>

          <div>
            <DropdownCheckBox
              label={'State'}
              placeholder={'Search States'}
              selectedOptions={selectedState}
              options={stateSet}
              onChange={(val) => {
                setSelectedState(val);
              }}
              disabled={selectloading || loading}
            />
          </div>

          <div>
            <YearSelect
              value={selectedYear}
              onChange={handleYearChange}
              disabled={selectloading || loading}
            />
          </div>

          <div>
            <DropdownCheckBox
              label={'Quarter'}
              placeholder={'Search Quarter'}
              selectedOptions={selectedQuarter}
              options={QuarterSet}
              onChange={(val) => {
                setSelectedQuarter(val);
              }}
              disabled={selectloading || loading}
            />
          </div>

          <div>
            <DropdownCheckBox
              label={`${selectedAhj.length} AHJ's`}
              placeholder={'Search AHJ'}
              selectedOptions={selectedAhj}
              options={ahj}
              onChange={(val) => {
                setSelectedAhj(val);
              }}
              disabled={selectloading || loading}
            />
          </div>
        </div>
      </div>

      <div className="reports-yscroll">
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
        ) : chartData.length === 0 ? ( // Check if there's no data
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DataNotFound />
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
          >
            {/* Bar Chart */}
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={chartData}
                  barCategoryGap="5%"
                  className={styles.barChart}
                  margin={{ right: 70, top: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className={styles.grid}
                  />
                  <XAxis
                    dataKey="week"
                    className={styles.axis}
                    tickFormatter={(value) => `Week ${value}`}
                    height={50}
                    tickSize={10}
                    angle={-45}
                    dy={12}
                    interval={0}
                  />
                  <YAxis className={styles.axis} tickSize={10} />
                  <Tooltip
                    wrapperStyle={{
                      outline: 'none',
                      borderRadius: 4,
                      padding: 4,
                      boxShadow: 'none',
                      fontSize: 12,
                    }}
                    labelFormatter={(label) => `Week ${label}`}
                    formatter={(value, name) => {
                      const legendLabels: { [key: string]: string } = {
                        low: '0-15 days',
                        medium: '16-30 days',
                        high: '31-45 days',
                        veryHigh: '46-60 days',
                        ultraHigh: '61-90 days',
                        extreme: '91+ days',
                      };
                      return [value, legendLabels[name]]; // Return value and custom label
                    }}
                  />

                  {[
                    'extreme', // Red at the bottom
                    'ultraHigh',
                    'veryHigh',
                    'high',
                    'medium',
                    'low', // Green at the top
                  ].map((dataKey) => (
                    <Bar
                      key={dataKey}
                      dataKey={dataKey}
                      stackId="a"
                      fill={getBarColor(dataKey)}
                      opacity={
                        highlightedLegend && highlightedLegend !== dataKey
                          ? 0.1
                          : 1
                      }
                      className={styles.bar}
                      label={
                        dataKey === 'low' ? renderCustomizedLabel : undefined
                      }
                    />
                  ))}
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="top"
                    onClick={({ dataKey }) =>
                      handleLegendClick(dataKey as string)
                    }
                    className={styles.legend}
                    wrapperStyle={{
                      paddingBottom: '20px',
                      fontSize: '12px',
                      fontFamily: 'poppins',
                      cursor: 'pointer',
                    }}
                    formatter={(value) => {
                      const legendLabels: { [key: string]: string } = {
                        low: '0-15 days',
                        medium: '16-30 days',
                        high: '31-45 days',
                        veryHigh: '46-60 days',
                        ultraHigh: '61-90 days',
                        extreme: '91+ days',
                      };
                      return legendLabels[value] || value; // Custom label for legend items
                    }}
                    payload={[
                      {
                        value: 'low',
                        type: 'square',
                        color: getBarColor('low'),
                      },
                      {
                        value: 'medium',
                        type: 'square',
                        color: getBarColor('medium'),
                      },
                      {
                        value: 'high',
                        type: 'square',
                        color: getBarColor('high'),
                      },
                      {
                        value: 'veryHigh',
                        type: 'square',
                        color: getBarColor('veryHigh'),
                      },
                      {
                        value: 'ultraHigh',
                        type: 'square',
                        color: getBarColor('ultraHigh'),
                      },
                      {
                        value: 'extreme',
                        type: 'square',
                        color: getBarColor('extreme'),
                      },
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData} margin={{ right: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    className={styles.axis}
                    dataKey="week"
                    tickFormatter={(value) => `Week ${value}`} // Show Week number below tickmarks
                    height={50}
                    tickSize={10}
                    angle={-45}
                    dy={12}
                    interval={0}
                  />
                  <YAxis className={styles.axis} tickSize={10} />
                  <Tooltip
                    wrapperStyle={{
                      outline: 'none',
                      borderRadius: 4,
                      padding: 4,
                      boxShadow: 'none',
                      fontSize: 12,
                    }}
                    labelFormatter={(label) => `Week ${label}`}
                    formatter={(value) => (value as number).toFixed(2)} // Type assertion to number
                  />
                  <Line
                    type="monotone"
                    dataKey="Average Days From Install to FIN"
                    stroke="rgb(76, 175, 80)" // Updated line color
                    activeDot={{ r: 8 }}
                    fill="rgb(76, 175, 80)"
                  >
                    <LabelList
                      dataKey="Average Days From Install to FIN"
                      position="top"
                      fill="rgb(76, 175, 80)"
                      fontSize={8}
                      offset={5}
                      formatter={(value: number) => value.toFixed(2)} // Format labels on the line to 2 decimal places
                    />
                  </Line>
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="top"
                    className={styles.legend}
                    wrapperStyle={{
                      padding: '20px',
                      fontSize: '12px',
                      fontFamily: 'poppins',
                    }}
                    formatter={getLegendLabel}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstalltoFin;
