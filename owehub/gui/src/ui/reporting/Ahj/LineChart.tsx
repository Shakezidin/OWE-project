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
  { name: '01-2024', 'OUTOF SLA': 398, 'WITHIN SLA': 450 },
  { name: '02-2024', 'OUTOF SLA': 400, 'WITHIN SLA': 470 },
  { name: '03-2024', 'OUTOF SLA': 380, 'WITHIN SLA': 490 },
  { name: '04-2024', 'OUTOF SLA': 1, 'WITHIN SLA': 1 },
  { name: '05-2024', 'OUTOF SLA': 450, 'WITHIN SLA': 400 },
  { name: '06-2024', 'OUTOF SLA': 70, 'WITHIN SLA': 100 },
  { name: '07-2024', 'OUTOF SLA': 200, 'WITHIN SLA': 250 },
  { name: '08-2024', 'OUTOF SLA': 120, 'WITHIN SLA': 350 },
  { name: '09-2024', 'OUTOF SLA': 350, 'WITHIN SLA': 150 },
  { name: '10-2024', 'OUTOF SLA': 100, 'WITHIN SLA': 400 },
  { name: '11-2024', 'OUTOF SLA': 300, 'WITHIN SLA': 200 },
  { name: '12-2024', 'OUTOF SLA': 150, 'WITHIN SLA': 350 },
  { name: '01-2025', 'OUTOF SLA': 400, 'WITHIN SLA': 350 },
  { name: '02-2025', 'OUTOF SLA': 250, 'WITHIN SLA': 470 },
  { name: '03-2025', 'OUTOF SLA': 400, 'WITHIN SLA': 450 },
  { name: '04-2025', 'OUTOF SLA': 10, 'WITHIN SLA': 5 },
  { name: '05-2025', 'OUTOF SLA': 350, 'WITHIN SLA': 150 },
  { name: '06-2025', 'OUTOF SLA': 80, 'WITHIN SLA': 120 },
  { name: '07-2025', 'OUTOF SLA': 300, 'WITHIN SLA': 200 },
  { name: '08-2025', 'OUTOF SLA': 150, 'WITHIN SLA': 350 },
  { name: '09-2025', 'OUTOF SLA': 250, 'WITHIN SLA': 200 },
  { name: '10-2025', 'OUTOF SLA': 200, 'WITHIN SLA': 300 },
  { name: '11-2025', 'OUTOF SLA': 350, 'WITHIN SLA': 150 },
  { name: '12-2025', 'OUTOF SLA': 300, 'WITHIN SLA': 200 },
  { name: '01-2026', 'OUTOF SLA': 400, 'WITHIN SLA': 300 },
  { name: '02-2026', 'OUTOF SLA': 150, 'WITHIN SLA': 450 },
  { name: '03-2026', 'OUTOF SLA': 100, 'WITHIN SLA': 400 },
  { name: '04-2026', 'OUTOF SLA': 15, 'WITHIN SLA': 10 },
  { name: '05-2026', 'OUTOF SLA': 350, 'WITHIN SLA': 150 },
  { name: '06-2026', 'OUTOF SLA': 40, 'WITHIN SLA': 100 },
  { name: '07-2026', 'OUTOF SLA': 200, 'WITHIN SLA': 250 },
  { name: '08-2026', 'OUTOF SLA': 100, 'WITHIN SLA': 350 },
  { name: '09-2026', 'OUTOF SLA': 250, 'WITHIN SLA': 200 },
  { name: '10-2026', 'OUTOF SLA': 180, 'WITHIN SLA': 300 },
  { name: '11-2026', 'OUTOF SLA': 150, 'WITHIN SLA': 350 },
  { name: '12-2026', 'OUTOF SLA': 200, 'WITHIN SLA': 300 },
  { name: '01-2027', 'OUTOF SLA': 400, 'WITHIN SLA': 300 },
  { name: '02-2027', 'OUTOF SLA': 100, 'WITHIN SLA': 400 },
  { name: '03-2027', 'OUTOF SLA': 250, 'WITHIN SLA': 200 },
  { name: '04-2027', 'OUTOF SLA': 5, 'WITHIN SLA': 3 },
  { name: '05-2027', 'OUTOF SLA': 350, 'WITHIN SLA': 150 },
  { name: '06-2027', 'OUTOF SLA': 50, 'WITHIN SLA': 120 },
  { name: '07-2027', 'OUTOF SLA': 300, 'WITHIN SLA': 150 },
  { name: '08-2027', 'OUTOF SLA': 200, 'WITHIN SLA': 250 },
  { name: '09-2027', 'OUTOF SLA': 150, 'WITHIN SLA': 300 },
  { name: '10-2027', 'OUTOF SLA': 100, 'WITHIN SLA': 400 },
  { name: '11-2027', 'OUTOF SLA': 350, 'WITHIN SLA': 150 },
  { name: '12-2027', 'OUTOF SLA': 200, 'WITHIN SLA': 250 },
  { name: '01-2028', 'OUTOF SLA': 400, 'WITHIN SLA': 300 },
  { name: '02-2028', 'OUTOF SLA': 150, 'WITHIN SLA': 450 },
  { name: '03-2028', 'OUTOF SLA': 250, 'WITHIN SLA': 200 },
  { name: '04-2028', 'OUTOF SLA': 20, 'WITHIN SLA': 15 },
  { name: '05-2028', 'OUTOF SLA': 350, 'WITHIN SLA': 150 },
  { name: '06-2028', 'OUTOF SLA': 70, 'WITHIN SLA': 100 },
  { name: '07-2028', 'OUTOF SLA': 250, 'WITHIN SLA': 200 },
  { name: '08-2028', 'OUTOF SLA': 100, 'WITHIN SLA': 350 },
  { name: '09-2028', 'OUTOF SLA': 250, 'WITHIN SLA': 200 },
  { name: '10-2028', 'OUTOF SLA': 150, 'WITHIN SLA': 350 },
  { name: '11-2028', 'OUTOF SLA': 200, 'WITHIN SLA': 300 },
  { name: '12-2028', 'OUTOF SLA': 300, 'WITHIN SLA': 200 },
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

  const tooltipStyle = {
    fontSize: '10px',
    padding: '6px',
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
          wrapperStyle={{ paddingBottom: 20, fontSize: 12 }}
          iconSize={12}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          tickSize={8}
          dataKey="name"
          tick={{ fontSize: 8, fontWeight: 500, fill: '#818181' }}
          angle={-45}
          dy={10}
        />
        <YAxis
          tickSize={10}
          tick={{ fontSize: 10, fontWeight: 500, fill: '#818181' }}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          wrapperStyle={{
            outline: 'none',
            borderRadius: 4,
            padding: 8,
            boxShadow: 'none',
            fontSize: 10,
          }}
          formatter={(value) => `${value}%`}
          content={<CustomTooltip />}
        />
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
