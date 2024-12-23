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

const Timelines = () => {
  const [selectedOffice, setSelectedOffice] = useState<string>('All');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Week/Year');
  const installCreatedData = [
    { name: 'Tucson', week1: -288.32, week2: -282.28, week3: -274.69, week4: -267.59, total: -124.44 },
    { name: 'Texas', week1: -287.67, week2: -281.98, week3: -273.75, week4: -266.20, total: -93.53 },
    { name: 'Tempe', week1: null, week2: null, week3: null, week4: null, total: -38.42 },
    { name: 'Peoria/Kingm..', week1: -288.70, week2: -282.23, week3: -274.94, week4: -267.78, total: -134.27 },
    { name: 'Colorado', week1: -286.83, week2: -282.43, week3: -274.63, week4: -268.53, total: -78.42 },
    { name: 'Albuquerque', week1: -289.39, week2: -281.87, week3: -274.99, week4: -268.20, total: -153.94 },
    { name: '#N/A', week1: null, week2: null, week3: null, week4: null, total: -3.25 }
  ];

  const installCompletedData = [
    { name: 'Tucson', week1: 0.96, week2: 1.52, week3: 1.41, week4: 3.36, total: 1.55 },
    { name: 'Texas', week1: 0.98, week2: 0.67, week3: 0.9, week4: 0.46, total: 6.52 },
    { name: 'Tempe', week1: null, week2: null, week3: null, week4: null, total: 1.57 },
    { name: 'Peoria/Kingm..', week1: 0.88, week2: 1.7, week3: 1.08, week4: 1.11, total: 2.14 },
    { name: 'Colorado', week1: 0.35, week2: 2.19, week3: 2.02, week4: 2.52, total: 4.4 },
    { name: 'Albuquerque', week1: 6.06, week2: 11.42, week3: 4.76, week4: 20.93, total: 1.68 }
  ];

  const overallData = Array.from({ length: 20 }, (_, i) => ({
    date: `Q3-${2024 - i}`,
    value: -150 + Math.random() * 50
  })).reverse();

  const headerSelectors = [
    { defaultValue: 'Quarter - Year', options: ['Quarter - Year'] },
    { defaultValue: 'Week - Year', options: ['Week - Year'] },
    { defaultValue: 'Office', options: ['Office'] }
  ];

  const tableHeaders = [
    'Year', 'Office (2)', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'W', 'Grand total'
  ];

  const chartStyles = {
    lineChart: {
      height: 300,
      gridLines: true,
      yAxisDomain: [-300, 0],
      secondYAxisDomain: [0, 25]
    },
    barChart: {
      height: 200,
      fill: '#1f77b4',
      secondFill: '#2ca02c'
    }
  };

  const tableStyles = {
    firstSection: { background: '#f8ffd7' },
    secondSection: { background: '#e1f5fe' }
  };

  return (
    <div className="pv-install-dashboard bg-white p2">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">PV Install Timelines</h3>
        </div>
        <div className="flex">
          <div className="mr2 ">
            <Select
              // mode="multiple"
              // allowClear
              value={selectedOffice}
              onChange={setSelectedOffice}
              style={{ width: 200 }}
              options={[
                { value: 'All', label: 'Office' },
                ...Object.keys(OFFICE_COLORS).map((office) => ({
                  value: office,
                  label: office,
                })),
              ]}
            />
          </div>
          <div className="mr2">
            <Select
              value={selectedTeam}
              onChange={setSelectedTeam}
              style={{ width: 200 }}
              options={[
                { value: 'All', label: 'Related Teams' },
                { value: 'AZTEM03', label: 'AZTEM03' },
                { value: 'AZTEM06', label: 'AZTEM06' },
                { value: 'AZTEM04', label: 'AZTEM04' },
                { value: 'AZPEO07', label: 'AZPEO07' },
                { value: 'AZTEM08', label: 'AZTEM08' },
                { value: 'AZPEO01', label: 'AZPEO01' },
                { value: 'AZTEM01', label: 'AZTEM01' },
                { value: 'AZTUC01', label: 'AZTUC01' },
                { value: 'AZPEO04', label: 'AZPEO04' },
                { value: 'AZTEM02', label: 'AZTEM02' },
                { value: 'AZPEO06', label: 'AZPEO06' },
                { value: 'null', label: 'null' }]}
            />
          </div>
          <div>
            <Select
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              style={{ width: 200 }}
              options={[
                { value: 'Week/Year', label: 'Completed Week/Year' },
                { value: '2024-12-1 12:00:00', label: '2024-12-1 12:00:00' },
                { value: '2024-11-1 12:00:00', label: '2024-11-1 12:00:00' },
                { value: '2024-10-1 12:00:00', label: '2024-10-1 12:00:00' },
                { value: '2024-09-1 12:00:00', label: '2024-09-1 12:00:00' },
                { value: '2024-08-1 12:00:00', label: '2024-08-1 12:00:00' },
                { value: '2024-07-1 12:00:00', label: '2024-07-1 12:00:00' },
                { value: '2024-06-1 12:00:00', label: '2024-06-1 12:00:00' },
                { value: '2024-05-1 12:00:00', label: '2024-05-1 12:00:00' },
                { value: '2024-04-1 12:00:00', label: '2024-04-1 12:00:00' },
                { value: '2024-03-1 12:00:00', label: '2024-03-1 12:00:00' },
                { value: '2024-02-1 12:00:00', label: '2024-02-1 12:00:00' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* First Section */}
      <div className="section p2">
        <div className="section-header">
          <h3 className="section-title">Install Created to Install Completed Timeline</h3>
        </div>
        
        <div className="grid">
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
              </tbody>
            </table>
          </div>

          {/* Bar Chart */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overallData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1f77b4" name="Created Date to Completion in Days" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart for Install Created */}
        <div className="chart-container mt-8">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={[1, 2, 3, 4].map(week => ({
              week,
              ...Object.fromEntries(
                installCreatedData
                  .filter(office => office.name !== '#N/A')
                  .map(office => [office.name, office[`week${week}` as keyof InstallData]])
              )
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[-400, 100]} />
              <Tooltip />
              <Legend />
              {installCreatedData
                .filter(office => office.name !== '#N/A')
                .map((office, index) => (
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

      {/* Second Section */}
      <div className="section p2">
        <div className="section-header">
          <h3 className="section-title">Install Date to Install Completed Timeline</h3>
        </div>
        
        <div className="grid">
          {/* Table */}
          <div className="table-container">
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
              </tbody>
            </table>
          </div>

          {/* Bar Chart */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overallData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="value" fill="#2ca02c" name="Install Date to Completion in Days" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart for Install Completed */}
        <div className="chart-container mt-8">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={[1, 2, 3, 4].map(week => ({
              week,
              ...Object.fromEntries(
                installCompletedData
                  .map(office => [office.name, office[`week${week}` as keyof InstallData]])
              )
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 25]} />
              <Tooltip />
              <Legend />
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
