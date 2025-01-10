import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ApiData = {
  index: number;
  value: {
    'Within SLA'?: number;
    'Out of SLA'?: number;
  };
};

type ApiResponse = ApiData[];

interface AhjBarChartProps {
  data: ApiResponse;
}

const AhjBarChart: React.FC<AhjBarChartProps> = ({ data }) => {
  console.log(data, 'Please send null when payload is empty, as others api');
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data
          .filter((item) => Object.keys(item.value).length > 0)
          .map((item, index) => ({
            name: item.index.toString(),
            'Within SLA (%)': item.value['Within SLA'] || 0,
            'Out of SLA (%)': item.value['Out of SLA'] || 0,
          }))}
        margin={{ top: 22, right: 30, left: 0, bottom: 6 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          tickSize={8}
          interval={0}
          angle={-45}
          dy={10}
          dx={-10}
          dataKey="name"
          tick={{ fontSize: 8, fontWeight: 500, fill: '#818181' }}
          tickFormatter={(value) => {
            const weekNumber = parseInt(value, 10);
            return `Week ${weekNumber}`;
          }}
        />
        <YAxis
          tickSize={10}
          tick={{ fontSize: 10, fontWeight: 500, fill: '#818181' }}
          tickFormatter={(value) => `${value}%`}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{ fontSize: '12px' }}
          wrapperStyle={{
            outline: 'none',
            borderRadius: 4,
            padding: 4,
            boxShadow: 'none',
          }}
          labelFormatter={(value) => `Week ${Number(value)}`}
          formatter={(value) => `${value}%`}
        />

        <Legend
          align="center"
          layout="horizontal"
          verticalAlign="top"
          wrapperStyle={{
            fontSize: 12,
            marginTop: -18,
          }}
          iconSize={12}
        />
        <Bar dataKey="Within SLA (%)" stackId="a" fill="#81C784" />
        <Bar dataKey="Out of SLA (%)" stackId="a" fill="#E64A19" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AhjBarChart;
