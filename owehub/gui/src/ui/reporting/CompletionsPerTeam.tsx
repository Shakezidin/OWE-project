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
  'AZPEO01': Math.random() * 15 + 5,
  'AZPEO02': Math.random() * 15 + 5,
  'AZPEO03': Math.random() * 15 + 5,
  'AZPEO04': Math.random() * 15 + 5,
  'AZPEO05': Math.random() * 15 + 5,
  'AZPEO06': Math.random() * 15 + 5,
  'AZPEO07': Math.random() * 15 + 5,
  'AZPEO08': Math.random() * 15 + 5,
  'AZPEO09': Math.random() * 15 + 5,
  'AZPEO10': Math.random() * 15 + 5,
  'AZPEO11': Math.random() * 15 + 5,
  'AZPEO12': Math.random() * 15 + 5,
  'AZPEO13': Math.random() * 15 + 5,
  'AZPEO14': Math.random() * 15 + 5,
  'AZPEO15': Math.random() * 15 + 5
}));

// Generate sample data for AZTEM chart (weeks 1-52)
const aztemData = Array.from({ length: 52 }, (_, i) => ({
  week: `Week ${i + 1}`,
  'AZTEM01': Math.random() * 15 + 10,
  'AZTEM02': Math.random() * 15 + 10,
  'AZTEM03': Math.random() * 15 + 10,
  'AZTEM04': Math.random() * 15 + 10,
  'AZTEM05': Math.random() * 15 + 10,
  'AZTEM06': Math.random() * 15 + 10,
  'AZTEM07': Math.random() * 15 + 10,
  'AZTEM08': Math.random() * 15 + 10,
  'AZTEM09': Math.random() * 15 + 10,
  'AZTEM10': Math.random() * 15 + 10
}));

// Generate sample data for AZTUC chart (weeks 1-52)
const aztucData = Array.from({ length: 52 }, (_, i) => ({
  week: `Week ${i + 1}`,
  'AZTUC01': Math.random() * 10 + 5,
  'AZTUC02': Math.random() * 10 + 5,
  'AZTUC03': Math.random() * 10 + 5,
  'AZTUC04': Math.random() * 10 + 5,
  'AZTUC05': Math.random() * 10 + 5
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
  CODENON: Math.random() * 15 + 5, // Values between 5 and 20
  CODENOT: Math.random() * 12 + 3, // Values between 3 and 15 - Adjusted range
  CODENG: Math.random() * 10 + 2,   // Values between 2 and 12 - Adjusted range
  CODENST: Math.random() * 8 + 1,    // Values between 1 and 9 - Adjusted range
  CODENOS: Math.random() * 5 + 1,
  CODENDR: Math.random() * 8 + 1,
  CODENDL: Math.random() * 10 + 2,
  CODENGS: Math.random() * 12 + 3,
  CODENDS: Math.random() * 15 + 5,
  CODENDE: Math.random() * 5 + 1
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
  COGITOT: Math.random() * 10 + 2,   // Values between 2 and 12
  COGITO1: Math.random() * 8 + 1,    // Values between 1 and 9
  ODGJTEI: Math.random() * 12 + 3,
  COGITOZ: Math.random() * 15 + 5,
  COGITOO: Math.random() * 5 + 1,
  COGITOR: Math.random() * 8 + 1,
  NMARGOT: Math.random() * 10 + 2
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

const nmabqData = Array.from({ length: 52 }, (_, i) => ({
  week: `Week ${i + 1}`,
  'NMABQ01': Math.random() * 15 + 5,
  'NMABQ02': Math.random() * 15 + 5,
  'NMABQ03': Math.random() * 15 + 5,
  'NMABQ04': Math.random() * 15 + 5,
  'NMABQ05': Math.random() * 15 + 5,
  'NMABQ06': Math.random() * 15 + 5,
  'NMABQ07': Math.random() * 15 + 5,
  'NMABQ08': Math.random() * 15 + 5,
  'NMABQ09': Math.random() * 15 + 5,
  'NMABQ10': Math.random() * 15 + 5
}));

const txdalData = Array.from({ length: 52 }, (_, i) => ({
  week: `Week ${i + 1}`,
  'TXDAL01': Math.random() * 20 + 10,
  'TXDAL02': Math.random() * 20 + 10,
  'TXDAL03': Math.random() * 20 + 10,
  'TXDAL04': Math.random() * 20 + 10
}));

const txelData = Array.from({ length: 52 }, (_, i) => ({
  week: `Week ${i + 1}`,
  'TXELP01': Math.random() * 10 + 2,
  'TXELP02': Math.random() * 10 + 2
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
      office: 'Peoria/Kingman',
      weeks: [49, 60, 65, 72, 65, 68, 87],
      grandTotal: 2692
    },
    {
      key: '2',
      year: 2024,
      office: 'Tucson',
      weeks: [17, 17, 18, 17, 20, 20, 33],
      grandTotal: 1003
    },
    {
      key: '3',
      year: 2024,
      office: 'Colorado',
      weeks: [3, 7, 8, 9, 6, 14, 14],
      grandTotal: 977
    },
    {
      key: '4',
      year: 2024,
      office: 'Albuquerque/El Paso',
      weeks: [25, 24, 33, 28, 24, 11, 11],
      grandTotal: 822
    },
    {
      key: '5',
      year: 2024,
      office: 'Tempe',
      weeks: [0, 0, 0, 0, 0, 0, 0],
      grandTotal: 592
    },
    {
      key: '6',
      year: 2024,
      office: 'Texas',
      weeks: [5, 6, 6, 1, 4, 5, 5],
      grandTotal: 391
    },
    {
      key: '7',
      year: 2024,
      office: '#N/A',
      weeks: [0, 0, 0, 0, 0, 0, 0],
      grandTotal: 49
    },
    {
      key: '8',
      year: 2024,
      office: 'null',
      weeks: [0, 0, 0, 0, 0, 0, 0],
      grandTotal: 0
    }
  ];

  // Real data for the system size table
  const systemSizeTableData = [
    {
      key: '1',
      year: 2024,
      office: '#N/A',
      weeks: [0, 0, 0, 0, 0, 0, 0],
      grandTotal: 303.22
    },
    {
      key: '2',
      year: 2024,
      office: 'Albuquerque/El Paso',
      weeks: [187.64, 153.8, 219.41, 190.99, 186.14, 86.49, 71.54],
      grandTotal: 5470.56
    },
    {
      key: '3',
      year: 2024,
      office: 'Colorado',
      weeks: [23.81, 39.37, 50.4, 58.49, 47.7, 84.1, 83.46],
      grandTotal: 6333.3
    },
    {
      key: '4',
      year: 2024,
      office: 'Peoria/Kingman',
      weeks: [451.79, 582.79, 632.15, 723.54, 608.52, 649.68, 834.18],
      grandTotal: 25391.63
    },
    {
      key: '5',
      year: 2024,
      office: 'Tempe',
      weeks: [0, 0, 0, 0, 0, 0, 0],
      grandTotal: 5327
    },
    {
      key: '6',
      year: 2024,
      office: 'Texas',
      weeks: [55.68, 67.13, 58.62, 8.5, 45.75, 50.62, 55.1],
      grandTotal: 3861.47
    },
    {
      key: '7',
      year: 2024,
      office: 'Tucson',
      weeks: [171.26, 136.27, 185.63, 152.71, 190.45, 174.13, 267.78],
      grandTotal: 8859.71
    }
  ];

  // Calculate average system size data
  const averageSizeTableData = systemSizeTableData.map(sizeRow => {
    // Find matching count row
    const countRow = countTableData.find(count => count.office === sizeRow.office);

    return {
      key: sizeRow.key,
      year: sizeRow.year,
      office: sizeRow.office,
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
    { title: 'Office', dataIndex: 'office', key: 'office' },
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

  // Column configurations for the count table
  const countColumns = [
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Office', dataIndex: 'office', key: 'office' },
    ...Array.from({ length: 7 }, (_, i) => ({
      title: `Week ${i + 1}`,
      dataIndex: 'weeks',
      key: `week${i}`,
      render: (weeks: any) => weeks[i]
    })),
    {
      title: 'Grand Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      render: (value: any) => <span className="font-bold">{value.toLocaleString()}</span>
    }
  ];

  // Column configurations for the system size table
  const systemSizeColumns = [
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Office', dataIndex: 'office', key: 'office' },
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
        <Table
          columns={countColumns}
          dataSource={countTableData}
          pagination={false}
          className="install-table"
        />
      </div>

      <div className="bg-white rounded-lg shadow p2">
        <h3 className="text-lg font-semibold mb-4">Installs Completed per Office by System Size</h3>
        <Table
          columns={systemSizeColumns}
          dataSource={systemSizeTableData}
          pagination={false}
          className="install-table"
        />
      </div>

      <div className="bg-white rounded-lg shadow p2">
        <h3 className="text-lg font-semibold mb-4">Installs Completed per Office by System Size (Average kW)</h3>
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
