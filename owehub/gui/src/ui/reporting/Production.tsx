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
import WeekSelect from './components/Dropdowns/WeekSelect';
import YearSelect from './components/Dropdowns/YearSelect';
import DaySelect from './components/Dropdowns/DaySelect';
import CompanySelect from './components/Dropdowns/CompanySelect';

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
  

  const leaderDealer = (newFormData: any): { value: string; label: string }[] =>
    newFormData?.dealer_name?.map((value: string) => ({
      value,
      label: value,
    }));

  const tableData = {
    tableNames: ['available_states', 'dealer_name'],
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

  

  const defaultPeriodOptions = periodFilterOptions.filter((period) =>
    ['This Week', 'Last Week', 'This Month', 'Last Month'].includes(
      period.label ?? ''
    )
  );

 

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
          <div><YearSelect /></div>
          <div><WeekSelect /></div>
          <div><DaySelect /></div>
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
          <div><CompanySelect /></div>
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
                  <p className='chart-info-report'>Week</p>
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
                <BarChartExample />
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
};

export default Production;
