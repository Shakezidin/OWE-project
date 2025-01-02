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
  AreaChart,
  Area,
} from 'recharts';
import BackButtom from '../components/BackButtom';
import MicroLoader from '../../components/loader/MicroLoader';
import { reportingCaller } from '../../../infrastructure/web_api/services/apiUrl';
import DropdownCheckBox from '../../components/DropdownCheckBox';
import YearSelect from '../components/Dropdowns/YearSelect';
import styles from '../styles/InstalltoFin.module.css';
import './permitredline.css'
import { toast } from 'react-toastify';
import DataNotFound from '../../components/loader/DataNotFound';


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
  'Permit Redline %': number;
}

interface Option {
  value: string;
  label: string;
}
interface CountPermitRedlineReport {
  value: {
    pv_redline_count: number;
    pv_submited_count: number;
  };
  index: number;
}

interface PercentageRedlineReport {
  value: {
    percentage: number;
  };
  index: number;
}

const PermitRedLine = () => {
  // State Management
  const [selectedOffices, setSelectedOffices] = useState<Option[]>([]);
  const [selectedAhj, setSelectedAhj] = useState<Option[]>([]);
  const [selectedState, setSelectedState] = useState<Option[]>([]);
  const [selectedQuarter, setSelectedQuarter] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const [selectedYear, setSelectedYear] = useState<Option>({
    label: '2024',
    value: '2024',
  });





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

  const [countPermitRedlineReport, setCountPermitRedlineReport] = useState<CountPermitRedlineReport[]>([]);
  const [percentReport, setPercentReport] = useState<PercentageRedlineReport[]>([]);

  console.log(percentReport, "i want to see")

  const data = countPermitRedlineReport
  .filter((item) => Object.keys(item.value).length > 0)
  .map((item) => ({
    name: `Week ${item.index}`,
    'PV Submitted': item.value.pv_submited_count,
    'PV Redline': item.value.pv_redline_count,
  }));

  const lineChartData = percentReport
  .filter((item) => Object.keys(item.value).length > 0)
  .map((item) => ({
    name: `Week ${item.index}`,
    'PV Redline': item.value.percentage,
  }));


  



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
  useEffect(() => {
    if (isFetch) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await reportingCaller('get_timeline_permitredline_per_report', {
            "year": selectedYear.value,
            "state": selectedState.map((item) => item.value),
            "office": selectedOffices.map((item) => item.value),
            "ahj": selectedAhj.map((item) => item.value),
            "quarter": selectedQuarter.map((item) => Number(item.value))
          });


          if (response.status === 200) {
            setLoading(false);
            setCountPermitRedlineReport(response.data.data["Count Permit Redline Report"]);
            setPercentReport(response.data.data["Percentage Permit Redline Report"])
          } else {
            console.error('Error fetching data:', response.message);
            toast.error(response.message)
            setLoading(false);
          }
        } catch (error) {
          console.error('Error making API request:', error);
          setLoading(false);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [selectedOffices, selectedAhj, selectedState, selectedYear, selectedQuarter]);

  
  const tooltipStyle = {
    fontSize: '10px',
    padding: '6px',
  };

  



  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        <BackButtom heading="Permit Redline %" />
        <div className="report-header-dropdown flex-wrap">
          {/* <div><DaySelect /></div> */}
          <div>
            <DropdownCheckBox
              label={selectedOffices.length === 1 ? "1 Office" : `${selectedOffices.length} Office's`}
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
              label={"Quarter"}
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
              label={selectedState.length === 1 ? "1 State" : `${selectedState.length} State's`}
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
              label={selectedAhj.length === 1 ? "1 AHJ" : `${selectedAhj.length} AHJ's`}
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

      {(loading || !isFetch) ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MicroLoader />
            </div>
          ) : (countPermitRedlineReport || percentReport) ? (
           
       
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
          >

            <div className='permitredline-header'>
              <p>Permit Redline and PV Submitted by Count</p>
            </div>

            {/* Line Chart */}
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart width={730} height={250} data={data} barCategoryGap="5%" className={styles.barChart}
                  margin={{ top: 22, right: 18, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="0"
                    className={styles.grid}
                  />

                  <XAxis
                    dataKey="name"
                    className={styles.axis}
                    height={50}
                    tickSize={10}
                    angle={-45}
                    dy={12}
                    interval={0} />
                  <YAxis
                    className={styles.axis}
                    tickSize={10}
                    tickLine={{ stroke: 'black', strokeWidth: 1 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#E7F0FF' }}
                    wrapperStyle={{
                      outline: 'none',
                      borderRadius: 4,
                      padding: 4,
                      boxShadow: 'none',
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{
                      paddingBottom: '0px',
                      fontSize: '12px',
                      fontFamily: 'poppins',
                      cursor: 'pointer',
                      color: 'black',
                      fontWeight: '400',
                    }}
                  />
                  <Bar dataKey="PV Submitted" fill="#6CD68C" />
                  <Bar dataKey="PV Redline" fill="#2C84FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className='permitredline-header'>
              <p>Permit Redline by Percentage</p>

            </div>



            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={400} >
                <LineChart
                  data={lineChartData}
                  margin={{ top: 19, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="0" />
                  <XAxis
                    className={styles.axis}
                    height={50}
                    tickSize={10}
                    angle={-45}
                    dy={12}
                    interval={0}
                    tickFormatter={(value) => {
                      const weekNumber = parseInt(value, 10) + 1;
                      return `Week ${weekNumber}`;
                    }}
                  />
                  <YAxis
                    tickSize={10}
                    tick={{ fontSize: 10, fontWeight: 500, fill: '#818181' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    wrapperStyle={{
                      outline: 'none',
                      borderRadius: 4,
                      padding: 8,
                      fontSize: 10,
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                    }}
                    formatter={(value) => `${Number(value) + 1}`}
                    labelFormatter={(value) => `Week ${Number(value) + 1}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="PV Redline"
                    stroke="#2C84FE"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#2C84FE' }}
                    activeDot={{ r: 4 }}
                  >
                    <LabelList
                      dataKey="PV Redline"
                      position="top"
                      fill="#2C84FE"
                      fontSize={10}
                      offset={5}
                      formatter={(value: number) => `${value.toFixed(0)}%`}
                    />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <DataNotFound />
            </div>
          )}
      
      </div>
    </div>
  );
};

export default PermitRedLine;
