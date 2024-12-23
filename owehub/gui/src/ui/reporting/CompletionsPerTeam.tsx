import React, { useState, useEffect } from 'react';
import { Select, Table } from 'antd';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

const CODE_COLORS = {
  'AZPECO1': '#6B8E23',
  'AZTUC01': '#98FB98',
  'AZTEM01': '#B0E0E6',
  'CODEN1': '#87CEEB',
  'NMABQ01': '#F0E68C',
  'TXDAL01': '#3CB371',
  'AZKING01': '#00CED1'
};


// Add new color constants for AZTEM and AZTUC teams
const AZTEM_COLORS = {
  'AZTEM01': '#9ECA3B', // Light green
  'AZTEM02': '#4CAF50', // Green
  'AZTEM03': '#795548', // Brown
  'AZTEM04': '#2196F3', // Blue
  'AZTEM05': '#FFC107', // Yellow
  'AZTEM06': '#8BC34A', // Light green
  'AZTEM07': '#009688', // Teal
  'AZTEM08': '#00BCD4', // Cyan
  'AZTEM09': '#E91E63', // Pink
  'AZTEM10': '#FF5722'  // Deep orange
};

const AZTUC_COLORS = {
  'AZTUC01': '#CDDC39', // Lime
  'AZTUC02': '#4CAF50', // Green
  'AZTUC03': '#795548', // Brown
  'AZTUC04': '#2196F3', // Blue
  'AZTUC05': '#FFC107'  // Yellow
};

// Update AZPEO colors to match the image
const AZPEO_COLORS = {
  'AZPEO01': '#E2E535', // Light yellow
  'AZPEO02': '#90EE90', // Light green
  'AZPEO03': '#87CEEB', // Sky blue
  'AZPEO04': '#4169E1', // Royal blue
  'AZPEO05': '#FFD700', // Gold
  'AZPEO06': '#228B22', // Forest green
  'AZPEO07': '#32CD32', // Lime green
  'AZPEO08': '#20B2AA', // Light sea green
  'AZPEO09': '#FF6B6B', // Light red
  'AZPEO10': '#FF8C00', // Dark orange
  'AZPEO11': '#FF69B4', // Hot pink
  'AZPEO12': '#98FB98', // Pale green
  'AZPEO13': '#9370DB', // Medium purple
  'AZPEO14': '#CD853F', // Peru
  'AZPEO15': '#4682B4'  // Steel blue
};
// Generate sample data for AZPEO chart (weeks 1-52)
const azpeoData = Array.from({ length: 52 }, (_, i) => ({
  week: `Week ${i + 1}`,
  'AZPEO01': Math.floor(Math.random() * 100) + 1, // Generate random integer between 1 and 100
  'AZPEO02': Math.floor(Math.random() * 100) + 1,
  'AZPEO03': Math.floor(Math.random() * 100) + 1,
  'AZPEO04': Math.floor(Math.random() * 100) + 1,
  'AZPEO05': Math.floor(Math.random() * 100) + 1,
  'AZPEO06': Math.floor(Math.random() * 100) + 1,
  'AZPEO07': Math.floor(Math.random() * 100) + 1,
  'AZPEO08': Math.floor(Math.random() * 100) + 1,
  'AZPEO09': Math.floor(Math.random() * 100) + 1,
  'AZPEO10': Math.floor(Math.random() * 100) + 1,
  'AZPEO11': Math.floor(Math.random() * 100) + 1,
  'AZPEO12': Math.floor(Math.random() * 100) + 1,
  'AZPEO13': Math.floor(Math.random() * 100) + 1,
  'AZPEO14': Math.floor(Math.random() * 100) + 1,
  'AZPEO15': Math.floor(Math.random() * 100) + 1,
}));

// Generate sample data for AZTEM chart (weeks 1-52)
const aztemData = Array.from({ length: 52 }, (_, i) => ({
  week: `Week ${i + 1}`,
  'AZTEM01': Math.floor(Math.random() * 100) + 1, // Generate random integer between 1 and 100
  'AZTEM02': Math.floor(Math.random() * 100) + 1,
  'AZTEM03': Math.floor(Math.random() * 100) + 1,
  'AZTEM04': Math.floor(Math.random() * 100) + 1,
  'AZTEM05': Math.floor(Math.random() * 100) + 1,
  'AZTEM06': Math.floor(Math.random() * 100) + 1,
  'AZTEM07': Math.floor(Math.random() * 100) + 1,
  'AZTEM08': Math.floor(Math.random() * 100) + 1,
  'AZTEM09': Math.floor(Math.random() * 100) + 1,
  'AZTEM10': Math.floor(Math.random() * 100) + 1,
}));

// Generate sample data for AZTUC chart (weeks 1-52)
const aztucData = Array.from({ length: 52 }, (_, i) => ({
  week: `Week ${i + 1}`,
  'AZTUC01': Math.floor(Math.random() * 100) + 1, // Generate random integer between 1 and 100
  'AZTUC02': Math.floor(Math.random() * 100) + 1,
  'AZTUC03': Math.floor(Math.random() * 100) + 1,
  'AZTUC04': Math.floor(Math.random() * 100) + 1,
  'AZTUC05': Math.floor(Math.random() * 100) + 1,
}));

// Update CODEN colors to match the image (approximate) - Same as before
const CODEN_COLORS = {
  'CODENON': '#1f77b4', // Blue
  'CODENOT': '#ff7f0e', // Orange
  'CODENG': '#2ca02c', // Green
  'CODENST': '#d62728', // Red
  'CODENOS': '#9467bd', // Purple
  'CODENDR': '#8c564b', // Brown
  'CODENDL': '#e377c2', // Pink
  'CODENGS': '#7f7f7f', // Gray
  'CODENDS': '#bcbd22', // Olive/Lime
  'CODENDE': '#17becf'  // Cyan
};

// Generate sample data for CODEN chart (weeks 1-52) - DYNAMIC
const codenData = Array.from({ length: 52 }, (_, i) => ({
  week: `Week ${i + 1}`,
  CODENON: Math.floor(Math.random() * 100) + 1, // Generate random integer between 1 and 100
  CODENOT: Math.floor(Math.random() * 100) + 1,
  CODENG: Math.floor(Math.random() * 100) + 1,
  CODENST: Math.floor(Math.random() * 100) + 1,
  CODENOS: Math.floor(Math.random() * 100) + 1,
  CODENDR: Math.floor(Math.random() * 100) + 1,
  CODENDL: Math.floor(Math.random() * 100) + 1,
  CODENGS: Math.floor(Math.random() * 100) + 1,
  CODENDS: Math.floor(Math.random() * 100) + 1,
  CODENDE: Math.floor(Math.random() * 100) + 1,
}));

// Update COGJT colors to match the image (approximate) - Same as before
const COGJT_COLORS = {
  'COGITOT': '#1f77b4', // Blue
  'COGITO1': '#ff7f0e', // Orange
  'ODGJTEI': '#2ca02c', // Green
  'COGITOZ': '#d62728', // Red
  'COGITOO': '#9467bd', // Purple
  'COGITOR': '#8c564b', // Brown
  'NMARGOT': '#e377c2'  // Pink
};

// Generate sample data for COGJT chart (weeks 1-52) - DYNAMIC
const cogjtData = Array.from({ length: 52 }, (_, i) => ({
  week: `Week ${i + 1}`,
  COGITOT: Math.floor(Math.random() * 100) + 1, // Generate random integer between 1 and 100
  COGITO1: Math.floor(Math.random() * 100) + 1,
  ODGJTEI: Math.floor(Math.random() * 100) + 1,
  COGITOZ: Math.floor(Math.random() * 100) + 1,
  COGITO0: Math.floor(Math.random() * 100) + 1,
  COGITOR: Math.floor(Math.random() * 100) + 1,
  NMARGOT: Math.floor(Math.random() * 100) + 1,
}));

const NMABQ_COLORS = {
  'NMABQ01': '#FFD700', // Gold
  'NMABQ02': '#90EE90', // Light green
  'NMABQ03': '#87CEEB', // Sky blue
  'NMABQ04': '#FF69B4', // Hot pink
  'NMABQ05': '#9370DB', // Medium purple
  'NMABQ06': '#20B2AA', // Light sea green
  'NMABQ07': '#FF8C00', // Dark orange
  'NMABQ08': '#98FB98', // Pale green
  'NMABQ09': '#CD853F', // Peru
  'NMABQ10': '#4682B4'  // Steel blue
};

const TXDAL_COLORS = {
  'TXDAL01': '#1f77b4', // Blue
  'TXDAL02': '#2ca02c', // Green
  'TXDAL03': '#ff7f0e', // Orange
  'TXSAN01': '#d62728'  // Red
};

const TXELP_COLORS = {
  'TXELP01': '#FFD700', // Gold
  'TXELP02': '#32CD32'  // Lime green
};

// Generate sample data for NMABQ chart (weeks 1-52)
const nmabqData = Array.from({ length: 52 }, (_, i) => ({
  week: `Week ${i + 1}`,
  'NMABQ01': Math.floor(Math.random() * 100) + 1, // Generate random integer between 1 and 100
  'NMABQ02': Math.floor(Math.random() * 100) + 1,
  'NMABQ03': Math.floor(Math.random() * 100) + 1,
  'NMABQ04': Math.floor(Math.random() * 100) + 1,
  'NMABQ05': Math.floor(Math.random() * 100) + 1,
  'NMABQ06': Math.floor(Math.random() * 100) + 1,
  'NMABQ07': Math.floor(Math.random() * 100) + 1,
  'NMABQ08': Math.floor(Math.random() * 100) + 1,
  'NMABQ09': Math.floor(Math.random() * 100) + 1,
  'NMABQ10': Math.floor(Math.random() * 100) + 1,
}));

// Generate sample data for TXDAL chart (weeks 1-52)
const txdalData = Array.from({ length: 52 }, (_, i) => ({
  week: `Week ${i + 1}`,
  'TXDAL01': Math.floor(Math.random() * 100) + 1, // Generate random integer between 1 and 100
  'TXDAL02': Math.floor(Math.random() * 100) + 1,
  'TXDAL03': Math.floor(Math.random() * 100) + 1,
  'TXDAL04': Math.floor(Math.random() * 100) + 1,
}));

// Generate sample data for TXELP chart (weeks 1-52)
const txelData = Array.from({ length: 52 }, (_, i) => ({
  week: `Week ${i + 1}`,
  'TXELP01': Math.floor(Math.random() * 100) + 1, // Generate random integer between 1 and 100
  'TXELP02': Math.floor(Math.random() * 100) + 1,
}));


// At the top of the file, add these types
type OfficeColorKey = keyof typeof OFFICE_COLORS;
type CodeColorKey = keyof typeof CODE_COLORS;

// Sample data structure
interface TableData {
  year: number;
  office: string;
  weeks: number[];
  grandTotal: number;
}

const CompletionsPerTeams: React.FC = () => {
  const [selectedOffice, setSelectedOffice] = useState<string>('All');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Week/Year');

  // Sample data for charts
  const stackedBarData = Array.from({ length: 52 }, (_, i) => ({
    week: `Week ${i + 1}`,
    'Tucson': Math.random() * 500,
    'Colorado': Math.random() * 300,
    'Albuquerque/El Paso': Math.random() * 400
  }));

  const lineChartData = Array.from({ length: 52 }, (_, i) => ({
    week: `Week ${i + 1}`,
    'AZPECO1': Math.random() * 800,
    'AZTUC01': Math.random() * 300,
    'AZTEM01': Math.random() * 400
  }));


  // Real data for the count table
  const countTableData = [
    {
      key: '1',
      year: 2024,
      team: 'AZTUC01', // Replace 'office' with 'team'
      weeks: [49, 60, 65, 72, 65, 68, 87],
      grandTotal: 2692,
    },
    {
      key: '2',
      year: 2024,
      team: 'AZTUC02', // Replace 'office' with 'team'
      weeks: [17, 17, 18, 17, 20, 20, 33],
      grandTotal: 1003,
    },
    {
      key: '3',
      year: 2024,
      team: 'AZTEM03', // Replace 'office' with 'team'
      weeks: [3, 7, 8, 9, 6, 14, 14],
      grandTotal: 977,
    },
    {
      key: '4',
      year: 2024,
      team: 'AZTEM04', // Replace 'office' with 'team'
      weeks: [25, 24, 33, 28, 24, 11, 11],
      grandTotal: 822,
    },
    {
      key: '5',
      year: 2024,
      team: 'AZPEO01', // Replace 'office' with 'team'
      weeks: [0, 0, 0, 0, 0, 0, 0],
      grandTotal: 592,
    },
    {
      key: '6',
      year: 2024,
      team: 'AZPEO02', // Replace 'office' with 'team'
      weeks: [5, 6, 6, 1, 4, 5, 5],
      grandTotal: 391,
    },
    {
      key: '7',
      year: 2024,
      team: 'AZTEM06', // Replace 'office' with 'team'
      weeks: [0, 0, 0, 0, 0, 0, 0],
      grandTotal: 49,
    },
    {
      key: '8',
      year: 2024,
      team: 'AZTEM08', // Replace 'office' with 'team'
      weeks: [0, 0, 0, 0, 0, 0, 0],
      grandTotal: 0,
    },
  ];

  // Real data for the system size table
// Real data for the system size table
const systemSizeTableData = [
  {
    key: '1',
    year: 2024,
    team: '#N/A', // Replace 'office' with 'team'
    weeks: [0, 0, 0, 0, 0, 0, 0],
    grandTotal: 303.22,
  },
  {
    key: '2',
    year: 2024,
    team: 'AZTEM04', // Replace 'office' with 'team'
    weeks: [187.64, 153.8, 219.41, 190.99, 186.14, 86.49, 71.54],
    grandTotal: 5470.56,
  },
  {
    key: '3',
    year: 2024,
    team: 'AZTEM03', // Replace 'office' with 'team'
    weeks: [23.81, 39.37, 50.4, 58.49, 47.7, 84.1, 83.46],
    grandTotal: 6333.3,
  },
  {
    key: '4',
    year: 2024,
    team: 'AZTUC01', // Replace 'office' with 'team'
    weeks: [451.79, 582.79, 632.15, 723.54, 608.52, 649.68, 834.18],
    grandTotal: 25391.63,
  },
  {
    key: '5',
    year: 2024,
    team: 'AZPEO01', // Replace 'office' with 'team'
    weeks: [0, 0, 0, 0, 0, 0, 0],
    grandTotal: 5327,
  },
  {
    key: '6',
    year: 2024,
    team: 'AZPEO02', // Replace 'office' with 'team'
    weeks: [55.68, 67.13, 58.62, 8.5, 45.75, 50.62, 55.1],
    grandTotal: 3861.47,
  },
  {
    key: '7',
    year: 2024,
    team: 'AZTUC02', // Replace 'office' with 'team'
    weeks: [171.26, 136.27, 185.63, 152.71, 190.45, 174.13, 267.78],
    grandTotal: 8859.71,
  },
];

  // Calculate average system size data
  const averageSizeTableData = systemSizeTableData.map(sizeRow => {
    // Find matching count row
    const countRow = countTableData.find(count => count.team === sizeRow.team);

    return {
      key: sizeRow.key,
      year: sizeRow.year,
      team: sizeRow.team,
      weeks: sizeRow.weeks.map((size, index) => {
        const count = countRow?.weeks[index] || 0;
        return count === 0 ? 0 : size / count;
      }),
      grandTotal: (!countRow || countRow.grandTotal === 0) ? 0 : sizeRow.grandTotal / countRow.grandTotal
    };
  });

  // Column configuration for average system size
  const averageSizeColumns = [
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Related Team', dataIndex: 'team', key: 'team' }, // Change 'Office' to 'Related Team'
    ...Array.from({ length: 7 }, (_, i) => ({
      title: `Week ${i + 1}`,
      dataIndex: 'weeks',
      key: `week${i}`,
      render: (weeks: any) => weeks[i]?.toFixed(2) || '-'
    })),
    {
      title: 'Grand Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      render: (value: any) => <span className="font-bold">{value.toFixed(2)}</span>
    }
  ];

  const countColumns = [
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Related Team', dataIndex: 'team', key: 'team' }, // Change 'Office' to 'Related Team'
    ...Array.from({ length: 7 }, (_, i) => ({
      title: `Week ${i + 1}`,
      dataIndex: 'weeks',
      key: `week${i}`,
      render: (weeks: any) => weeks[i],
    })),
    {
      title: 'Grand Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      render: (value: any) => <span className="font-bold">{value.toLocaleString()}</span>,
    },
  ];
  // Column configurations for the system size table
  const systemSizeColumns = [
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Related Team', dataIndex: 'team', key: 'team' }, // Change 'Office' to 'Related Team'
    ...Array.from({ length: 7 }, (_, i) => ({
      title: `Week ${i + 1}`,
      dataIndex: 'weeks',
      key: `week${i}`,
      render: (weeks: any) => weeks[i]?.toFixed(2) || '0.00'
    })),
    {
      title: 'Grand Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      render: (value: any) => <span className="font-bold">{value.toFixed(2)}</span>
    }
  ];

  return (
    <div className="bg-white p2">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">PV Install Completions (Team)</h3>
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

      <div className="bg-white rounded-lg shadow p2">
        <h3 className="text-lg font-semibold mb-4">Installs Completed per Office by Count</h3>
        <div className="flex justify-end h5 bold pr3" style={{ background: "#f0f4c3" }} title="Week / Customer">Week / Customer</div>
        <Table
          columns={countColumns}
          dataSource={countTableData}
          pagination={false}
          className="install-table"
        />
      </div>

      <div className="bg-white rounded-lg shadow p2">
        <h3 className="text-lg font-semibold mb-4">Installs Completed per Office by System Size</h3>
        <div className="flex justify-end h5 bold pr3" style={{ background: "#b2ebf2" }} title="Week / Customer">Week / System Size </div>
        <Table
          columns={systemSizeColumns}
          dataSource={systemSizeTableData}
          pagination={false}
          className="install-table"
        />
      </div>

      <div className="bg-white rounded-lg shadow p2">
        <h3 className="text-lg font-semibold mb-4">Installs Completed per Office by System Size (Average kW)</h3>
        <div className="flex justify-end h5 bold pr3" style={{ background: "#f0f4c3" }} title="Week / Customer">Week / Customer</div>
        <Table
          columns={averageSizeColumns}
          dataSource={averageSizeTableData}
          pagination={false}
          className="install-table"
        />
      </div>

      {/* AZPEO Chart */}
      <div className="bg-white rounded-lg shadow p2 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Installs Completed per Team by System Size (Average kW) - AZPEO
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={azpeoData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 150]} />
            <Tooltip />
            <Legend />
            {Object.keys(AZPEO_COLORS).map((team) => (
              <Bar
                key={team}
                dataKey={team}
                stackId="a"
                fill={AZPEO_COLORS[team as keyof typeof AZPEO_COLORS]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AZTEM Chart */}
      <div className="bg-white rounded-lg shadow p2 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Installs Completed per Team by System Size (Average kW) - AZTEM
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={aztemData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 125]} />
            <Tooltip />
            <Legend />
            {Object.keys(AZTEM_COLORS).map((team) => (
              <Bar
                key={team}
                dataKey={team}
                stackId="a"
                fill={AZTEM_COLORS[team as keyof typeof AZTEM_COLORS]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AZTUC Chart */}
      <div className="bg-white rounded-lg shadow p2 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Installs Completed per Team by System Size (Average kW) - AZTUC
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={aztucData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 50]} />
            <Tooltip />
            <Legend />
            {Object.keys(AZTUC_COLORS).map((team) => (
              <Bar
                key={team}
                dataKey={team}
                stackId="a"
                fill={AZTUC_COLORS[team as keyof typeof AZTUC_COLORS]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* CODEN Chart */}
      <div className="bg-white rounded-lg shadow p2 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Installs Completed per Team by System Size (Average kW) - CODEN
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={codenData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 'dataMax + 10']} /> {/* Dynamic Y-axis domain */}
            <Tooltip />
            <Legend />
            {Object.keys(CODEN_COLORS).map((team) => (
              <Bar
                key={team}
                dataKey={team}
                stackId="a"
                fill={CODEN_COLORS[team as keyof typeof CODEN_COLORS]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* COGJT Chart */}
      <div className="bg-white rounded-lg shadow p2"> {/* Removed mb-6 from the last chart */}
        <h3 className="text-lg font-semibold mb-4">
          Installs Completed per Team by System Size (Average kW) - COGJT
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={cogjtData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 'dataMax + 10']} /> {/* Dynamic Y-axis domain */}
            <Tooltip />
            <Legend />
            {Object.keys(COGJT_COLORS).map((team) => (
              <Bar
                key={team}
                dataKey={team}
                stackId="a"
                fill={COGJT_COLORS[team as keyof typeof COGJT_COLORS]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* nmabq Chart */}
      <div className="bg-white rounded-lg shadow p2"> {/* Removed mb-6 from the last chart */}
        <h3 className="text-lg font-semibold mb-4">
          Installs Completed per Team by System Size (Average kW) - NMABQ
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={nmabqData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 'dataMax + 10']} /> {/* Dynamic Y-axis domain */}
            <Tooltip />
            <Legend />
            {Object.keys(NMABQ_COLORS).map((team) => (
              <Bar
                key={team}
                dataKey={team}
                stackId="a"
                fill={NMABQ_COLORS[team as keyof typeof NMABQ_COLORS]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p2"> {/* Removed mb-6 from the last chart */}
        <h3 className="text-lg font-semibold mb-4">
          Installs Completed per Team by System Size (Average kW) - TXDAL, TXSAN
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={txdalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 'dataMax + 10']} /> {/* Dynamic Y-axis domain */}
            <Tooltip />
            <Legend />
            {Object.keys(TXDAL_COLORS).map((team) => (
              <Bar
                key={team}
                dataKey={team}
                stackId="a"
                fill={TXDAL_COLORS[team as keyof typeof TXDAL_COLORS]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p2"> {/* Removed mb-6 from the last chart */}
        <h3 className="text-lg font-semibold mb-4">
          Installs Completed per Team by System Size (Average kW) - TXELP
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={txelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 'dataMax + 10']} /> {/* Dynamic Y-axis domain */}
            <Tooltip />
            <Legend />
            {Object.keys(TXELP_COLORS).map((team) => (
              <Bar
                key={team}
                dataKey={team}
                stackId="a"
                fill={TXELP_COLORS[team as keyof typeof TXELP_COLORS]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CompletionsPerTeams;
