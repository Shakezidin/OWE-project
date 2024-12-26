import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  Legend,
} from 'recharts';

interface DataPoint {
  name: string;
  'OUTOF SLA': number;
  'WITHIN SLA': number;
}
interface GraphData {
  data: DataPoint[];
  lineColor: string;
}

const data: DataPoint[] = [
  {
    name: '01-2024',
    'OUTOF SLA': 1398,
    'WITHIN SLA': 9800,
  },
  {
    name: '04-2024',
    'OUTOF SLA': 1,
    'WITHIN SLA': 1,
  },
  {
    name: '05-2024',
    'OUTOF SLA': 1400,
    'WITHIN SLA': 900,
  },
  {
    name: '06-2024',
    'OUTOF SLA': 70,
    'WITHIN SLA': 100,
  },
  {
    name: '07-2024',
    'OUTOF SLA': 900,
    'WITHIN SLA': 1100,
  },
];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div>
        <p className="label">{`OUTOF SLA: ${data['OUTOF SLA']}`}</p>
        <p className="label">{`WITHIN SLA: ${data['WITHIN SLA']}`}</p>
      </div>
    );
  }

  return null;
};

const BelowUpChartAhj: React.FC = () => {
  const graph: GraphData = {
    data: data,
    lineColor: '#ff7300', // Specify the desired color for the line
  };

  return (
    <ResponsiveContainer
      width="95%"
      height="100%"
      className={'graph-container'}
    >
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        <Legend
          verticalAlign="top"
          wrapperStyle={{ paddingBottom: 20, fontSize: 10 }}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          tickSize={10}
          dataKey="name"
          tick={{ fontSize: 10, fontWeight: 500, fill: '#818181' }}
        />
        <YAxis
          tickSize={10}
          tick={{ fontSize: 10, fontWeight: 500, fill: '#818181' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="OUTOF SLA"
          stroke="#f10000"
          strokeWidth={2}
          dot={{ r: 3, fill: '#f10000' }}
          activeDot={{ r: 4, fill: '#f10000' }}
        />
        <Line
          type="monotone"
          dataKey="WITHIN SLA"
          stroke="#7cb342"
          strokeWidth={2}
          dot={{ r: 3, fill: '#7cb342' }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BelowUpChartAhj;
