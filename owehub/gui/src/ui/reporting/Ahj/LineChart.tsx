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

type ApiData = {
  value: {
    "Within SLA"?: number;
    "Out of SLA"?: number;
  };
};

type ApiResponse = ApiData[];

interface AhjBarChartProps {
  data: ApiResponse;
}





const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div>
        <p className="label">{`OUTOF SLA: ${data['Out of SLA']}`}</p>
        <p className="label">{`WITHIN SLA: ${data['Within SLA']}`}</p>
      </div>
    );
  }

  return null;
};

const BelowUpChartAhj: React.FC<AhjBarChartProps> = ({ data }) => {
  console.log(data, "shout out")

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
        data={data.map((item, index) => ({
          name: index.toString(),
          "Out of SLA": item.value["Out of SLA"] || 0,
          "Within SLA": item.value["Within SLA"] || 0,
        }))}
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
          dataKey="Out of SLA"
          stroke="#f10000"
          strokeWidth={2}
          dot={{ r: 3, fill: '#f10000' }}
          activeDot={{ r: 4, fill: '#f10000' }}
        />
        <Line
          type="monotone"
          dataKey="Within SLA"
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
