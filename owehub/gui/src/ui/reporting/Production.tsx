import React, { useEffect, useState } from 'react';
import SelectOption from '../components/selectOption/SelectOption';
import MicroLoader from '../components/loader/MicroLoader';
import LineGraph from './components/LineGraph';
import BarChartExample from './components/BarChart';
import TableCustom from './components/Tables/CustomTable';
import WeekSelect from './components/Dropdowns/WeekSelect';
import YearSelect from './components/Dropdowns/YearSelect';
import CompanySelect from './components/Dropdowns/CompanySelect';
import BackButtom from './components/BackButtom';

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

const Production: React.FC = () => {
  const [graphs, setGraphs] = useState<GraphProps[]>([
    {
      title: 'Scheduled',
      stopColor: '#0096D3',
      borderColor: '#0096D3',
      data: [],
    },
    {
      title: 'Fixed Scheduled',
      stopColor: '#A6CE50',
      borderColor: '#A6CE50',
      data: [],
    },
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

  const [reportType, setReportType] = useState<Option>({
    label: 'Install',
    value: 'install',
  });

  const [data, setData] = useState([
    { column1: 'Tucson', column2: '0' },
    { column1: 'Texas', column2: '0' },
    { column1: 'Tempe', column2: '0' },
    { column1: 'Peoria/Kingman', column2: '0' },
    { column1: 'Colarado', column2: '0' },
    { column1: 'Albuquerque/El Paso', column2: '0' },
    { column1: '#N/A', column2: '0' },
  ]);

  useEffect(() => {
    if (reportType.label === 'Install') {
      setGraphs([
        {
          title: 'Scheduled - Day 1',
          stopColor: '#0096D3',
          borderColor: '#0096D3',
          data: [],
        },
        {
          title: 'Scheduled - Day 2',
          stopColor: '#0096D3',
          borderColor: '#0096D3',
          data: [],
        },
        {
          title: 'Scheduled - Day 3',
          stopColor: '#0096D3',
          borderColor: '#0096D3',
          data: [],
        },
        {
          title: 'Fixed Scheduled',
          stopColor: '#A6CE50',
          borderColor: '#A6CE50',
          data: [],
        },
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
    } else {
      setGraphs([
        {
          title: 'Scheduled',
          stopColor: '#0096D3',
          borderColor: '#0096D3',
          data: [],
        },
        {
          title: 'Fixed Scheduled',
          stopColor: '#A6CE50',
          borderColor: '#A6CE50',
          data: [],
        },
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
    }
  }, [reportType]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update `isMobile` when the window is resized
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stylesGraph = {
    width: isMobile ? 'auto' : '100%',
    height: '315px',
    backgroundColor: 'white',
    boxShadow:
      'rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.2) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
  };

  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        <BackButtom heading="Production" />
        <div className="report-header-dropdown flex-wrap">
          {/* <div><DaySelect /></div> */}
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
          <CompanySelect />
          <YearSelect />
          <WeekSelect />
        </div>
      </div>
      <div className="reports-yscroll">
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
                gap: '30px',
              }}
            >
              {false ? (
                <div
                  className="flex items-center"
                  style={{ justifyContent: 'center' }}
                >
                  <MicroLoader />
                </div>
              ) : (
                <>
                  <TableCustom
                    reportType={reportType}
                    middleName={graph.title}
                    data={data}
                    setData={setData}
                  />
                  <div
                    className="main-graph"
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    <h3 style={{ textAlign: 'center', marginBottom: '8px' }}>
                      {reportType.label} {graph.title}
                    </h3>
                    <div style={stylesGraph}>
                      <LineGraph />
                      <p className="chart-info-report">Week</p>
                    </div>
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
              gap: '30px',
            }}
          >
            {false ? (
              <div
                className="flex items-center"
                style={{ justifyContent: 'center' }}
              >
                <MicroLoader />
              </div>
            ) : (
              <>
                <TableCustom
                  reportType={reportType}
                  middleName="Pending"
                  data={data}
                  setData={setData}
                />

                <div
                  className="main-graph"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  <h3 style={{ textAlign: 'center', marginBottom: '8px' }}>
                    Pending {reportType.label}
                  </h3>
                  <div style={stylesGraph}>
                    <BarChartExample />
                    <p className="chart-info-report">Week</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Production;
