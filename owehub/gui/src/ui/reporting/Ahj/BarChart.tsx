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
  LabelList,
  TooltipProps,
} from 'recharts';

type Data = {
  name: string;
  'Within SLA (%)': number;
};

const data = [
  {
    name: 'Week 1',
    'Within SLA (%)': 20,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 2',
    'Within SLA (%)': 10,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 3',
    'Within SLA (%)': 21,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 4',
    'Within SLA (%)': 1,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 5',
    'Within SLA (%)': 2,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 6',
    'Within SLA (%)': 20,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 7',
    'Within SLA (%)': 90,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 8',
    'Within SLA (%)': 60,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 9',
    'Within SLA (%)': 20,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 10',
    'Within SLA (%)': 10,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 11',
    'Within SLA (%)': 21,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 12',
    'Within SLA (%)': 1,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 13',
    'Within SLA (%)': 2,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 14',
    'Within SLA (%)': 20,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 15',
    'Within SLA (%)': 90,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 16',
    'Within SLA (%)': 60,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 17',
    'Within SLA (%)': 20,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 18',
    'Within SLA (%)': 10,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 19',
    'Within SLA (%)': 21,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 20',
    'Within SLA (%)': 1,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 21',
    'Within SLA (%)': 2,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 22',
    'Within SLA (%)': 20,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 23',
    'Within SLA (%)': 90,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 24',
    'Within SLA (%)': 60,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 25',
    'Within SLA (%)': 20,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 26',
    'Within SLA (%)': 10,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 27',
    'Within SLA (%)': 21,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 28',
    'Within SLA (%)': 1,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 29',
    'Within SLA (%)': 2,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 30',
    'Within SLA (%)': 20,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 31',
    'Within SLA (%)': 90,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 32',
    'Within SLA (%)': 60,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 33',
    'Within SLA (%)': 20,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 34',
    'Within SLA (%)': 10,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 35',
    'Within SLA (%)': 21,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 36',
    'Within SLA (%)': 1,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 37',
    'Within SLA (%)': 2,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 38',
    'Within SLA (%)': 20,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 39',
    'Within SLA (%)': 90,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 40',
    'Within SLA (%)': 60,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 41',
    'Within SLA (%)': 20,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 42',
    'Within SLA (%)': 10,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 43',
    'Within SLA (%)': 21,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 44',
    'Within SLA (%)': 1,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 45',
    'Within SLA (%)': 2,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 46',
    'Within SLA (%)': 20,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 47',
    'Within SLA (%)': 90,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 48',
    'Within SLA (%)': 60,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 49',
    'Within SLA (%)': 20,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 50',
    'Within SLA (%)': 10,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 51',
    'Within SLA (%)': 21,
    'Out of SLA (%)': 100,
  },
  {
    name: 'Week 52',
    'Within SLA (%)': 1,
    'Out of SLA (%)': 100,
  },
];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}`}</p>
        <p className="value">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const tooltipStyle = {
    fontSize: '10px',
    padding: '6px',
  };


const AhjBarChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={
          data.map((item) => ({
            ...item,
            'Out of SLA (%)': 100 - item['Within SLA (%)'],
          })) as Data[]
        }
        margin={{ top: 22, right: 10, left: 10, bottom: 6 }}
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
        />
        <YAxis
          tickSize={10}
          tick={{ fontSize: 10, fontWeight: 500, fill: '#818181' }}
          tickFormatter={(value) => `${value}%`}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          wrapperStyle={{
            outline: 'none',
            borderRadius: 4,
            padding: 4,
            boxShadow: 'none',
          }}
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
