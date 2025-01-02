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
  LabelList,
} from 'recharts';
import styles from '../styles/InstalltoFin.module.css';

interface DataPoint {
  name: string;
  'OUTOF SLA': number;
  'WITHIN SLA': number;
}
interface GraphData {
  data: DataPoint[];
  lineColor: string;
}

type ApiData = {
  value: {
    'Within SLA'?: number;
    'Out of SLA'?: number;
  };
};

type ApiResponse = ApiData[];

interface AhjBarChartProps {
  data: ApiResponse;
}


const BelowUpChartAhj: React.FC<AhjBarChartProps> = ({ data }) => {
 
  const tooltipStyle = {
    fontSize: '10px',
    padding: '6px',
  };

  return (
    <ResponsiveContainer
      width="97%"
      height="100%"
      className={'graph-container'}
    >
      <LineChart
        data={data.map((item, index) => ({
          name: index.toString(),
          'Out of SLA': item.value['Out of SLA'] || 0,
          'Within SLA': item.value['Within SLA'] || 0,
        }))}
        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
      >
        <Legend
          verticalAlign="top"
          wrapperStyle={{ paddingBottom: 20, fontSize: 12 }}
          iconSize={12}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          className={styles.axis}
          height={50}
          tickSize={10}
          angle={-45}
          dy={12}
          interval={0}
          tickFormatter={(value) => {
            const weekNumber = parseInt(value, 10) + 1;
            return `Week ${weekNumber}`;
          }}
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
            fontSize: 10,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }}
          formatter={(value) => `${Number(value)}`}
          labelFormatter={(value) => `Week ${Number(value) + 1}`}
        />
        <Line
          type="monotone"
          dataKey="Out of SLA"
          stroke="#f10000"
          strokeWidth={2}
          dot={{ r: 3, fill: '#f10000' }}
          activeDot={{ r: 4, fill: '#f10000' }}
        >
          <LabelList
            dataKey="Out of SLA"
            position="top"
            fill="#f10000"
            fontSize={8}
            offset={5}
            formatter={(value: number) => `${value.toFixed(0)}`}
          />
        </Line>
        <Line
          type="monotone"
          dataKey="Within SLA"
          stroke="#7cb342"
          strokeWidth={2}
          dot={{ r: 3, fill: '#7cb342' }}
          activeDot={{ r: 4 }}
        >
          <LabelList
            dataKey="Within SLA"
            position="bottom"
            fill="#7cb342"
            fontSize={8}
            offset={5}
            formatter={(value: number) => `${value.toFixed(0)}`}
          />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BelowUpChartAhj;
