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
  const data = [
    {
      "name": "Week 1",
      "PV Submitted": 400,
      "PV Redline": 200
    },
    {
      "name": "Week 2",
      "PV Submitted": 300,
      "PV Redline": 139
    },
    {
      "name": "Week 3",
      "PV Submitted": 200,
      "PV Redline": 980
    },
    {
      "name": "Week 4",
      "PV Submitted": 278,
      "PV Redline": 390
    },
    {
      "name": "Week 5",
      "PV Submitted": 189,
      "PV Redline": 480
    },
    {
      "name": "Week 6",
      "PV Submitted": 239,
      "PV Redline": 380
    },
    {
      "name": "Week 7",
      "PV Submitted": 349,
      "PV Redline": 430
    },
    {
      "name": "Week 8",
      "PV Submitted": 400,
      "PV Redline": 200
    },
    {
      "name": "Week 9",
      "PV Submitted": 300,
      "PV Redline": 139
    },
    {
      "name": "Week 10",
      "PV Submitted": 200,
      "PV Redline": 980
    },
    {
      "name": "Week 11",
      "PV Submitted": 278,
      "PV Redline": 390
    },
    {
      "name": "Week 12",
      "PV Submitted": 189,
      "PV Redline": 480
    },
    {
      "name": "Week 13",
      "PV Submitted": 239,
      "PV Redline": 380
    },
    {
      "name": "Week 14",
      "PV Submitted": 349,
      "PV Redline": 430
    },
    {
      "name": "Week 15",
      "PV Submitted": 400,
      "PV Redline": 200
    },
    {
      "name": "Week 2",
      "PV Submitted": 300,
      "PV Redline": 139
    },
    {
      "name": "Week 3",
      "PV Submitted": 200,
      "PV Redline": 980
    },
    {
      "name": "Week 4",
      "PV Submitted": 278,
      "PV Redline": 390
    },
    {
      "name": "Week 5",
      "PV Submitted": 189,
      "PV Redline": 480
    },
    {
      "name": "Week 6",
      "PV Submitted": 239,
      "PV Redline": 380
    },
    {
      "name": "Week 7",
      "PV Submitted": 349,
      "PV Redline": 430
    },
    {
      "name": "Week 1",
      "PV Submitted": 400,
      "PV Redline": 200
    },
    {
      "name": "Week 2",
      "PV Submitted": 300,
      "PV Redline": 139
    },
    {
      "name": "Week 3",
      "PV Submitted": 200,
      "PV Redline": 980
    },
    {
      "name": "Week 4",
      "PV Submitted": 278,
      "PV Redline": 390
    },
    {
      "name": "Week 5",
      "PV Submitted": 189,
      "PV Redline": 480
    },
    {
      "name": "Week 6",
      "PV Submitted": 239,
      "PV Redline": 380
    },
    {
      "name": "Week 7",
      "PV Submitted": 349,
      "PV Redline": 430
    },
    {
      "name": "Week 1",
      "PV Submitted": 400,
      "PV Redline": 200
    },
    {
      "name": "Week 2",
      "PV Submitted": 300,
      "PV Redline": 139
    },
    {
      "name": "Week 3",
      "PV Submitted": 200,
      "PV Redline": 980
    },
    {
      "name": "Week 4",
      "PV Submitted": 278,
      "PV Redline": 390
    },
    {
      "name": "Week 5",
      "PV Submitted": 189,
      "PV Redline": 480
    },
    {
      "name": "Week 6",
      "PV Submitted": 239,
      "PV Redline": 380
    },
    {
      "name": "Week 7",
      "PV Submitted": 349,
      "PV Redline": 430
    },
    {
      "name": "Week 1",
      "PV Submitted": 400,
      "PV Redline": 200
    },
    {
      "name": "Week 2",
      "PV Submitted": 300,
      "PV Redline": 139
    },
    {
      "name": "Week 3",
      "PV Submitted": 200,
      "PV Redline": 980
    },
    {
      "name": "Week 4",
      "PV Submitted": 278,
      "PV Redline": 390
    },
    {
      "name": "Week 5",
      "PV Submitted": 189,
      "PV Redline": 480
    },
    {
      "name": "Week 6",
      "PV Submitted": 239,
      "PV Redline": 380
    },
    {
      "name": "Week 7",
      "PV Submitted": 349,
      "PV Redline": 430
    },
    {
      "name": "Week 1",
      "PV Submitted": 400,
      "PV Redline": 200
    },
    {
      "name": "Week 2",
      "PV Submitted": 300,
      "PV Redline": 139
    },
    {
      "name": "Week 3",
      "PV Submitted": 200,
      "PV Redline": 980
    },
    {
      "name": "Week 4",
      "PV Submitted": 278,
      "PV Redline": 390
    },
    {
      "name": "Week 5",
      "PV Submitted": 189,
      "PV Redline": 480
    },
    {
      "name": "Week 6",
      "PV Submitted": 239,
      "PV Redline": 380
    },
    {
      "name": "Week 7",
      "PV Submitted": 349,
      "PV Redline": 430
    },
    {
      "name": "Week 5",
      "PV Submitted": 189,
      "PV Redline": 480
    },
    {
      "name": "Week 6",
      "PV Submitted": 239,
      "PV Redline": 380
    },
    {
      "name": "Week 7",
      "PV Submitted": 349,
      "PV Redline": 430
    },

  ]
  const areaData = [
    { "name": "Week 1", "uv": 40, "amt": 2400 },
    { "name": "Week 2", "uv": 30, "amt": 2210 },
    { "name": "Week 3", "uv": 20, "amt": 2290 },
    { "name": "Week 4", "uv": 27.8, "amt": 2000 },
    { "name": "Week 5", "uv": 18.9, "amt": 2181 },
    { "name": "Week 6", "uv": 23.9, "amt": 2500 },
    { "name": "Week 7", "uv": 34.9, "amt": 2100 }
  ];



  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        <BackButtom heading="Permit Redline %" />
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
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
          >

            <div className='permitredline-header'>
              <p>Permit Redline by Count</p>
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
                    label={'AHJ'}
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
                    label={'AHJ'}
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



            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={400}>


                <AreaChart width={730} height={250} data={areaData}
                  margin={{ top: 22, right: 18, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#84B3FF" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#84B3FF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#84B3FF" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#84B3FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" className={styles.axis} height={50} tickSize={10} angle={-45} dy={12} interval={0} />
                  <YAxis tickSize={10} className={styles.axis} tickFormatter={(value) => `${value}%`} />
                  <Tooltip
                    cursor={{ fill: '#377CF6', stroke: '#377CF6' }}
                    wrapperStyle={{
                      outline: 'none',
                      borderRadius: 4,
                      padding: 4,
                      boxShadow: 'none',
                      fontSize: 12,
                    }}
                    formatter={(value) => `${value}%`}
                  />
                  <Area type="monotone" dataKey="uv" stroke="#84B3FF" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermitRedLine;
