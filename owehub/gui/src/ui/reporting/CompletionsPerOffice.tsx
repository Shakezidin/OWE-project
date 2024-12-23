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
    'Albuquerque/El Paso': Math.random() * 400
  }));

  const lineChartData = Array.from({ length: 52 }, (_, i) => ({
    week: `Week ${i + 1}`,
    'AZPECO1': Math.random() * 800,
    'AZTUC01': Math.random() * 300,
    'AZTEM01': Math.random() * 400
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">PV Install Completions (Office)</h2>
        </div>
        <div className="flex gap-4">
          <Select
            value={selectedOffice}
            onChange={setSelectedOffice}
            style={{ width: 200 }}
            options={[
              { value: 'All', label: 'All Offices' },
              ...Object.keys(OFFICE_COLORS).map(office => ({
                value: office,
                label: office
              }))
            ]}
          />
          <Select
            value={selectedTeam}
            onChange={setSelectedTeam}
            style={{ width: 200 }}
            options={[
              { value: 'All', label: 'All Teams' }
            ]}
          />
          <Select
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            style={{ width: 200 }}
            options={[
              { value: 'Week/Year', label: 'Week/Year' },
              { value: 'Month/Year', label: 'Month/Year' },
              { value: 'Quarter/Year', label: 'Quarter/Year' }
            ]}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <Table 
          dataSource={tableData} 
          columns={columns}
          pagination={false}
          className="install-table"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
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

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Install Completion Trends by Office Code</h3>
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
