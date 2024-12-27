import React, { useEffect, useState } from 'react';
import SelectOption from '../../components/selectOption/SelectOption';
import MicroLoader from '../../components/loader/MicroLoader';
import LineGraph from '../components/LineGraph';
import BarChartExample from '../components/BarChart';
import TableCustom from '../components/Tables/CustomTable';
import WeekSelect from '../components/Dropdowns/WeekSelect';
import YearSelect from '../components/Dropdowns/YearSelect';
import DaySelect from '../components/Dropdowns/DaySelect';
import CompanySelect from '../components/Dropdowns/CompanySelect';
import BackButtom from '../components/BackButtom';
import { reportingCaller } from '../../../infrastructure/web_api/services/apiUrl';
import LineGraphProd from './LineChartProd';
import TableProd1 from './Table1';
import MulCol from './MulCol';
import ProductionBar from './ProductionBar';
import DataNotFound from '../../components/loader/DataNotFound';

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

interface SubReport {
  sub_report_name: string;
  table_data: {
    Office: string;
    'Scheduled-kW': number;
  }[];
  chart_data: {
    week: number;
    [key: string]: number;
  }[];
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

  const leaderDealer = (newFormData: any): { value: string; label: string }[] =>
    newFormData?.dealer_name?.map((value: string) => ({
      value,
      label: value,
    }));

  const [data, setData] = useState([
    { column1: 'Tucson', column2: '0' },
    { column1: 'Texas', column2: '0' },
    { column1: 'Tempe', column2: '0' },
    { column1: 'Peoria/Kingman', column2: '0' },
    { column1: 'Colarado', column2: '0' },
    { column1: 'Albuquerque/El Paso', column2: '0' },
    { column1: '#N/A', column2: '0' },
    // ... more data
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
    height: '300px',
    marginBottom: '-41px',
    padding: "1rem 0",
    boxShadow: '2px 4px 8px -1px rgba(0, 0, 0, 0.1)',
    borderRadius: "8px",
    border: '1px solid rgba(0, 0, 0, 0.1)',
  };

  //////////////////////

  const [selectedYear, setSelectedYear] = useState<Option>({
    label: '2024',
    value: '2024',
  });
  const handleYearChange = (value: Option | null) => {
    if (value) {
      setSelectedYear(value);
    }
  };
  const [selectedWeek, setSelectedWeek] = useState<Option>({
    label: 'Week 1',
    value: '1',
  });
  const handleWeekChange = (value: Option | null) => {
    if (value) {
      setSelectedWeek(value);
    }
  };

  const [selectedOffices, setSelectedOffices] = useState<string[]>(['Tucson']);

  const [subReports, setSubReports] = useState<SubReport[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await reportingCaller('get_productionsummaryreport', {
          year: parseInt(selectedYear.value),
          report_type: reportType.value,
          office: [
            'TXHOUS01',
            'AZTEM01',
            'TXDAL01',
            'NMABQ01',
            'COGJT1',
            'CODEN1',
          ],
        });

        if (response.status === 200) {
          setSubReports(response.data.sub_reports);
          setLoading(false);
        } else {
          console.error('Error fetching data:', response.data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error making API request:', error);
        setLoading(false);
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedYear, reportType]);

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
          <div>
            <CompanySelect
              onOfficeChange={(values) => setSelectedOffices(values)}
            />
          </div>
          <div>
            <YearSelect value={selectedYear} onChange={handleYearChange} />
          </div>
          <div>
            <WeekSelect value={selectedWeek} onChange={handleWeekChange} />
          </div>
        </div>
      </div>
      <div className="reports-yscroll">
        <div
          style={{
            background: '#e0e0e0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            width: '100%',
            fontSize: "1rem",
            fontWeight: "600",
            padding: "8px",
            marginBottom: "1rem"
          }}
        >
          {reportType.label}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <MicroLoader />
          </div>
        ) : subReports ? (
          <>
            <div className="report-graphs">
              {subReports &&
                subReports
                  .filter(
                    (subReport) =>
                      subReport.sub_report_name ===
                        'Install Scheduled - Day 1' ||
                      subReport.sub_report_name ===
                        'Install Scheduled - Day 2' ||
                      subReport.sub_report_name ===
                        'Install Scheduled - Day 3' ||
                      subReport.sub_report_name === 'Install Fix Scheduled'
                  )
                  .map((subReport, index) => (
                    <div
                      key={index}
                      className="report-graph"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: "1.5rem"
                      }}
                    >
                      {false ? (
                        <div
                          className="flex items-center"
                          style={{
                            justifyContent: 'center',
                            minHeight: '400px',
                          }}
                        >
                          {' '}
                          <MicroLoader />{' '}
                        </div>
                      ) : (
                        <>
                          <TableProd1
                            reportType={reportType}
                            middleName={subReport.sub_report_name}
                            data={subReport.table_data}
                            setData={setData}
                          />
                          <div className="main-graph" style={stylesGraph}>
                            <h3 style={{ textAlign: 'center' }}>
                              {/* {reportType.label} {graph.title} */}
                            </h3>
                            <LineGraphProd data={subReport.chart_data} />
                            <p className="chart-info-report">Week</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
            </div>

            <div className="report-graphs">
              {subReports &&
                subReports
                  .filter(
                    (subReport) =>
                      subReport.sub_report_name === 'Install Completed' ||
                      subReport.sub_report_name === 'Install Fix Completed'
                  )
                  .map((subReport, index) => (
                    <div
                      key={index}
                      className="report-graph"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: "1.5rem",
                        gap: '16px',
                      }}
                    >
                      {false ? (
                        <div
                          className="flex items-center"
                          style={{ justifyContent: 'center' }}
                        >
                          {' '}
                          <MicroLoader />{' '}
                        </div>
                      ) : (
                        <>
                          <MulCol
                            reportType={reportType}
                            middleName={subReport.sub_report_name}
                            data={subReport.table_data}
                            setData={setData}
                          />
                          <div className="main-graph" style={stylesGraph}>
                            <h3 style={{ textAlign: 'center' }}>
                              {/* {reportType.label} {graph.title} */}
                            </h3>
                            <LineGraphProd data={subReport.chart_data} />
                            <p className="chart-info-report">Week</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
            </div>

            <div className="report-graphs">
              {subReports &&
                subReports
                  .filter(
                    (subReport) =>
                      subReport.sub_report_name === 'Pending Installs'
                  )
                  .map((subReport, index) => (
                    <div
                      className="report-graph"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: "1.5rem",
                        gap: '16px',
                      }}
                    >
                      {false ? (
                        <div
                          className="flex items-center"
                          style={{ justifyContent: 'center' }}
                        >
                          {' '}
                          <MicroLoader />{' '}
                        </div>
                      ) : (
                        <>
                          <TableProd1
                            reportType={reportType}
                            middleName={subReport.sub_report_name}
                            data={subReport.table_data}
                            setData={setData}
                          />
                          <div
                            className="main-graph some-margin"
                            style={stylesGraph}
                          >
                            <h3 style={{ textAlign: 'center' }}>
                              Pending {reportType.label}
                            </h3>
                            <ProductionBar data={subReport.chart_data} />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DataNotFound />
          </div>
        )}
      </div>
    </div>
  );
};

export default Production;
