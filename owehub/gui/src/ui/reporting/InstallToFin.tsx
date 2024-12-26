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
  LabelList
} from 'recharts';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getTimelineInstallToFinData } from '../../redux/apiActions/reportingAction/reportingAction';
import CustomSelect from './components/Dropdowns/CustomSelect';
import BackButtom from './components/BackButtom';
import styles from './styles/InstalltoFin.module.css';
import MicroLoader from '../components/loader/MicroLoader';

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
  totalDays: number;
}

interface Option {
  value: string;
  label: string;
}

const InstalltoFin = () => {
  // State Management
  const [highlightedLegend, setHighlightedLegend] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Initial states matching API request
  const [selectedStates, setSelectedState] = useState<string[]>([
    'TX :: Texas',
    'AZ :: Arizona',
    'NM :: New Mexico',
    'TX :: Texas'
  ]);
  const [selectedOffices, setSelectedOffices] = useState<string[]>([
    'TXDAL01',
    'AZTUC01',
    'NMABQ01',
    'TXDAL01'
  ]);
  const [selectedAhj, setSelectedAhj] = useState<string[]>([
    'City of Midlothian (TX)',
    'Sierra Vista, City of (AZ)',
    'City of Carrizozo (NM)',
    'Rosenberg, City of (TX)'
  ]);
  const [selectedQuarter, setSelectedQuarter] = useState<string[]>([]);
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

  // Data Mapping Function
  const mapApiDataToChartData = (apiData: any) => {
    const dayRangeData = apiData?.data?.["Install to FIN Day Range"] || [];
    const averageDaysData = apiData?.data?.["Average Days From Install to FIN"] || [];

    return dayRangeData.map((item: any, index: number) => ({
      week: index + 1,
      low: item.value?.["0-15 days"] || 0,
      medium: item.value?.["16-30 days"] || 0,
      high: item.value?.["31-45 days"] || 0,
      veryHigh: item.value?.["46-60 days"] || 0,
      ultraHigh: item.value?.["61-90 days"] || 0,
      extreme: item.value?.[">90 days"] || 0,
      totalDays: averageDaysData[index]?.value?.average || 0
    }));
  };

  // API Call Function
  const getNewFormData = async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(
        getTimelineInstallToFinData({
          year: selectedYear.value,
          state: selectedStates,
          office: selectedOffices,
          ahj: selectedAhj,
          quarter: selectedQuarter
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
    getNewFormData();  // Trigger API call on change
  }, [selectedYear.value, selectedStates, selectedOffices, selectedAhj, selectedQuarter]);
  

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

  return (
    <div className={styles.chartContainer}>
      <div className="headingcount flex justify-between items-center">
        <BackButtom heading="Install to FIN" />
        <div className="report-header-dropdown flex-wrap">
          <div>
            <CustomSelect
              options={[
                { value: "AZKING01", label: "AZKING01" },
                { value: "AZPEO01", label: "AZPEO01" },
                { value: "AZTEM01", label: "AZTEM01" },
                { value: "AZTUC01", label: "AZTUC01" },
                { value: "CODEN1", label: "CODEN1" },
                { value: "COGJT1", label: "COGJT1" },
                { value: "NMABQ01", label: "NMABQ01" },
                { value: "No Office", label: "No Office" },
                { value: "TXAUS01", label: "TXAUS01" },
                { value: "TXDAL01", label: "TXDAL01" },
                { value: "TXELP01", label: "TXELP01" },
              ]}
              label="Office"
              value={selectedOffices}  // Bind selected value
              onChange={(value) => setSelectedOffices(value)}  // Update state on change
            />
          </div>

          <div>
            <CustomSelect
              options={[
                { value: 'null', label: 'null' },
                { value: 'AHJ', label: 'AHJ' },
                { value: 'Abilene, City of (TX)', label: 'Abilene, City of (TX)' },
                { value: 'Adams County (CO)', label: 'Adams County (CO)' },
                { value: 'Alamogordo, City of (NM)', label: 'Alamogordo, City of (NM)' },
                { value: 'Alamosa City (CO)', label: 'Alamosa City (CO)' },
                { value: 'Alamosa County (CO)', label: 'Alamosa County (CO)' },
                { value: 'Albuquerque, City of (NM)', label: 'Albuquerque, City of (NM)' },
                { value: 'Alice, City of (TX)', label: 'Alice, City of (TX)' },
                { value: 'Allen, City of (TX)', label: 'Allen, City of (TX)' },
                { value: 'Amarillo, City of (TX)', label: 'Amarillo, City of (TX)' },
                { value: 'Andrews, City of(TX)', label: 'Andrews, City of(TX)' },
                { value: 'Angelina County (TX)', label: 'Angelina County (TX)' },
                { value: 'Anna, City of (TX)', label: 'Anna, City of (TX)' },
              ]}
              label="AHJ"
              value={selectedAhj}
              onChange={setSelectedAhj}
            />
          </div>

          <div>
            <CustomSelect
              options={[
                { value: 'AZ :: Arizona', label: 'AZ' },
                { value: 'CO :: Colorado', label: 'CO' },
                { value: 'NM :: New Mexico', label: 'NM' },
                { value: 'NV :: Nevada', label: 'NV' },
                { value: 'ST :: South Dakota', label: 'ST' },
                { value: 'TX :: Texas', label: 'TX' },
              ]}
              label="State"
              value={selectedStates}
              onChange={setSelectedState}
            />
          </div>

          <div>
            <CustomSelect
              options={[
                { value: 'Q1 2024', label: 'Q1 2024' },
                { value: 'Q2 2024', label: 'Q2 2024' },
                { value: 'Q3 2024', label: 'Q3 2024' },
                { value: 'Q4 2024', label: 'Q4 2024' },
              ]}
              label="Quarter"
              value={selectedQuarter}
              onChange={setSelectedQuarter}
            />
          </div>


        </div>
      </div>

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: "60px" }}>
          {/* Bar Chart */}
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                barCategoryGap="5%"
                className={styles.barChart}
                margin={{ right: 70, top: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" className={styles.grid} />
                <XAxis
                  dataKey="week"
                  className={styles.axis}
                  tickFormatter={(value) => `Week ${value}`}
                  height={50}
                  tickSize={10}
                />
                <YAxis className={styles.axis} tickSize={10} />
                <Tooltip
                  wrapperStyle={{ outline: "none", borderRadius: 0, padding: 0, boxShadow: 'none' }}
                  wrapperClassName={styles.tooltip}
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

                {['low', 'medium', 'high', 'veryHigh', 'ultraHigh', 'extreme'].map((dataKey) => (
                  <Bar
                    key={dataKey}
                    dataKey={dataKey}
                    stackId="a"
                    fill={getBarColor(dataKey)}
                    opacity={highlightedLegend && highlightedLegend !== dataKey ? 0.1 : 1}
                    className={styles.bar}
                    label={dataKey === 'extreme' ? renderCustomizedLabel : undefined}
                  />
                ))}
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="top"
                  onClick={({ dataKey }) => handleLegendClick(dataKey as string)}
                  className={styles.legend}
                  wrapperStyle={{ paddingBottom: "20px", fontSize: '10px', fontFamily: 'poppins' }}
                  formatter={getLegendLabel}
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
                  tickFormatter={(value) => `Week ${value}`}
                  height={50}
                  tickSize={10}
                />
                <YAxis
                  className={styles.axis}
                  tickSize={10}
                />
                <Tooltip
                  wrapperStyle={{ outline: "none", borderRadius: 0, padding: 0, boxShadow: 'none' }}
                />
                <Line
                  type="monotone"
                  dataKey="totalDays"
                  stroke="rgb(76, 175, 80)"
                  activeDot={{ r: 8 }}
                  fill="rgb(76, 175, 80)"
                >
                  <LabelList
                    dataKey="totalDays"
                    position="top"
                    fill="rgb(76, 175, 80)"
                    fontSize={12}
                    offset={5}
                    formatter={(value: any) => value}
                  />
                </Line>
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="top"
                  className={styles.legend}
                  wrapperStyle={{ padding: "20px", fontSize: '10px', fontFamily: 'poppins' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstalltoFin;