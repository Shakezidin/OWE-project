import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  LabelList
} from 'recharts';
import styles from './styles/InstalltoFin.module.css';
import CustomSelect from './components/Dropdowns/CustomSelect';

interface LabelProps {
  x: number;
  y: number;
  width: number;
  value: number;
}

interface ChartData {
  week: number;
  low: number;
  medium: number;
  high: number;
  veryHigh: number;
  ultraHigh: number;
  extreme: number;
  totalDays: number;
}

const InstalltoFin = () => {
  const [highlightedLegend, setHighlightedLegend] = useState<string | null>(null);

  const data = [
    { week: 1, low: 10, medium: 5, high: 4, veryHigh: 7, ultraHigh: 10, extreme: 3, totalDays: 39 },
    { week: 2, low: 12, medium: 6, high: 3, veryHigh: 5, ultraHigh: 11, extreme: 4, totalDays: 41 },
    { week: 3, low: 15, medium: 8, high: 6, veryHigh: 4, ultraHigh: 9, extreme: 2, totalDays: 44 },
    { week: 4, low: 11, medium: 9, high: 7, veryHigh: 6, ultraHigh: 8, extreme: 3, totalDays: 44 },
    { week: 5, low: 13, medium: 7, high: 5, veryHigh: 4, ultraHigh: 10, extreme: 2, totalDays: 41 },
    { week: 6, low: 14, medium: 6, high: 4, veryHigh: 8, ultraHigh: 9, extreme: 3, totalDays: 44 },
    { week: 7, low: 9, medium: 12, high: 5, veryHigh: 6, ultraHigh: 10, extreme: 3, totalDays: 45 },
    { week: 8, low: 8, medium: 9, high: 6, veryHigh: 5, ultraHigh: 11, extreme: 4, totalDays: 43 },
    { week: 9, low: 10, medium: 8, high: 7, veryHigh: 6, ultraHigh: 9, extreme: 4, totalDays: 44 },
    { week: 10, low: 12, medium: 7, high: 8, veryHigh: 5, ultraHigh: 10, extreme: 3, totalDays: 45 },
    { week: 11, low: 13, medium: 9, high: 6, veryHigh: 7, ultraHigh: 8, extreme: 4, totalDays: 47 },
    { week: 12, low: 11, medium: 6, high: 5, veryHigh: 8, ultraHigh: 9, extreme: 4, totalDays: 43 },
    { week: 13, low: 15, medium: 5, high: 4, veryHigh: 7, ultraHigh: 8, extreme: 3, totalDays: 42 },
    { week: 14, low: 14, medium: 8, high: 7, veryHigh: 6, ultraHigh: 9, extreme: 3, totalDays: 47 },
    { week: 15, low: 10, medium: 10, high: 6, veryHigh: 5, ultraHigh: 7, extreme: 3, totalDays: 41 },
    { week: 16, low: 12, medium: 9, high: 5, veryHigh: 4, ultraHigh: 8, extreme: 5, totalDays: 43 },
    { week: 17, low: 11, medium: 10, high: 7, veryHigh: 6, ultraHigh: 7, extreme: 3, totalDays: 44 },
    { week: 18, low: 14, medium: 6, high: 8, veryHigh: 5, ultraHigh: 9, extreme: 3, totalDays: 45 },
    { week: 19, low: 13, medium: 7, high: 6, veryHigh: 5, ultraHigh: 10, extreme: 4, totalDays: 45 },
    { week: 20, low: 11, medium: 8, high: 7, veryHigh: 6, ultraHigh: 8, extreme: 3, totalDays: 43 },
    { week: 21, low: 12, medium: 6, high: 5, veryHigh: 9, ultraHigh: 10, extreme: 3, totalDays: 45 },
    { week: 22, low: 15, medium: 9, high: 7, veryHigh: 5, ultraHigh: 6, extreme: 3, totalDays: 45 },
    { week: 23, low: 10, medium: 10, high: 6, veryHigh: 7, ultraHigh: 8, extreme: 4, totalDays: 45 },
    { week: 24, low: 9, medium: 7, high: 8, veryHigh: 6, ultraHigh: 9, extreme: 5, totalDays: 44 },
    { week: 25, low: 13, medium: 6, high: 7, veryHigh: 5, ultraHigh: 11, extreme: 3, totalDays: 45 },
    { week: 26, low: 11, medium: 10, high: 6, veryHigh: 4, ultraHigh: 8, extreme: 4, totalDays: 43 },
    { week: 27, low: 10, medium: 8, high: 6, veryHigh: 7, ultraHigh: 9, extreme: 4, totalDays: 44 },
    { week: 28, low: 12, medium: 7, high: 5, veryHigh: 8, ultraHigh: 10, extreme: 3, totalDays: 45 },
    { week: 29, low: 14, medium: 9, high: 4, veryHigh: 7, ultraHigh: 8, extreme: 4, totalDays: 46 },
    { week: 30, low: 15, medium: 6, high: 5, veryHigh: 6, ultraHigh: 9, extreme: 4, totalDays: 45 },
    { week: 31, low: 11, medium: 10, high: 6, veryHigh: 7, ultraHigh: 10, extreme: 3, totalDays: 47 },
    { week: 32, low: 13, medium: 8, high: 7, veryHigh: 6, ultraHigh: 9, extreme: 3, totalDays: 46 },
    { week: 33, low: 12, medium: 6, high: 8, veryHigh: 5, ultraHigh: 9, extreme: 4, totalDays: 44 },
    { week: 34, low: 14, medium: 7, high: 6, veryHigh: 6, ultraHigh: 8, extreme: 4, totalDays: 45 },
    { week: 35, low: 13, medium: 9, high: 5, veryHigh: 7, ultraHigh: 8, extreme: 4, totalDays: 46 },
    { week: 36, low: 10, medium: 8, high: 7, veryHigh: 6, ultraHigh: 9, extreme: 4, totalDays: 44 },
    { week: 37, low: 9, medium: 10, high: 5, veryHigh: 7, ultraHigh: 8, extreme: 5, totalDays: 44 },
    { week: 38, low: 13, medium: 6, high: 8, veryHigh: 5, ultraHigh: 9, extreme: 4, totalDays: 45 },
    { week: 39, low: 10, medium: 9, high: 6, veryHigh: 8, ultraHigh: 7, extreme: 4, totalDays: 44 },
    { week: 40, low: 12, medium: 7, high: 8, veryHigh: 5, ultraHigh: 10, extreme: 3, totalDays: 45 },
    { week: 41, low: 11, medium: 8, high: 7, veryHigh: 6, ultraHigh: 9, extreme: 4, totalDays: 45 },
    { week: 42, low: 14, medium: 5, high: 9, veryHigh: 4, ultraHigh: 10, extreme: 4, totalDays: 46 },
    { week: 43, low: 13, medium: 9, high: 6, veryHigh: 5, ultraHigh: 8, extreme: 3, totalDays: 44 },
    { week: 44, low: 12, medium: 7, high: 8, veryHigh: 6, ultraHigh: 9, extreme: 4, totalDays: 46 },
    { week: 45, low: 14, medium: 6, high: 7, veryHigh: 8, ultraHigh: 7, extreme: 3, totalDays: 45 },
    { week: 46, low: 13, medium: 8, high: 5, veryHigh: 6, ultraHigh: 10, extreme: 3, totalDays: 45 },
    { week: 47, low: 12, medium: 7, high: 6, veryHigh: 8, ultraHigh: 9, extreme: 4, totalDays: 46 },
    { week: 48, low: 10, medium: 9, high: 8, veryHigh: 5, ultraHigh: 11, extreme: 3, totalDays: 46 },
    { week: 49, low: 14, medium: 8, high: 7, veryHigh: 6, ultraHigh: 9, extreme: 3, totalDays: 47 },
    { week: 50, low: 11, medium: 9, high: 6, veryHigh: 7, ultraHigh: 10, extreme: 4, totalDays: 47 },
    { week: 51, low: 13, medium: 8, high: 5, veryHigh: 6, ultraHigh: 8, extreme: 4, totalDays: 44 },
    { week: 52, low: 9, medium: 7, high: 6, veryHigh: 5, ultraHigh: 11, extreme: 4, totalDays: 42 },
  ];

  const handleLegendClick = (dataKey: string) => {
    setHighlightedLegend((prev) => (prev === dataKey ? null : dataKey));
  };

  const renderCustomizedLabel = ({ x, y, width, value }: LabelProps) => {
    return (
      <text
        x={x + width / 2}
        y={y - 10}
        fill="#666666"
        textAnchor="middle"
        dominantBaseline="middle"
        className={styles.barLabel}
      >
        {value}
      </text>
    );
  };

  // Format the data for the legend (day ranges)
  const getLegendLabel = (dataKey: string) => {
    switch (dataKey) {
      case 'low':
        return '0-15 days';
      case 'medium':
        return '16-30 days';
      case 'high':
        return '31-45 days';
      case 'veryHigh':
        return '46-60 days';
      case 'ultraHigh':
        return '61-90 days';
      case 'extreme':
        return '91+ days';
      default:
        return dataKey;
    }
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.selectWrapper}>
        <CustomSelect 
          options={data.map(item => ({ value: item.week.toString(), label: `Week ${item.week}` }))}
          label="Office"
        />
        <CustomSelect 
          options={data.map(item => ({ value: item.week.toString(), label: `Week ${item.week}` }))}
          label="AHJ"
        />
        <CustomSelect 
          options={data.map(item => ({ value: item.week.toString(), label: `Week ${item.week}` }))}
          label="State"
        />
        <CustomSelect 
          options={data.map(item => ({ value: item.week.toString(), label: `Week ${item.week}` }))}
          label="Quarter"
        />
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          barCategoryGap="5%"
          className={styles.barChart}
          margin={{ right: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" className={styles.grid} />
          <XAxis 
            dataKey="week" 
            className={styles.axis} 
            tickFormatter={(value) => `Week ${value}`}  // Show Week number below tickmarks
            height={50}  // Adding space for the "Week" label below tickmarks
          />
          <YAxis className={styles.axis} />
          <Tooltip wrapperClassName={styles.tooltip} />

          {/* Bars with customized labels */}
          {['low', 'medium', 'high', 'veryHigh', 'ultraHigh', 'extreme'].map((dataKey) => (
            <Bar
              key={dataKey}
              dataKey={dataKey}
              stackId="a"
              fill={highlightedLegend === dataKey ? getBarColor(dataKey) : getBarColor(dataKey)}
              opacity={highlightedLegend && highlightedLegend !== dataKey ? 0.1 : 1}
              className={styles.bar}
              label={dataKey === 'extreme' ? renderCustomizedLabel : undefined} // Label only for 'extreme' bar
            />
          ))}
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="top"
            onClick={({ dataKey }) => handleLegendClick(dataKey as string)}
            className={styles.legend}
            wrapperStyle={{ padding: "20px" }}
            formatter={getLegendLabel}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ right: 70 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="week" 
            tickFormatter={(value) => `Week ${value}`}  // Show Week number below tickmarks
            height={50} 
          />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="totalDays"
            stroke="rgb(76, 175, 80)"  // Updated line color
            activeDot={{ r: 8 }}
          >
            <LabelList
              dataKey="totalDays"
              position="top"
              fill="rgb(76, 175, 80)"
              fontSize={12}
              offset={5}
              formatter={(value: any) => value}
            />
          </Line>
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="top"
            className={styles.legend}
            wrapperStyle={{ padding: "20px" }}
            formatter={getLegendLabel}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const getBarColor = (dataKey: string) => {
  switch (dataKey) {
    case 'low':
      return 'rgb(51, 140, 0)';
    case 'medium':
      return 'rgb(124, 179, 66)';
    case 'high':
      return 'rgb(255, 168, 0)';
    case 'veryHigh':
      return 'rgb(246, 109, 0)';
    case 'ultraHigh':
      return 'rgb(242, 68, 45)';
    case 'extreme':
      return 'rgb(238, 0, 0)';
    default:
      return 'rgb(0, 0, 0)';
  }
};

export default InstalltoFin;
