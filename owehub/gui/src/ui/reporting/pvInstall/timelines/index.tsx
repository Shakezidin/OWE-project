import React, { useState, useEffect } from 'react';
import { Select, Table } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer
} from 'recharts';
import './style.css';
import YearSelect from '../../components/Dropdowns/YearSelect';
import WeekSelect from '../../components/Dropdowns/WeekSelect';
import DaySelect from '../../components/Dropdowns/DaySelect';
import SelectOption from '../../../components/selectOption/SelectOption';
import CompanySelect from '../../components/Dropdowns/CompanySelect';

interface InstallData {
  name: string;
  week1: number | null;
  week2: number | null;
  week3: number | null;
  week4: number | null;
  total: number;
}

// Constants for colors
const OFFICE_COLORS = {
  'null': '#e2e535',
  '#N/A': '#90EE90',
  'Albuquerque/El Paso': '#20B2AA',
  'Colorado': '#87CEEB',
  'Peoria/Kingman': '#FFD700',
  'Tempe': '#9ACD32',
  'Texas': '#3CB371',
  'Tucson': '#00CED1'
};

interface Option {
  value: string;
  label: string;
}

const Timelines = () => {
  const [reportType, setReportType] = useState<Option>(
    {
      label: 'Install',
      value: 'install',
    }
  );

  const installCreatedData = [
    { name: 'Tucson', week1: -288.32, week2: -282.28, week3: -274.98, week4: -267.59, week5: -267.59, total: -124.44 },
    { name: 'Texas', week1: -287.67, week2: -281.98, week3: -273.75, week4: -266.20, week5: -266.20, total: -93.53 },
    { name: 'Tempe', week1: null, week2: null, week3: null, week4: null, week5: null, total: -38.42 },
    { name: 'Peoria/Kingm..', week1: -288.70, week2: -282.23, week3: -274.94, week4: -267.78, week5: -267.78, total: -134.27 },
    { name: 'Colorado', week1: -286.83, week2: -282.93, week3: -276.63, week4: -268.53, week5: -268.53, total: -78.42 },
    { name: 'Albuquerque/El Paso', week1: -289.39, week2: -281.87, week3: -274.99, week4: -268.20, week5: -268.20, total: -133.94 },
    { name: '#N/A', week1: null, week2: null, week3: null, week4: null, week5: null, total: -3.25 }
  ];


  const overallData = [
    { date: '27/2024', value: -150 },
    { date: '26/2024', value: -145 },
    { date: '25/2024', value: -140 },
    { date: '24/2024', value: -135 },
    { date: '23/2024', value: -130 },
    { date: '22/2024', value: -125 },
    { date: '21/2024', value: -120 },
    { date: '20/2024', value: -115 },
    { date: '19/2024', value: -110 },
    { date: '18/2024', value: -105 },
    { date: '17/2024', value: -100 },
    { date: '16/2024', value: -95 },
    { date: '15/2024', value: -93 }
  ];



  const installCompletedData = [
    { name: 'Tucson', week1: 0.26, week2: 0.64, week3: 0.46, week4: -0.04, total: 1.86 },
    { name: 'Peoria/Kingm..', week1: 0.90, week2: 0.75, week3: 2.74, week4: 0.11, total: 1.93 },
    { name: 'Albuquerque/El Paso', week1: null, week2: null, week3: null, week4: null, total: -10.33 },
    { name: '#N/A', week1: 0.96, week2: -0.04, week3: 0.04, week4: null, total: 1.00 },
    { name: 'null', week1: null, week2: null, week3: null, week4: null, total: 0.04 }
  ];

  const overallDataCompleted = [
    { date: '27-2024', value: 1.98 },
    { date: '28-2024', value: 5.26 },
    { date: '29-2024', value: 2.56 },
    { date: '30-2024', value: 2.96 },
    { date: '31-2024', value: 2.74 },
    { date: '32-2024', value: 3.21 },
    { date: '33-2024', value: 3.35 },
    { date: '34-2024', value: 4.00 },
    { date: '35-2024', value: 3.84 },
    { date: '36-2024', value: 4.99 },
    { date: '37-2024', value: 3.35 },
    { date: '38-2024', value: 4.30 },
    { date: '39-2024', value: 3.78 },
    { date: '40-2024', value: 8.40 }
  ];

  // Add this constant for the totals row
  const calculateTotals = (data: InstallData[]) => {
    return {
      week1: data.reduce((sum, row) => sum + (row.week1 || 0), 0),
      week2: data.reduce((sum, row) => sum + (row.week2 || 0), 0),
      week3: data.reduce((sum, row) => sum + (row.week3 || 0), 0),
      week4: data.reduce((sum, row) => sum + (row.week4 || 0), 0),
      total: data.reduce((sum, row) => sum + row.total, 0)
    };
  };

  const tooltipStyle = {
    fontSize: '8px',
    padding: '6px',
  };

  return (
    <div className="pv-install-dashboard bg-white p2">
      <div className="headingcount flex justify-between items-center">
        <h4 className="reports-title">PV Install Timelines</h4>
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

      {/* First Section */}
      <div className="section p2">
        <div className="section-header">
          <h3 className="section-title">Install Created to Install Completed Timeline</h3>
        </div>

        <div className="grid timeline-grid">
          {/* Table */}
          <div className="table-container">
            <div className="flex justify-end h5 bold" style={{ background: "#f0f4c3" }} title="Week / Customer">Week / Created Date to Completion in Days</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Office (2)</th>
                  <th>Week 1</th>
                  <th>Week 2</th>
                  <th>Week 3</th>
                  <th>Week 4</th>
                  <th>Grand total</th>
                </tr>
              </thead>
              <tbody>
                {installCreatedData.map((row, index) => (
                  <tr key={index}>
                    <td>{index === 0 ? '2024' : ''}</td>
                    <td>{row.name}</td>
                    <td>{row.week1?.toFixed(2) || '-'}</td>
                    <td>{row.week2?.toFixed(2) || '-'}</td>
                    <td>{row.week3?.toFixed(2) || '-'}</td>
                    <td>{row.week4?.toFixed(2) || '-'}</td>
                    <td>{row.total.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="grand-total-row">
                  <td>Grand total</td>
                  <td></td>
                  {Object.values(calculateTotals(installCreatedData)).map((value, idx) => (
                    <td key={idx}>{value.toFixed(2)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bar Chart */}
          <div className="chart-container">
            <div className="center mb-2 text-sm font-medium">Overall (Q3)</div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={overallData}
                margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 10,
                    fill: '#555'
                  }}
                  angle={-45}
                  dy={20}
                  dx={-8}
                  interval={0}
                  height={60}
                  label={{
                    value: "Week of Completion",
                    position: "bottom",
                    offset: 20,
                    fontSize: 12
                  }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#555' }}
                />
               <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  verticalAlign="top"
                  align="left"
                  height={36}
                  wrapperStyle={{
                    // paddingTop: '10px',
                    paddingLeft: '40px',
                    fontSize: 10,
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="rgb(0, 114, 240)"
                  name="Created Date to Completion in Days"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart for Install Created */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
          <div className="center mb-4 font-medium">Per Office</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={[1, 2, 3, 4, 5].map(week => ({
                week,
                ...Object.fromEntries(
                  installCreatedData
                    .filter(office => office.name !== '#N/A')
                    .map(office => [office.name, office[`week${week}` as keyof InstallData]])
                )
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#555' }} />
              <YAxis domain={[-290, -265]} tick={{ fontSize: 12, fill: '#555' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend verticalAlign="top" height={32} wrapperStyle={{ gap: 20, fontSize: 10 }} />
              {installCreatedData
                .filter(office => office.name !== '#N/A')
                .map((office, index) => (
                  <Line
                    key={office.name}
                    type="monotone"
                    dataKey={office.name}
                    stroke={`hsl(${index * 40}, 70%, 50%)`}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Section */}
      <div className="section p2">
        <div className="section-header">
          <h3 className="section-title">Install Date to Install Completed Timeline</h3>
        </div>

        <div className="grid timeline-grid">
          {/* Table */}
          <div className="table-container mt0">
            <div className="flex justify-end h5 bold" style={{ background: "#b2ebf2" }} title="Week / Customer">Week / Install Date to Completion in Days</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Office (2)</th>
                  <th>Week 1</th>
                  <th>Week 2</th>
                  <th>Week 3</th>
                  <th>Week 4</th>
                  <th>Grand total</th>
                </tr>
              </thead>
              <tbody>
                {installCompletedData.map((row, index) => (
                  <tr key={index}>
                    <td>{index === 0 ? '2024' : ''}</td>
                    <td>{row.name}</td>
                    <td>{row.week1?.toFixed(2) || '-'}</td>
                    <td>{row.week2?.toFixed(2) || '-'}</td>
                    <td>{row.week3?.toFixed(2) || '-'}</td>
                    <td>{row.week4?.toFixed(2) || '-'}</td>
                    <td>{row.total.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="grand-total-row">
                  <td>Grand total</td>
                  <td></td>
                  {Object.values(calculateTotals(installCompletedData)).map((value, idx) => (
                    <td key={idx}>{value.toFixed(2)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bar Chart */}
          <div className="chart-container">
            <div className="center mb-2 text-sm font-medium">Overall (Q3)</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={overallDataCompleted}
                margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 10,
                    fill: '#555'
                  }}
                  angle={-45}
                  dy={20}
                  dx={-8}
                  interval={0}
                  height={60}
                  label={{
                    value: "Week of Completion",
                    position: "bottom",
                    offset: 20,
                    fontSize: 12
                  }}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 10, fill: '#555' }}
                  ticks={[0, 2.5, 5, 7.5, 10]}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  verticalAlign="top"
                  align="left"
                  height={36}
                  wrapperStyle={{
                    // paddingTop: '10px',
                    paddingLeft: '40px',
                    fontSize: 10,
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="rgb(0, 114, 240)"
                  name="Install Date to Completion in Days"
                  label={{
                    position: 'top',
                    fill: '#555',
                    fontSize: 12,
                    formatter: (value: any) => value.toFixed(2)
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart for Install Completed */}
        <div className="chart-container mt-8">
          <div className="center mb-4 font-medium">Per Office</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[1, 2, 3, 4].map(week => ({
              week,
              ...Object.fromEntries(
                installCompletedData
                  .map(office => [office.name, office[`week${week}` as keyof InstallData]])
              )
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#555' }} />
              <YAxis domain={[0, 3]} tick={{ fontSize: 12, fill: '#555' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend verticalAlign="top" height={32} wrapperStyle={{ gap: 20, fontSize: 10 }} />
              {installCompletedData.map((office, index) => (
                <Line
                  key={office.name}
                  type="monotone"
                  dataKey={office.name}
                  name={office.name}
                  stroke={`hsl(${index * 40}, 70%, 50%)`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Timelines;
