import React, { useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import './linechart.css';

interface LineGraphProps {
  data: { name: string; [key: string]: number | string }[];
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {
  useEffect(() => {
    console.log('LineGraph Data:', data);
  }, [data]);

  if (!data || data.length === 0) {
    return <div>No data available to display</div>;
  }

  const normalizeKey = (key: string) => key.replace(/[^a-zA-Z0-9]/g, '_');
  const normalizedData = data.map((item) => {
    const newItem: Record<string, any> = {};
    Object.keys(item).forEach((key) => {
      newItem[normalizeKey(key)] = item[key];
    });
    return newItem;
  });

  const lineKeys = Object.keys(normalizedData[0]).filter((key) => key !== 'name');
  console.log('Normalized Data:', normalizedData);
  console.log('Line Keys:', lineKeys);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <div className="graph-container" style={{ height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={normalizedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {lineKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;