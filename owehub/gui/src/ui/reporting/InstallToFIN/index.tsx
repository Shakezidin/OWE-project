import React, { useState, useEffect } from 'react';
import Filters from './Filters';
import Charts from './Charts';
import { reportingCaller } from '../../../infrastructure/web_api/services/apiUrl';
import BackButtom from '../components/BackButtom';
import MicroLoader from '../../components/loader/MicroLoader';
import DataNotFound from '../../components/loader/DataNotFound';
import styles from '../styles/InstalltoFin.module.css';

interface Option {
  value: string;
  label: string;
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

const InstalltoFin = () => {
  // State Management
  const [selectedOffices, setSelectedOffices] = useState<Option[]>([]);
  const [selectedAhj, setSelectedAhj] = useState<Option[]>([]);
  const [selectedState, setSelectedState] = useState<Option[]>([]);
  const [selectedQuarter, setSelectedQuarter] = useState<Option[]>([]);
  const [highlightedLegend, setHighlightedLegend] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedYear, setSelectedYear] = useState<Option>({ label: '2024', value: '2024' });
  const [officeSelect, setOfficeSelect] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectloading, setSelectLoading] = useState(false);
  const [stateSet, setStateSet] = useState([]);
  const [ahj, setAhj] = useState([]);
  const QuarterSet = [
    { label: `Quarter 1`, value: `1` },
    { label: `Quarter 2`, value: `2` },
    { label: `Quarter 3`, value: `3` },
    { label: `Quarter 4`, value: `4` },
  ];
  const [isFetch, setIsFetch] = useState(false);

  const handleYearChange = (value: Option | null) => {
    if (value) {
      setSelectedYear(value);
    }
  };

  useEffect(() => {
    setSelectedQuarter(QuarterSet)
    setSelectLoading(true);
    const fetchData = async () => {
      try {
        const response = await reportingCaller('get_offices_list', {});
        if (response.status === 200) {
          const officeData = response.data.offices.map((office: any) => ({ label: office, value: office }));
          setOfficeSelect(officeData);
          setSelectedOffices(officeData);
          const stateData = response.data.states.map((state: any) => ({ label: state, value: state }));
          setSelectedState(stateData);
          setStateSet(stateData);
          const ahjData = response.data.ahj.map((ahj: any) => ({ label: ahj, value: ahj }));
          setSelectedAhj(ahjData);
          setAhj(ahjData);
          setIsFetch(true);
        } else {
          console.error('Error fetching data:', response.data.message);
        }
      } catch (error) {
        console.error('Error making API request:', error);
      } finally {
        setSelectLoading(false);
      }
    };
    fetchData();
  }, []);

  const mapApiDataToChartData = (apiData: any): ChartData[] => {
    const dayRangeData = apiData?.data?.['Install to FIN Day Range'] || [];
    const averageDaysData = apiData?.data?.['Average Days From Install to FIN'] || [];
    const weekMap = new Map();

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
        const rangeToProperty = {
          '0-15 days': 'low',
          '16-30 days': 'medium',
          '31-45 days': 'high',
          '46-60 days': 'veryHigh',
          '61-90 days': 'ultraHigh',
          '>90 days': 'extreme',
        };
        Object.entries(item.value).forEach(([range, count]) => {
          const property = rangeToProperty[range as keyof typeof rangeToProperty];
          if (property) {
            weekData[property as keyof ChartData] = (count as number);
          }
        });
        weekMap.set(item.index, weekData);
      }
    });

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

    const filteredData = Array.from(weekMap.values()).filter(weekData => {
      const hasBarData = weekData.low > 0 || weekData.medium > 0 || weekData.high > 0 || weekData.veryHigh > 0 || weekData.ultraHigh > 0 || weekData.extreme > 0;
      const hasAverageData = weekData['Average Days From Install to FIN'] > 0;
      return hasBarData || hasAverageData;
    });

    return filteredData.sort((a, b) => a.week - b.week);
  };

  useEffect(() => {
    if (isFetch) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const response = await reportingCaller('get_timeline_install_to_fin', {
            year: selectedYear.value,
            state: selectedState.map((item) => item.value),
            office: selectedOffices.map((item) => item.value),
            ahj: selectedAhj.map((item) => item.value),
            quarter: selectedQuarter.map((item) => Number(item.value)),
          });

          if (response.status === 200) {
            setChartData(mapApiDataToChartData(response.data));
          } else {
            console.error('Error fetching install to fin data:', response.message);
          }
        } catch (error) {
          console.error('Error fetching install to fin data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [
    selectedYear.value,
    selectedState,
    selectedOffices,
    selectedAhj,
    selectedQuarter,
  ]);

  const handleLegendClick = (dataKey: string) => {
    setHighlightedLegend((prev) => (prev === dataKey ? null : dataKey));
  };

  const renderCustomizedLabel = ({ x, y, width, value }: any) => {
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

  const getBarColor = (dataKey: string) => {
    switch (dataKey) {
      case 'low': return 'rgb(51, 140, 0)';
      case 'medium': return 'rgb(124, 179, 66)';
      case 'high': return 'rgb(255, 168, 0)';
      case 'veryHigh': return 'rgb(246, 109, 0)';
      case 'ultraHigh': return 'rgb(242, 68, 45)';
      case 'extreme': return 'rgb(238, 0, 0)';
      default: return 'rgb(0, 0, 0)';
    }
  };

  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        <BackButtom heading="Install to FIN" />
        <Filters
          selectedOffices={selectedOffices}
          setSelectedOffices={setSelectedOffices}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedYear={selectedYear}
          handleYearChange={handleYearChange}
          selectedQuarter={selectedQuarter}
          setSelectedQuarter={setSelectedQuarter}
          selectedAhj={selectedAhj}
          setSelectedAhj={setSelectedAhj}
          officeSelect={officeSelect}
          stateSet={stateSet}
          QuarterSet={QuarterSet}
          ahj={ahj}
          loading={loading}
          selectloading={selectloading}
        />
      </div>

      <div className="reports-yscroll">
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MicroLoader />
          </div>
        ) : chartData.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DataNotFound />
          </div>
        ) : (
          <Charts
            chartData={chartData}
            highlightedLegend={highlightedLegend}
            handleLegendClick={handleLegendClick}
            renderCustomizedLabel={renderCustomizedLabel}
            getBarColor={getBarColor}
          />
        )}
      </div>
    </div>
  );
};

export default InstalltoFin; 