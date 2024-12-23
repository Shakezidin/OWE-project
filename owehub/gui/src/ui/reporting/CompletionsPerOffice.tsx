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
  'AZKING01': '#00CED1',
  'COGJ1': '#4682B4',      
  'TXELP01': '#F9C0D6',    
  'null': '#F9B7B0',       
  'TXAU01': '#C0C0C0',     
  'TXSAN01': '#F08080',    
  'TXHOU01': '#D3F5D3',    
  'NoOffice': '#B0C4DE'    
};

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

const CompletionsPerOffice: React.FC = () => {
  const [selectedOffice, setSelectedOffice] = useState<string>('All');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Week/Year');

  // Sample data
  const tableData: TableData[] = [
    {
      year: 2024,
      office: 'Tucson',
      weeks: [17, 17, 18, 17, 20, 20, 33],
      grandTotal: 1003
    },
    // Add more data as needed
  ];

  // Table columns configuration
  const columns = [
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Office', dataIndex: 'office', key: 'office' },
    ...Array.from({ length: 7 }, (_, i) => ({
      title: `Week ${i + 1}`,
      dataIndex: 'weeks',
      key: `week${i}`,
      render: (weeks: number[]) => weeks[i]
    })),
    {
      title: 'Grand Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      className: 'font-bold'
    }
  ];

  // Sample data for charts
  const stackedBarData = Array.from({ length: 52 }, (_, i) => ({
    week: `Week ${i + 1}`,
    'Tucson': Math.random() * 500,
    'Colorado': Math.random() * 300,
    'Albuquerque/El Paso': Math.random() * 400,
    'Texas': Math.random() * 400,
    'Tempe': Math.random() * 400,
    'Peoria/Kingman': Math.random() * 400,
    '#N/A': Math.random() * 400,
    // 'null': Math.random() * 400,
  }));

  const lineChartData = Array.from({ length: 52 }, (_, i) => ({
    week: `Week ${i + 1}`,
    'AZPECO1': parseFloat((Math.random() * 7).toFixed(2)),
    'AZTUC01': parseFloat((Math.random() * 1).toFixed(2)),
    'AZTEM01': parseFloat((Math.random() * 1.1).toFixed(2)),
    'CODEN1': parseFloat((Math.random() * 1.2).toFixed(2)),
    'NMABQ01': parseFloat((Math.random() * 1.3).toFixed(2)),
    'TXDAL01': parseFloat((Math.random() * 1.5).toFixed(2)),
    'AZKING01': parseFloat((Math.random() * 1).toFixed(2)),
    'COGJ1': parseFloat((Math.random() * 1.5).toFixed(2)),
    'TXELP01': parseFloat((Math.random() * 1.9).toFixed(2)),
    'null': parseFloat((Math.random() * 1.6).toFixed(2)),
    'TXAU01': parseFloat((Math.random() * 1.8).toFixed(2)),
    'TXSAN01': parseFloat((Math.random() * 1).toFixed(2)),
    'TXHOU01': parseFloat((Math.random() * 1.2).toFixed(2)),
    'NoOffice': parseFloat((Math.random() * 1.5).toFixed(2))
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
          <h3 className="text-xl font-semibold">PV Install Completions (Office)</h3>
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
          sticky={false}
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
        <div className="flex justify-end h5 bold pr3" style={{ background: "#f0f4c3" }} title="Week / Customer">Week / System Size </div>
        <Table
          columns={averageSizeColumns}
          dataSource={averageSizeTableData}
          pagination={false}
          className="install-table"
        />
      </div>

      <div className="bg-white rounded-lg shadow p2 mb-6">
        <h3 className="text-lg font-semibold mb-4">Installs Completed per Office by System Size</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stackedBarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(OFFICE_COLORS).map((office) => (
              <Bar
                key={office}
                dataKey={office}
                stackId="a"
                fill={OFFICE_COLORS[office as OfficeColorKey]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p2">
        {/* <h3 className="text-lg font-semibold mb-4">Install Completion Trends by Office Code</h3> */}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(CODE_COLORS).map((code) => (
              <Line
                key={code}
                type="monotone"
                dataKey={code}
                stroke={CODE_COLORS[code as CodeColorKey]}
                strokeWidth={3}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CompletionsPerOffice;
