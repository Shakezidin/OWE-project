import React, { useEffect, useState } from 'react';
import './totalcount.css';
import TotalCard from './totalCard';

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';
import ReportsSelectOption from '../components/selectOption/ReportsSelectOption';
import { availableStates } from '../../core/models/data_models/SelectDataModel';
import { postCaller } from '../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../infrastructure/web_api/api_client/EndPoints';
import DropdownCheckBox from '../components/DropdownCheckBox';
import { MdDownloading } from 'react-icons/md';
import { LuImport } from 'react-icons/lu';

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

// Custom tooltip component
const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className='customTooltip'>
          <p>{label}</p>
          <p>{`Value: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
 

const TotalCount: React.FC = () => {
  const graphs: GraphProps[] = [
    {
      title: 'Sales',
      stopColor: '#0096D3',
      borderColor: '#0096D3',
      data: [
        { name: 'Mon', pv: 2400 },
        { name: 'Tue', pv: 1398 },
        { name: 'Wed', pv: 9800 },
        { name: 'Thu', pv: 3908 },
        { name: 'Fri', pv: 4800 },
        { name: 'Sat', pv: 3800 },
      ],
    },
    {
      title: 'NTP',
      stopColor: '#A6CE50',
      borderColor: '#A6CE50',
      data: [
        { name: 'Mon', pv: 2000 },
        { name: 'Tue', pv: 3000 },
        { name: 'Wed', pv: 4000 },
        { name: 'Thu', pv: 2500 },
        { name: 'Fri', pv: 2800 },
        { name: 'Sat', pv: 4500 },
      ],
    },
    {
      title: 'Installs',
      stopColor: '#377CF6',
      borderColor: '#377CF6',
      data: [
        { name: 'Mon', pv: 500 },
        { name: 'Tue', pv: 800 },
        { name: 'Wed', pv: 1200 },
        { name: 'Thu', pv: 1500 },
        { name: 'Fri', pv: 1700 },
        { name: 'Sat', pv: 2100 },
      ],
    },
  ];
  const [newFormData, setNewFormData] = useState({});
  const [dealerOption, setDealerOption] = useState<Option[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<Option[]>([]);
  const [isExportingData, setIsExporting] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState<Option>({ label: 'This Week', value: 'This Week' });
  const [selectedStateOption, setSelectedStateOption] = useState<Option>({ label: 'All', value: 'All' });

  const leaderDealer = (newFormData: any): { value: string; label: string }[] =>
    newFormData?.dealer_name?.map((value: string) => ({
      value,
      label: value,
    }));

  const tableData = {
    tableNames: ['available_states', 'dealer_name'],
  };

  const getNewFormDataa = async () => {
    const tableData = {
      tableNames: ['dealer_name'],
    };
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    if (res.status > 200) {
      return;
    }
    if (res.data?.dealer_name) {
      setSelectedDealer(leaderDealer(res.data));
      setDealerOption(leaderDealer(res.data));
    }
  };

  useEffect(() => {
    getNewFormDataa();
  }, []);

  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData((prev) => ({ ...prev, ...res.data }));
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  const handleReportOptionChange = (newValue: Option | null) => {
    if (newValue) {
      setSelectedReportOption(newValue);
      console.log('Selected Report Option:', newValue);
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

  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        <h4 className="reports-title">Reports</h4>
        <div className="report-header-dropdown">
          <div style={{ marginTop: '-24px' }}>
            <ReportsSelectOption
              options={[
                { label: 'This Week', value: 'This Week' }, // Default "All State" option
                { label: 'This  Month', value: 'This Month' },
                { label: 'Last  Month', value: 'Last Month' },
                { label: 'This  Year', value: 'This Year' },
                { label: 'Last  Year', value: 'Last Year' },
              ]}
              onChange={handleReportOptionChange}
              value={selectedReportOption}
              menuStyles={{
                width: 400,
              }}
              menuListStyles={{
                fontWeight: 400,
                width: 150,
              }}
              singleValueStyles={{
                fontWeight: 400,
              }}
              width="150px"
            />
          </div>
          <div style={{ marginTop: '-24px' }}>
            <ReportsSelectOption
              options={[
                { label: 'All State', value: 'All' }, // Default "All State" option
                ...(availableStates(newFormData) || []), // Other states
              ]}
              onChange={handleStateOptionChange}
              value={selectedStateOption}
              menuStyles={{
                width: 400,
              }}
              menuListStyles={{
                fontWeight: 400,
                width: 150,
              }}
              singleValueStyles={{
                fontWeight: 400,
              }}
              width="150px"
            />
          </div>

          <div>
            <DropdownCheckBox
              label={selectedDealer.length === 1 ? 'partner' : 'partners'}
              placeholder={'Search partners'}
              selectedOptions={selectedDealer}
              options={dealerOption}
              onChange={(val) => {
                setSelectedDealer(val);
              }}
            />
          </div>

          <div className="perf-export-btn relative pipline-export-btn">
            <button
              data-tooltip-id="export"
              className={`performance-exportbtn flex items-center justify-center totalcount-export ${isExportingData ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {isExportingData ? (
                <MdDownloading className="downloading-animation" size={20} />
              ) : (
                <LuImport size={20} />
              )}
            </button>

           
          </div>
        </div>
      </div>
      <div>
        <TotalCard />
      </div>
      <div className="report-graphs">
        {graphs.map((graph, index) => (
          <div key={index} className="report-graph">
            <h5 className="graph-title">{graph.title}</h5>
            <div style={{ width: '100%', height: '236px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graph.data}>
                  <defs>
                    <linearGradient
                      id={`colorPv-${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="12%"
                        stopColor={graph.stopColor}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="88%"
                        stopColor={graph.stopColor}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fontWeight: 500, fill: '#818181' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fontWeight: 500, fill: '#818181' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="pv"
                    stroke={graph.stopColor}
                    strokeWidth={3}
                    fill={`url(#colorPv-${index})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalCount;
